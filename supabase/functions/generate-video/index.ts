import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RUNWAY_API_URL = "https://api.dev.runwayml.com/v1";

const logStep = (step: string, details?: any) => {
  console.log(`[GENERATE-VIDEO] ${step}`, details ? JSON.stringify(details) : '');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use anon key for user auth validation
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    // Use service role key for profile queries (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required for video generation' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    logStep('User authenticated', { userId: user.id });

    // Check subscription tier for video generation (premium feature) - use admin client to bypass RLS
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('subscription_tier')
      .eq('user_id', user.id)
      .single();

    logStep('Profile check', { tier: profile?.subscription_tier, error: profileError?.message });

    const allowedTiers = ['pro', 'studio'];
    if (!profile || !allowedTiers.includes(profile.subscription_tier || '')) {
      return new Response(
        JSON.stringify({ 
          error: 'Video generation is a premium feature',
          requiresUpgrade: true,
          message: 'Upgrade to Pro or Studio to generate videos directly in Memoable'
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const RUNWAY_API_KEY = Deno.env.get('RUNWAY_API_KEY');
    if (!RUNWAY_API_KEY) {
      logStep('Missing RUNWAY_API_KEY');
      return new Response(
        JSON.stringify({ error: 'Video generation service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { prompt, imageBase64, imageUrl, duration, aspectRatio, sceneId, action, taskId } = body;

    // Handle status check action
    if (action === 'check_status') {
      if (!taskId) {
        return new Response(
          JSON.stringify({ error: 'Task ID required for status check' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      logStep('Checking task status', { taskId });
      
      const statusResponse = await fetch(`${RUNWAY_API_URL}/tasks/${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${RUNWAY_API_KEY}`,
          'X-Runway-Version': '2024-11-06',
        },
      });

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        logStep('Status check failed', { status: statusResponse.status, error: errorText });
        return new Response(
          JSON.stringify({ error: 'Failed to check video status' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const taskStatus = await statusResponse.json();
      logStep('Task status', taskStatus);

      return new Response(
        JSON.stringify({
          status: taskStatus.status,
          progress: taskStatus.progress,
          videoUrl: taskStatus.output?.[0] || null,
          failure: taskStatus.failure,
          failureCode: taskStatus.failureCode,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine the API endpoint and payload based on input type
    const hasImage = !!(imageBase64 || imageUrl);
    
    // Map user-friendly aspect ratios to Runway's resolution format
    // image_to_video supports: 1280:720, 720:1280, 1104:832, 832:1104, 960:960, 1584:672
    // text_to_video supports: 1280:720, 720:1280, 1080:1920, 1920:1080
    const imageRatioMap: Record<string, string> = {
      '16:9': '1280:720',
      '9:16': '720:1280',
      '1:1': '960:960',
    };
    const textRatioMap: Record<string, string> = {
      '16:9': '1280:720',
      '9:16': '720:1280',
      '1:1': '1280:720', // 1:1 not supported for text_to_video, fallback to 16:9
    };
    
    // text_to_video duration must be 4, 6, or 8; image_to_video supports 2-10
    const validTextDurations = [4, 6, 8];
    const requestedDuration = duration || 5;
    const textDuration = validTextDurations.includes(requestedDuration) 
      ? requestedDuration 
      : (requestedDuration <= 5 ? 4 : 8);

    logStep('Processing video generation request', { 
      hasImage, 
      duration: requestedDuration,
      aspectRatio: aspectRatio || '16:9'
    });

    let endpoint: string;
    let payload: any;

    if (hasImage) {
      // Image-to-video generation - supports gen3a_turbo, gen4_turbo, veo models
      endpoint = `${RUNWAY_API_URL}/image_to_video`;
      const mappedRatio = imageRatioMap[aspectRatio] || '1280:720';
      
      let promptImage: string;
      if (imageUrl) {
        promptImage = imageUrl;
      } else if (imageBase64) {
        promptImage = imageBase64.startsWith('data:') 
          ? imageBase64 
          : `data:image/png;base64,${imageBase64}`;
      } else {
        return new Response(
          JSON.stringify({ error: 'Image required for image-to-video' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      payload = {
        model: 'gen3a_turbo',
        promptImage: promptImage,
        promptText: prompt.slice(0, 1000),
        duration: Math.min(Math.max(requestedDuration, 2), 10),
        ratio: mappedRatio,
      };
    } else {
      // Text-to-video generation - ONLY supports veo3.1, veo3.1_fast, veo3
      endpoint = `${RUNWAY_API_URL}/text_to_video`;
      const mappedRatio = textRatioMap[aspectRatio] || '1280:720';
      
      payload = {
        model: 'veo3.1',
        promptText: prompt.slice(0, 1000),
        duration: textDuration,
        ratio: mappedRatio,
        audio: false,
      };
    }

    logStep('Calling Runway API', { endpoint, model: payload.model });

    const runwayResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RUNWAY_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Runway-Version': '2024-11-06',
      },
      body: JSON.stringify(payload),
    });

    if (!runwayResponse.ok) {
      const errorText = await runwayResponse.text();
      logStep('Runway API error', { status: runwayResponse.status, error: errorText });
      
      // Parse error for better messaging
      let errorMessage = 'Video generation failed';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorJson.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: runwayResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const runwayResult = await runwayResponse.json();
    logStep('Runway task created', { taskId: runwayResult.id });

    // Update scene status if sceneId provided
    if (sceneId) {
      await supabaseAdmin
        .from('project_scenes')
        .update({ video_status: 'processing' })
        .eq('id', sceneId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        taskId: runwayResult.id,
        status: 'PENDING',
        message: 'Video generation started. Poll for status using the taskId.',
        estimatedTime: `${(duration || 5) * 6}-${(duration || 5) * 12} seconds`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logStep('Error in generate-video', { error: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage || 'Failed to generate video' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
