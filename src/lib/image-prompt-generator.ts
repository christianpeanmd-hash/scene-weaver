import { supabase } from "@/integrations/supabase/client";
import { IllustrationStyle } from "@/data/illustration-styles";

interface GenerateImagePromptParams {
  style: IllustrationStyle | null;
  customStyle?: string;
  imageBase64?: string | null;
  subjectDescription?: string;
  brandContext?: string;
}

export async function generateImagePrompt(params: GenerateImagePromptParams): Promise<string> {
  const { style, customStyle, imageBase64, subjectDescription, brandContext } = params;

  // Build the request body based on whether we have a preset style or custom style
  const body: Record<string, unknown> = {
    imageBase64: imageBase64,
    subjectDescription: subjectDescription || "",
    brandContext: brandContext,
  };

  if (customStyle) {
    // User provided their own style description
    body.customStyle = customStyle;
  } else if (style) {
    // User selected a preset style
    body.styleName = style.name;
    body.stylePromptTemplate = style.promptTemplate;
    body.styleLook = style.look;
    body.styleFeel = style.feel;
  }

  const { data, error } = await supabase.functions.invoke('generate-image-prompt', {
    body,
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
