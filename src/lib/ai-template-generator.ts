import { supabase } from "@/integrations/supabase/client";
import { Character, Scene } from "@/types/prompt-builder";

interface GenerateTemplateParams {
  concept: string;
  duration: number | null;
  videoStyle: string;
  characters: Character[];
}

interface GenerateSceneParams extends GenerateTemplateParams {
  sceneTitle: string;
  sceneDescription: string;
}

export async function generateAITemplate(params: GenerateTemplateParams): Promise<string> {
  const { data, error } = await supabase.functions.invoke('generate-template', {
    body: {
      type: 'template',
      concept: params.concept,
      duration: params.duration || 10,
      videoStyle: params.videoStyle,
      characters: params.characters.filter(c => c.name.trim() && c.look.trim() && c.demeanor.trim()),
    },
  });

  if (error) {
    console.error('Error generating template:', error);
    throw new Error(error.message || 'Failed to generate template');
  }

  if (data?.error) {
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
      sceneTitle: params.sceneTitle,
      sceneDescription: params.sceneDescription,
    },
  });

  if (error) {
    console.error('Error generating scene:', error);
    throw new Error(error.message || 'Failed to generate scene');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data.content;
}
