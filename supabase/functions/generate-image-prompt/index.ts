import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImagePromptRequest {
  type?: 'image-prompt' | 'character-from-photo' | 'environment-from-photo' | 'infographic';
  styleName?: string;
  stylePromptTemplate?: string;
  styleLook?: string;
  styleFeel?: string;
  customStyle?: string;
  imageBase64?: string;
  subjectDescription?: string;
  brandContext?: string;
  // Infographic-specific
  styleId?: string;
  topic?: string;
  documentContent?: string;
}

const IMAGE_PROMPT_SYSTEM = `You are an expert at writing image generation prompts for AI tools like Midjourney, DALL-E, Stable Diffusion, and Firefly.

Your job is to create detailed, vivid prompts that will produce beautiful, consistent results in the specified illustration style.

RULES:
1. Be specific about colors, textures, lighting, and composition
2. Include style-specific technical terms the AI will understand
3. Keep prompts between 50-150 words for best results
4. Include aspect ratio suggestions when relevant
5. Add quality modifiers like "highly detailed", "professional quality"
6. ALL OUTPUT MUST BE IN ENGLISH ONLY`;

const CHARACTER_SYSTEM = `You are an expert at analyzing photos and creating detailed character descriptions for video production.

When given a photo, describe the person in rich detail suitable for AI video generators like Veo and Sora.

OUTPUT FORMAT (JSON):
{
  "name": "Descriptive name based on appearance (e.g., 'The Silver Fox Executive', 'Vintage Barista')",
  "look": "Detailed physical description: age range, build, distinctive features, clothing with specific colors and textures, accessories, hair, skin tone, any unique characteristics",
  "demeanor": "How they appear to carry themselves: posture, expression, energy, implied personality traits from the photo",
  "role": "Suggested archetypal role based on appearance (e.g., 'Seasoned professional navigating corporate chaos')"
}

Be specific and visual. Use concrete details, not vague terms. ALL IN ENGLISH.`;

const ENVIRONMENT_SYSTEM = `You are an expert at analyzing photos and creating detailed environment descriptions for video production.

When given a photo of a location/scene, describe it in rich detail suitable for AI video generators like Veo and Sora.

OUTPUT FORMAT (JSON):
{
  "name": "Evocative location name (e.g., 'Neon-Lit Tokyo Alley', 'Sunlit California Kitchen')",
  "setting": "Detailed visual description: architecture, colors, textures, key objects, spatial arrangement, atmosphere, time of day hints",
  "lighting": "Quality, color temperature, sources, shadows, mood created by light",
  "audio": "Implied ambient sounds: background noise, environmental audio cues that would be present",
  "props": "Key objects visible with specific details, materials, colors"
}

Be specific and filmable. ALL IN ENGLISH.`;

