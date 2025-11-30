import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateImageRequest {
  prompt: string;
  // For editing existing images
  editMode?: boolean;
  sourceImageBase64?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    // Build the message content based on whether we're editing or generating
    let messageContent: any;
    
    if (body.editMode && body.sourceImageBase64) {
      // Edit mode: include the source image with the edit instruction
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
      // Generate mode: just the prompt
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

    // Extract the image from the response
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

    // Return the first generated image
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