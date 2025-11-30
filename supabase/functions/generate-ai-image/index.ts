import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ANONYMOUS_DAILY_LIMIT = 10;

interface GenerateImageRequest {
  prompt: string;
  editMode?: boolean;
  sourceImageBase64?: string;
}

// Rate limiting helper
async function checkRateLimit(req: Request): Promise<{ allowed: boolean; error?: string }> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const authHeader = req.headers.get('authorization');
  
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (user && !error) {
      console.log('Authenticated user, skipping rate limit');
      return { allowed: true };
    }
  }
  
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  const encoder = new TextEncoder();
  const data = encoder.encode(clientIp + userAgent);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const ipHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  console.log('Checking rate limit for hash:', ipHash.substring(0, 16));
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data: usage } = await supabaseAdmin
    .from('usage_tracking')
    .select('generation_count')
    .eq('ip_hash', ipHash)
    .gte('updated_at', today.toISOString())
    .single();
  
  const currentCount = usage?.generation_count || 0;
  
  if (currentCount >= ANONYMOUS_DAILY_LIMIT) {
    return { allowed: false, error: 'Daily limit reached. Sign up for unlimited access.' };
  }
  
  return { allowed: true };
}

async function incrementUsage(req: Request): Promise<void> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const authHeader = req.headers.get('authorization');
  
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    if (user) return;
  }
  
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
  
  console.log('Usage incremented for hash:', ipHash.substring(0, 16));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check rate limit first
    const rateLimitResult = await checkRateLimit(req);
    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({ 
        error: rateLimitResult.error,
        errorCode: 'RATE_LIMIT_EXCEEDED'
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body: GenerateImageRequest = await req.json();
    console.log('Received image request, editMode:', body.editMode || false);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!body.prompt || body.prompt.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let messageContent: any;
    
    if (body.editMode && body.sourceImageBase64) {
      console.log('Processing image edit request...');
      messageContent = [
        {
          type: 'text',
          text: body.prompt,
        },
        {
          type: 'image_url',
          image_url: {
            url: body.sourceImageBase64,
          },
        },
      ];
    } else {
      console.log('Processing image generation request...');
      messageContent = body.prompt;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: messageContent,
          }
        ],
        modalities: ['image', 'text'],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please wait a moment and try again.',
          errorCode: 'RATE_LIMIT'
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'AI credits exhausted. Please add credits to continue.',
          errorCode: 'CREDITS_EXHAUSTED'
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    const images = data.choices?.[0]?.message?.images;
    const textContent = data.choices?.[0]?.message?.content;

    if (!images || images.length === 0) {
      console.error('No images in response:', JSON.stringify(data));
      return new Response(JSON.stringify({ 
        error: 'Failed to generate image. The AI did not return an image.',
        textResponse: textContent 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Increment usage after successful generation
    await incrementUsage(req);

    const imageUrl = images[0].image_url?.url;
    
    console.log('Successfully processed image request');
    return new Response(JSON.stringify({ 
      imageUrl,
      message: textContent || (body.editMode ? 'Image edited successfully' : 'Image generated successfully')
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-ai-image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
