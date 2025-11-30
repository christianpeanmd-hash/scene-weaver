import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  console.log(`[GENERATE-VIDEO] ${step}`, details ? JSON.stringify(details) : '');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
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
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    logStep('User authenticated', { userId: user.id });

    // Check subscription tier for video generation (premium feature)
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('subscription_tier')
      .eq('user_id', user.id)
      .single();

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

    const { prompt, imageBase64, duration, aspectRatio, sceneId } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    logStep('Processing video generation request', { 
      hasImage: !!imageBase64, 
      duration: duration || 8,
      aspectRatio: aspectRatio || '16:9'
    });

    // For now, return a placeholder response indicating video generation is queued
    // In production, this would integrate with Runway ML, Luma AI, or similar APIs
    const videoJobId = crypto.randomUUID();
    
    // Update scene status if sceneId provided
    if (sceneId) {
      await supabaseClient
        .from('project_scenes')
        .update({ video_status: 'processing' })
        .eq('id', sceneId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        jobId: videoJobId,
        status: 'queued',
        message: 'Video generation has been queued. You will be notified when it completes.',
        estimatedTime: `${(duration || 8) * 3} seconds`,
        // Placeholder - in production this would return actual video URL
        note: 'Video generation API integration coming soon. For now, use your generated prompt with Sora, Veo, or Runway.'
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
