import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VideoGenerationState {
  isGenerating: boolean;
  taskId: string | null;
  status: 'idle' | 'pending' | 'running' | 'succeeded' | 'failed';
  progress: number;
  videoUrl: string | null;
  error: string | null;
}

interface GenerateVideoParams {
  prompt: string;
  imageBase64?: string;
  imageUrl?: string;
  duration?: number;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  sceneId?: string;
}

export function useVideoGeneration() {
  const [state, setState] = useState<VideoGenerationState>({
    isGenerating: false,
    taskId: null,
    status: 'idle',
    progress: 0,
    videoUrl: null,
    error: null,
  });

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const maxPollingAttempts = 120; // 10 minutes max (5 sec intervals)
  const pollingAttemptsRef = useRef(0);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    pollingAttemptsRef.current = 0;
  }, []);

  const checkStatus = useCallback(async (taskId: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-video`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.session.access_token}`,
          },
          body: JSON.stringify({ action: 'check_status', taskId }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to check status');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Status check error:', error);
      throw error;
    }
  }, []);

  const startPolling = useCallback((taskId: string, sceneId?: string) => {
    stopPolling();
    pollingAttemptsRef.current = 0;

    pollingRef.current = setInterval(async () => {
      pollingAttemptsRef.current++;

      if (pollingAttemptsRef.current > maxPollingAttempts) {
        stopPolling();
        setState(prev => ({
          ...prev,
          isGenerating: false,
          status: 'failed',
          error: 'Video generation timed out',
        }));
        toast.error('Video generation timed out');
        return;
      }

      try {
        const status = await checkStatus(taskId);

        setState(prev => ({
          ...prev,
          status: status.status?.toLowerCase() || prev.status,
          progress: status.progress || 0,
        }));

        if (status.status === 'SUCCEEDED') {
          stopPolling();
          setState(prev => ({
            ...prev,
            isGenerating: false,
            status: 'succeeded',
            videoUrl: status.videoUrl,
            progress: 100,
          }));
          
          // Update scene if sceneId provided
          if (sceneId && status.videoUrl) {
            await supabase
              .from('project_scenes')
              .update({ 
                video_url: status.videoUrl,
                video_status: 'completed'
              })
              .eq('id', sceneId);
          }
          
          toast.success('Video generated successfully!');
        } else if (status.status === 'FAILED') {
          stopPolling();
          setState(prev => ({
            ...prev,
            isGenerating: false,
            status: 'failed',
            error: status.failure || 'Video generation failed',
          }));
          
          if (sceneId) {
            await supabase
              .from('project_scenes')
              .update({ video_status: 'failed' })
              .eq('id', sceneId);
          }
          
          toast.error(status.failure || 'Video generation failed');
        }
      } catch (error) {
        console.error('Polling error:', error);
        // Don't stop polling on transient errors
      }
    }, 5000); // Poll every 5 seconds
  }, [checkStatus, stopPolling]);

  const generateVideo = useCallback(async (params: GenerateVideoParams) => {
    try {
      setState({
        isGenerating: true,
        taskId: null,
        status: 'pending',
        progress: 0,
        videoUrl: null,
        error: null,
      });

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error('Please sign in to generate videos');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-video`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.session.access_token}`,
          },
          body: JSON.stringify(params),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (result.requiresUpgrade) {
          throw new Error('Video generation requires Pro or Studio subscription');
        }
        throw new Error(result.error || 'Failed to start video generation');
      }

      setState(prev => ({
        ...prev,
        taskId: result.taskId,
        status: 'running',
      }));

      toast.info(`Video generation started. ${result.estimatedTime}`);

      // Start polling for status
      startPolling(result.taskId, params.sceneId);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({
        ...prev,
        isGenerating: false,
        status: 'failed',
        error: errorMessage,
      }));
      toast.error(errorMessage);
      throw error;
    }
  }, [startPolling]);

  const reset = useCallback(() => {
    stopPolling();
    setState({
      isGenerating: false,
      taskId: null,
      status: 'idle',
      progress: 0,
      videoUrl: null,
      error: null,
    });
  }, [stopPolling]);

  return {
    ...state,
    generateVideo,
    checkStatus,
    reset,
    stopPolling,
  };
}
