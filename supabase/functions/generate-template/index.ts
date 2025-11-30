import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ANONYMOUS_DAILY_LIMIT = 5;

// Generation limits per tier
const TIER_LIMITS: Record<string, number> = {
  free: 5,
  creator: 50,
  pro: 200,
  studio: 999999, // Unlimited
};

interface Character {
  name: string;
  look: string;
  demeanor: string;
  role: string;
}

interface Environment {
  name: string;
  setting: string;
  lighting: string;
  audio: string;
  props: string;
}

interface GenerateRequest {
  concept: string;
  duration: number;
  videoStyle: string;
  characters: Character[];
  environments?: Environment[];
  type: 'template' | 'scene';
  sceneTitle?: string;
  sceneDescription?: string;
  styleTemplate?: string;
}

// Rate limiting helper for authenticated users
async function checkUserLimit(req: Request): Promise<{ allowed: boolean; error?: string; userId?: string; tier?: string }> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const authHeader = req.headers.get('authorization');
  
  console.log('Auth header present:', !!authHeader, authHeader ? 'starts with Bearer:' : '', authHeader?.startsWith('Bearer '));
  
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  // Check if authenticated user
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '');
    console.log('Token length:', token.length);
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    console.log('Auth getUser result:', user ? `User found: ${user.id}` : 'No user', error ? `Error: ${error.message}` : 'No error');
    
    if (user && !error) {
      // Get user's profile with subscription info
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('subscription_tier, monthly_generations, generation_reset_at')
        .eq('user_id', user.id)
        .single();
      
      const tier = profile?.subscription_tier || 'free';
      let monthlyGenerations = profile?.monthly_generations || 0;
      
      // Check if we need to reset the monthly counter
      if (profile?.generation_reset_at) {
        const resetDate = new Date(profile.generation_reset_at);
        const now = new Date();
        const daysSinceReset = (now.getTime() - resetDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceReset >= 30) {
          // Reset the counter
          await supabaseAdmin
            .from('profiles')
            .update({ 
              monthly_generations: 0, 
              generation_reset_at: now.toISOString() 
            })
            .eq('user_id', user.id);
          monthlyGenerations = 0;
        }
      }
      
      const limit = TIER_LIMITS[tier] || TIER_LIMITS.free;
      
      if (monthlyGenerations >= limit) {
        return { 
          allowed: false, 
          error: `Monthly limit of ${limit} generations reached. Upgrade your plan for more.`,
          userId: user.id,
          tier
        };
      }
      
      console.log(`User ${user.id} (${tier}): ${monthlyGenerations}/${limit} generations`);
      return { allowed: true, userId: user.id, tier };
    }
  }
  
  // Anonymous user - check IP-based rate limit
  return checkAnonymousLimit(req);
}

async function checkAnonymousLimit(req: Request): Promise<{ allowed: boolean; error?: string }> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  const encoder = new TextEncoder();
  const data = encoder.encode(clientIp + userAgent);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const ipHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  console.log('Checking rate limit for anonymous user:', ipHash.substring(0, 16));
  
  const { data: usage } = await supabaseAdmin
    .from('usage_tracking')
    .select('generation_count')
    .eq('ip_hash', ipHash)
    .single();
  
  const currentCount = usage?.generation_count || 0;
  
  if (currentCount >= ANONYMOUS_DAILY_LIMIT) {
    return { allowed: false, error: `Free limit of ${ANONYMOUS_DAILY_LIMIT} generations reached. Sign up for more.` };
  }
  
  return { allowed: true };
}

async function incrementUsage(req: Request, userId?: string, generationType: string = 'template'): Promise<void> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  // Increment for authenticated user
  if (userId) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('monthly_generations')
      .eq('user_id', userId)
      .single();
    
    await supabaseAdmin
      .from('profiles')
      .update({ monthly_generations: (profile?.monthly_generations || 0) + 1 })
      .eq('user_id', userId);
    
    // Log the generation for analytics
    await supabaseAdmin
      .from('generation_logs')
      .insert({
        user_id: userId,
        generation_type: generationType
      });
    
    console.log('Incremented generation count for user:', userId);
    return;
  }
  
  // Anonymous user tracking
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  const encoder = new TextEncoder();
  const data = encoder.encode(clientIp + userAgent);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const ipHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const userAgentHash = hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
  
  const { data: existing } = await supabaseAdmin
    .from('usage_tracking')
    .select('id, generation_count')
    .eq('ip_hash', ipHash)
    .single();
  
  if (existing) {
    await supabaseAdmin
      .from('usage_tracking')
      .update({ 
        generation_count: existing.generation_count + 1,
        last_generation_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id);
  } else {
    await supabaseAdmin
      .from('usage_tracking')
      .insert({
        ip_hash: ipHash,
        user_agent_hash: userAgentHash,
        generation_count: 1,
        last_generation_at: new Date().toISOString()
      });
  }
  
  console.log('Incremented usage for anonymous user:', ipHash.substring(0, 16));
}

