import { supabase } from "@/integrations/supabase/client";
import { Character, Environment } from "@/types/prompt-builder";

interface GenerateTemplateParams {
  concept: string;
  duration: number | null;
  videoStyle: string;
  characters: Character[];
  environments?: Environment[];
}

interface GenerateSceneParams extends GenerateTemplateParams {
  sceneTitle: string;
  sceneDescription: string;
  styleTemplate?: string;
}

// Custom error class for rate limit errors
export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export async function generateAITemplate(params: GenerateTemplateParams): Promise<string> {
  const { data, error } = await supabase.functions.invoke('generate-template', {
    body: {
      type: 'template',
      concept: params.concept,
      duration: params.duration || 10,
      videoStyle: params.videoStyle,
      characters: params.characters.filter(c => c.name.trim() && c.look.trim() && c.demeanor.trim()),
      environments: params.environments?.filter(e => e.name.trim() && e.setting.trim()) || [],
    },
  });

  if (error) {
    console.error('Error generating template:', error);
    throw new Error(error.message || 'Failed to generate template');
  }

  if (data?.error) {
    // Check for rate limit error
    if (data.errorCode === 'RATE_LIMIT_EXCEEDED' || data.error.includes('limit')) {
      throw new RateLimitError(data.error);
    }
    throw new Error(data.error);
  }

  return data.content;
}

export async function generateAIScene(params: GenerateSceneParams): Promise<string> {
  const { data, error } = await supabase.functions.invoke('generate-template', {
    body: {
      type: 'scene',
      concept: params.concept,
      duration: params.duration || 10,
      videoStyle: params.videoStyle,
      characters: params.characters.filter(c => c.name.trim() && c.look.trim() && c.demeanor.trim()),
      environments: params.environments?.filter(e => e.name.trim() && e.setting.trim()) || [],
      sceneTitle: params.sceneTitle,
      sceneDescription: params.sceneDescription,
      styleTemplate: params.styleTemplate,
    },
  });

  if (error) {
    console.error('Error generating scene:', error);
    throw new Error(error.message || 'Failed to generate scene');
  }

  if (data?.error) {
    // Check for rate limit error
    if (data.errorCode === 'RATE_LIMIT_EXCEEDED' || data.error.includes('limit')) {
      throw new RateLimitError(data.error);
    }
    throw new Error(data.error);
  }

  return data.content;
}
