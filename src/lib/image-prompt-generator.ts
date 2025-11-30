import { supabase } from "@/integrations/supabase/client";
import { IllustrationStyle } from "@/data/illustration-styles";

interface GenerateImagePromptParams {
  style: IllustrationStyle;
  imageBase64?: string | null;
  subjectDescription?: string;
}

export async function generateImagePrompt(params: GenerateImagePromptParams): Promise<string> {
  const { style, imageBase64, subjectDescription } = params;

  const { data, error } = await supabase.functions.invoke('generate-image-prompt', {
    body: {
      styleName: style.name,
      stylePromptTemplate: style.promptTemplate,
      styleLook: style.look,
      styleFeel: style.feel,
      imageBase64: imageBase64,
      subjectDescription: subjectDescription || "",
    },
  });

  if (error) {
    console.error('Error generating image prompt:', error);
    throw new Error(error.message || 'Failed to generate image prompt');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data.prompt;
}

// Generate character anchor from photo
export async function generateCharacterFromPhoto(imageBase64: string): Promise<{
  name: string;
  look: string;
  demeanor: string;
  role: string;
}> {
  const { data, error } = await supabase.functions.invoke('generate-image-prompt', {
    body: {
      type: 'character-from-photo',
      imageBase64,
    },
  });

  if (error) {
    console.error('Error generating character:', error);
    throw new Error(error.message || 'Failed to generate character from photo');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data.character;
}

// Generate environment anchor from photo
export async function generateEnvironmentFromPhoto(imageBase64: string): Promise<{
  name: string;
  setting: string;
  lighting: string;
  audio: string;
  props: string;
}> {
  const { data, error } = await supabase.functions.invoke('generate-image-prompt', {
    body: {
      type: 'environment-from-photo',
      imageBase64,
    },
  });

  if (error) {
    console.error('Error generating environment:', error);
    throw new Error(error.message || 'Failed to generate environment from photo');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data.environment;
}
