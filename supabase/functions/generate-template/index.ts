import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Character {
  name: string;
  look: string;
  demeanor: string;
  role: string;
}

interface GenerateRequest {
  concept: string;
  duration: number;
  videoStyle: string;
  characters: Character[];
  type: 'template' | 'scene';
  sceneTitle?: string;
  sceneDescription?: string;
}

const SYSTEM_PROMPT = `You are an expert video production template writer optimized for AI video generators (Veo 3, Sora). Your job is to create highly specific, structured prompts that produce consistent, high-quality video output.

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

## Audio Rules
- Dialogue: Under 10 words per line, max 2-4 lines total
- SFX: Ambient/environmental only, not cartoon sounds
- Music: Default to "None (ambient sound only)"

## Graphics Rule
- DEFAULT: No on-screen text, captions, or overlays
- AI generators struggle with text rendering — avoid it

When generating, INVENT all details based on the concept. Every bracketed placeholder must be filled with specific, visual, filmable content.`;

const getTemplatePrompt = (req: GenerateRequest) => {
  const charDesc = req.characters.length > 0
    ? req.characters.map(c => `- ${c.name}: Look="${c.look}", Demeanor="${c.demeanor}", Role="${c.role || 'unspecified'}"`).join('\n')
    : 'No characters specified - invent 1-2 appropriate characters based on the concept.';

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

Generate the template in this EXACT format. FILL IN ALL DETAILS - no placeholders allowed:

### 🎬 [Punchy 3-5 word scene title]

*[One-sentence logline of what happens]*

---

## Characters

[For each character, write:]
**Character Anchor: [Name]**
* **Look**: [Detailed physical appearance - clothing colors, textures, distinctive features, accessories. Be specific: "wrinkled navy polo with coffee stain on collar" not "nice shirt"]
* **Demeanor**: [How they move, speak, react. Personality traits, emotional baseline, vocal quality]
* **Role**: [Their function in this scene]

---

**Video Style:** [Style description]; 16:9, [camera approach], **[music note - usually "no music"]**.

---

#### 📍 Scene Setup

* **Aspect / Camera**: Horizontal 16:9, [specific camera techniques]
* **Setting**: [Detailed location - textures, colors, objects, lighting quality, atmosphere. What we SEE.]
* **Lighting**: [Quality, color temperature, mood - e.g., "Warm cafe overheads; soft morning light through windows"]
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

  const durationInfo = req.duration === 8
    ? '8 seconds (Veo) - 4 beats: 0-2s, 2-4s, 4-6s, 6-8s'
    : req.duration === 10
    ? '10 seconds (Sora) - 5 beats: 0-2s, 2-4s, 4-6s, 6-8s, 8-10s'
    : '15 seconds (Sora) - 5 beats: 0-3s, 3-6s, 6-9s, 9-12s, 12-15s';

  return `Generate a COMPLETE scene template for this scene within the larger concept.

**Overall Concept**: ${req.concept}
**Scene Title**: ${req.sceneTitle || 'Invent an appropriate title'}
**Scene Description**: ${req.sceneDescription}
**Duration**: ${durationInfo}
**Video Style**: ${req.videoStyle || 'Match to scene tone'}
**Characters**:
${charDesc}

Generate the scene in the same detailed format as the main template. Include:
- Scene title and logline
- Character blocks (if using characters)
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
