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

    logStep('Processing video generation request', { 
      hasImage: !!(imageBase64 || imageUrl), 
      duration: duration || 5,
      aspectRatio: aspectRatio || '16:9'
    });

    // Determine the API endpoint and payload based on input type
    let endpoint: string;
    let payload: any;

    if (imageBase64 || imageUrl) {
      // Image-to-video generation
      endpoint = `${RUNWAY_API_URL}/image_to_video`;
      
      let promptImage: string;
      if (imageUrl) {
        promptImage = imageUrl;
      } else if (imageBase64) {
        // If base64, we need to format it as a data URI if not already
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
        promptText: prompt.slice(0, 512), // Max 512 characters
        duration: duration || 5, // 5 or 10 seconds
        ratio: aspectRatio || '16:9', // 16:9, 9:16, or 1:1
        watermark: false,
      };
    } else {
      // Text-to-video generation
      endpoint = `${RUNWAY_API_URL}/text_to_video`;
      
      payload = {
        model: 'gen3a_turbo',
        promptText: prompt.slice(0, 512),
        duration: duration || 5,
        ratio: aspectRatio || '16:9',
        watermark: false,
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