const SYSTEM_PROMPT = `You are an expert video production template writer optimized for AI video generators (Veo 3, Sora). Your job is to create highly specific, structured prompts that produce consistent, high-quality video output.

CRITICAL: ALL OUTPUT MUST BE IN ENGLISH ONLY. Do not use Chinese, Japanese, Korean, or any other non-English characters. Every word, description, and detail must be written in English.

## Core Principles
1. **Specificity Over Ambiguity**: Use concrete, visual details. "Messy bun escaping from faded black cap, dark circles under eyes, coffee-stained green apron" NOT "tired-looking barista"
2. **Constraint Over Freedom**: Limit variables for consistency. Simpler settings, defined actions.
3. **Structure Over Prose**: Consistent formatting with clear sections.

## What to AVOID
- On-screen text or captions (AI renders text poorly)
- Complex VFX
- More than 2 characters
- Specific music tracks
- Detailed backgrounds
- Props that require reading
- Phrases like "Meanwhile...", "Later that day...", "Thinking about..."
- ANY non-English text or characters

## Audio Rules
- Dialogue: Under 10 words per line, max 2-4 lines total
- SFX: Ambient/environmental only, not cartoon sounds
- Music: Default to "None (ambient sound only)"

## Graphics Rule
- DEFAULT: No on-screen text, captions, or overlays
- AI generators struggle with text rendering — avoid it

When generating, INVENT all details based on the concept. Every bracketed placeholder must be filled with specific, visual, filmable content. ALL IN ENGLISH.`;

const getTemplatePrompt = (req: GenerateRequest) => {
  const charDesc = req.characters.length > 0
    ? req.characters.map(c => `- ${c.name}: Look="${c.look}", Demeanor="${c.demeanor}", Role="${c.role || 'unspecified'}"`).join('\n')
    : 'No characters specified - invent 1-2 appropriate characters based on the concept.';

  const envDesc = req.environments && req.environments.length > 0
    ? req.environments.map(e => `- ${e.name}: Setting="${e.setting}", Lighting="${e.lighting}", Audio="${e.audio}", Props="${e.props}"`).join('\n')
    : 'No environment specified - invent an appropriate setting based on the concept.';

  const durationInfo = req.duration === 8
    ? '8 seconds (Veo) - 4 beats: 0-2s (Establish), 2-4s (Action/Turn), 4-6s (Escalation), 6-8s (Punchline)'
    : req.duration === 10
    ? '10 seconds (Sora) - 5 beats: 0-2s (Establish), 2-4s (Setup), 4-6s (Turn), 6-8s (Escalation), 8-10s (Resolution)'
    : '15 seconds (Sora) - 5 beats: 0-3s (Establish), 3-6s (Setup), 6-9s (Turn), 9-12s (Escalation), 12-15s (Resolution)';

  return `Generate a COMPLETE, PRODUCTION-READY video template for AI video generators.

**Concept**: ${req.concept}
**Duration**: ${durationInfo}
**Video Style**: ${req.videoStyle || 'Invent an appropriate style based on the concept'}
**Characters**:
${charDesc}
**Environment**:
${envDesc}

Generate the template in this EXACT format. FILL IN ALL DETAILS - no placeholders allowed:

### 🎬 [Punchy 3-5 word scene title]

*[One-sentence logline of what happens]*

---

## Characters

[For each character, write:]
**Character Anchor: [Name]**
* **Look**: [Detailed physical appearance - clothing colors, textures, distinctive features, accessories, hair, skin tone, any unique characteristics]
* **Demeanor**: [How they move, speak, react. Personality traits, emotional baseline, vocal quality]
* **Role**: [Their function in this scene]

---

## Environment Anchor

**Environment: [Location Name]**
* **Setting**: [Detailed visual description of the location - architecture, colors, textures, atmosphere, key visual elements]
* **Lighting**: [Quality, color temperature, sources - natural/artificial, mood]
* **Audio Atmosphere**: [Ambient sounds, background noise, environmental audio cues]
* **Props**: [Key objects in the scene with visual details]

---

**Video Style:** [Style description]; 16:9, [camera approach], **[music note - usually "no music"]**.

---

#### 📍 Scene Setup

* **Aspect / Camera**: Horizontal 16:9, [specific camera techniques]
* **Setting**: [Incorporate environment details - textures, colors, objects, lighting quality, atmosphere. What we SEE.]
* **Lighting**: [Expand on environment lighting - quality, color temperature, mood]
* **Props**: • [Prop 1 with detail] • [Prop 2 with detail] • [Prop 3 with detail]
* **Cast**: [Character names with emotional arcs: "Name (start state → transition → end state)"]

---

#### 🎥 Visual Breakdown

| Time | Action & Framing |
|------|------------------|
[For each time beat, write a SPECIFIC action with shot type, subject, and action. Include dialogue in quotes. Example:]
| **0–2 s** | Medium on Tara reading long order ticket; slight eye twitch, exhale. |
| **2–4 s** | Quick over-shoulder: wrong milk grabbed, syrup pumps miscounted. |
[Continue for all beats based on duration]

---

#### 🔊 Audio Breakdown

* **Dialogue**
  "[Actual line 1 - under 10 words]"
  "[Actual line 2]"
  "[Button/punchline line]"
* **SFX**
  [Time range] – [Specific ambient sounds]
  [Time range] – [Action-specific sounds]
* **Music**
  None (ambient sound only).

---

#### 🎛 Direction Notes

* **Performance**: [Specific acting direction for each character - physical cues, emotional transitions, timing]
* **Camera**: [Movement priorities, emphasis moments, handheld intensity]
* **Graphics**: None.
* **Color Grade**: [Mood-appropriate grading]. Documentary clean.

---

Remember: Every element must be SPECIFIC and FILMABLE. No abstract concepts.`;
};

