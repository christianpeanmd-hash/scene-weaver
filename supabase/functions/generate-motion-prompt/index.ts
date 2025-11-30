import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("API key not configured");
    }

    const { imageBase64, motionPreset, customMotion, motionDescription } = await req.json();

    console.log("Generating motion prompt with:", {
      hasImage: !!imageBase64,
      motionPreset: motionPreset || "none",
      customMotion: customMotion || "none",
      motionDescription: motionDescription || "none",
    });

    // Build the system prompt for motion generation
    const systemPrompt = `You are an expert at creating motion prompts for AI image-to-video generators like Sora and Veo.

Your task is to analyze the provided image and create a detailed motion prompt that will animate it naturally and cinematically.

Rules:
1. Output ONLY the motion prompt text - no explanations, no markdown, no formatting
2. Keep the prompt concise but descriptive (2-4 sentences)
3. Focus on natural, believable motion that suits the image content
4. Include camera movement suggestions when appropriate
5. Specify the quality and style of motion (smooth, cinematic, etc.)
6. Be specific about WHAT moves and HOW it moves
7. Keep motion subtle unless explicitly asked for dynamic movement
8. For portraits: suggest natural movements like breathing, blinking, subtle head movement
9. For landscapes: suggest atmospheric motion like clouds, wind effects, light changes
10. For objects: suggest appropriate contextual motion

Output format: Just the motion prompt text, ready to paste into Sora/Veo.`;

    // Build the user prompt
    let userPrompt = "Analyze this image and create an optimal motion prompt for animating it.";
    
    if (motionPreset) {
      userPrompt += `\n\nDesired motion style: ${motionPreset}`;
    }
    
    if (motionDescription) {
      userPrompt += `\n\nUser's motion description: ${motionDescription}`;
    }
    
    if (customMotion) {
      userPrompt += `\n\nAdditional style notes: ${customMotion}`;
    }

    // Prepare the messages for the API
    const messages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add user message with image if provided
    if (imageBase64) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          {
            type: "image_url",
            image_url: {
              url: imageBase64,
            },
          },
        ],
      });
    } else {
      messages.push({
        role: "user",
        content: userPrompt,
      });
    }

    console.log("Calling Lovable AI for motion prompt generation...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedPrompt = data.choices?.[0]?.message?.content?.trim();

    if (!generatedPrompt) {
      console.error("No prompt generated from AI response:", data);
      throw new Error("Failed to generate motion prompt");
    }

    console.log("Generated motion prompt:", generatedPrompt.substring(0, 100) + "...");

    return new Response(
      JSON.stringify({ prompt: generatedPrompt }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-motion-prompt:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