const INFOGRAPHIC_SYSTEM = `You are an expert at creating detailed infographic prompts for AI tools like Google Gemini (Nano Banana), ChatGPT with DALL-E, and Canva AI.

Your job is to transform topics and documents into comprehensive infographic generation prompts that produce clear, informative, visually appealing results.

RULES:
1. Create prompts that are specific and detailed
2. Include visual style guidance (colors, layout, typography hints)
3. Structure information logically for visual presentation
4. Include aspect ratio recommendations
5. Add quality modifiers for best results
6. ALL OUTPUT MUST BE IN ENGLISH ONLY
7. Make prompts ready to paste directly into AI tools`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: ImagePromptRequest = await req.json();
    console.log('Received request type:', body.type || 'image-prompt');

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt: string;
    let userPrompt: string;
    let responseFormat: 'text' | 'json' = 'text';

    if (body.type === 'character-from-photo') {
      systemPrompt = CHARACTER_SYSTEM;
      userPrompt = "Analyze this photo and create a detailed character anchor description.";
      responseFormat = 'json';
    } else if (body.type === 'environment-from-photo') {
      systemPrompt = ENVIRONMENT_SYSTEM;
      userPrompt = "Analyze this photo and create a detailed environment anchor description.";
      responseFormat = 'json';
    } else if (body.type === 'infographic') {
      systemPrompt = INFOGRAPHIC_SYSTEM;
      
      const hasDocContent = body.documentContent && body.documentContent.trim();
      const docContent = body.documentContent || '';
      
      userPrompt = `Create a detailed infographic prompt for the following:

STYLE: ${body.styleName}
TEMPLATE APPROACH: ${body.stylePromptTemplate}

${body.topic ? `TOPIC/FOCUS: ${body.topic}` : ''}

${body.brandContext ? `BRAND/THEME CONTEXT:
${body.brandContext}
Apply this brand's visual identity throughout the infographic.` : ''}

${hasDocContent ? `SOURCE DOCUMENT CONTENT:
${docContent.substring(0, 3000)}${docContent.length > 3000 ? '...[truncated]' : ''}` : ''}

Generate a complete, ready-to-use infographic prompt that:
1. Follows the style template approach but expands it with specific details
2. ${hasDocContent ? 'Extracts and organizes key information from the document' : 'Develops the topic comprehensively'}
3. Includes specific visual style guidance (colors, layout structure, typography)${body.brandContext ? ' incorporating the brand context' : ''}
4. Specifies aspect ratio (16:9 for presentations, 9:16 for social media vertical)
5. Adds quality and detail modifiers
6. Is ready to paste directly into Gemini AI Studio, ChatGPT, or similar tools

Return ONLY the prompt text, ready to use.`;
    } else {
      systemPrompt = IMAGE_PROMPT_SYSTEM;
      
      const hasImage = body.imageBase64 && body.imageBase64.startsWith('data:image');
      const hasCustomStyle = body.customStyle && body.customStyle.trim();
      
      if (hasCustomStyle) {
        // User provided their own style description
        userPrompt = `Create a detailed image generation prompt using this custom style:

STYLE DESCRIPTION: ${body.customStyle}

${body.brandContext ? `BRAND/THEME CONTEXT:
${body.brandContext}
Incorporate this brand's visual identity into the image.` : ''}

${hasImage ? 'I\'ve uploaded a reference photo. Describe the subject in the photo and incorporate it into the prompt.' : ''}
${body.subjectDescription ? `Subject description: ${body.subjectDescription}` : ''}

Generate a complete, ready-to-use prompt that:
1. Faithfully captures the user's custom style description${body.brandContext ? ' while incorporating brand elements' : ''}
2. ${hasImage ? 'Describes the subject from the photo accurately' : 'Incorporates the subject description'}
3. Includes specific style keywords and modifiers based on the custom description
4. Suggests appropriate aspect ratio
5. Is ready to paste directly into Midjourney, DALL-E, or similar tools

Return ONLY the prompt text, nothing else.`;
      } else {
        // User selected a preset style
        userPrompt = `Create a detailed image generation prompt in the "${body.styleName}" style.

STYLE CHARACTERISTICS:
- Look: ${body.styleLook}
- Feel: ${body.styleFeel}
- Base template: ${body.stylePromptTemplate}

${body.brandContext ? `BRAND/THEME CONTEXT:
${body.brandContext}
Incorporate this brand's visual identity into the image.` : ''}

${hasImage ? 'I\'ve uploaded a reference photo. Describe the subject in the photo and incorporate it into the prompt.' : ''}
${body.subjectDescription ? `Subject description: ${body.subjectDescription}` : ''}

Generate a complete, ready-to-use prompt that:
1. Captures the essence of this illustration style${body.brandContext ? ' while incorporating brand elements' : ''}
2. ${hasImage ? 'Describes the subject from the photo accurately' : 'Incorporates the subject description'}
3. Includes specific style keywords and modifiers
4. Suggests appropriate aspect ratio
5. Is ready to paste directly into Midjourney, DALL-E, or similar tools

Return ONLY the prompt text, nothing else.`;
      }
    }

    // Build messages array
    const messages: any[] = [
      { role: 'system', content: systemPrompt },
    ];

    // Handle image in message if provided
    if (body.imageBase64 && body.imageBase64.startsWith('data:image')) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: userPrompt },
          {
            type: 'image_url',
            image_url: { url: body.imageBase64 }
          }
        ]
      });
    } else {
      messages.push({ role: 'user', content: userPrompt });
    }

    console.log('Calling AI gateway...');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
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

    console.log('Successfully generated content');

    // Parse response based on type
    if (responseFormat === 'json') {
      try {
        // Extract JSON from potential markdown code blocks
        let jsonStr = generatedContent;
        const jsonMatch = generatedContent.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          jsonStr = jsonMatch[1];
        }
        const parsed = JSON.parse(jsonStr.trim());
        
        if (body.type === 'character-from-photo') {
          return new Response(JSON.stringify({ character: parsed }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          return new Response(JSON.stringify({ environment: parsed }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Failed to parse AI response');
      }
    }

    return new Response(JSON.stringify({ prompt: generatedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-image-prompt:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate prompt';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