const getScenePrompt = (req: GenerateRequest) => {
  const charDesc = req.characters.length > 0
    ? req.characters.map(c => `- ${c.name}: Look="${c.look}", Demeanor="${c.demeanor}", Role="${c.role || 'unspecified'}"`).join('\n')
    : 'Use characters from the main concept or invent appropriate ones.';

  const envDesc = req.environments && req.environments.length > 0
    ? req.environments.map(e => `- ${e.name}: Setting="${e.setting}", Lighting="${e.lighting}", Audio="${e.audio}", Props="${e.props}"`).join('\n')
    : 'Use setting appropriate for the scene.';

  const durationInfo = req.duration === 8
    ? '8 seconds (Veo) - 4 beats: 0-2s, 2-4s, 4-6s, 6-8s'
    : req.duration === 10
    ? '10 seconds (Sora) - 5 beats: 0-2s, 2-4s, 4-6s, 6-8s, 8-10s'
    : '15 seconds (Sora) - 5 beats: 0-3s, 3-6s, 6-9s, 9-12s, 12-15s';

  const styleInstructions = req.styleTemplate
    ? `\n\n**SCENE STYLE TEMPLATE (follow this structure closely):**\n${req.styleTemplate}`
    : '';

  return `Generate a COMPLETE scene template for this scene within the larger concept.

**Overall Concept**: ${req.concept}
**Scene Title**: ${req.sceneTitle || 'Invent an appropriate title'}
**Scene Description**: ${req.sceneDescription}
**Duration**: ${durationInfo}
**Video Style**: ${req.videoStyle || 'Match to scene tone'}
**Characters**:
${charDesc}
**Environment**:
${envDesc}${styleInstructions}

Generate the scene following ${req.styleTemplate ? 'the SCENE STYLE TEMPLATE above' : 'the standard detailed format'}. Include:
- Scene title and logline
- Character blocks (if using characters)
- Environment block with detailed setting, lighting, audio atmosphere, and props
- Video style line
- Complete Scene Setup
- Full Visual Breakdown with SPECIFIC actions for each time beat
- Audio Breakdown with actual dialogue
- Direction Notes

Every detail must be SPECIFIC and PRODUCTION-READY. No placeholders.`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check rate limit first
    const limitResult = await checkUserLimit(req);
    if (!limitResult.allowed) {
      return new Response(JSON.stringify({ 
        error: limitResult.error,
        errorCode: 'RATE_LIMIT_EXCEEDED'
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body: GenerateRequest = await req.json();
    console.log('Received request:', JSON.stringify(body, null, 2));

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const userPrompt = body.type === 'scene' 
      ? getScenePrompt(body) 
      : getTemplatePrompt(body);

    console.log('Calling AI gateway...');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices?.[0]?.message?.content;
    
    if (!generatedContent) {
      throw new Error('No content generated');
    }

    // Increment usage after successful generation
    await incrementUsage(req, limitResult.userId);

    console.log('Successfully generated template');
    return new Response(JSON.stringify({ content: generatedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-template:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate template';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
