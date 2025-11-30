import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExplainerRequest {
  sourceContent: string;
  references?: string;
  audience: string;
  useCase?: string;
  desiredAction?: string;
  brandStyle?: string;
  brandTokens?: string;
  tone?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      sourceContent,
      references,
      audience,
      useCase,
      desiredAction,
      brandStyle,
      brandTokens,
      tone,
    }: ExplainerRequest = await req.json();

    if (!sourceContent || !audience) {
      return new Response(
        JSON.stringify({ error: "Source content and audience are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert communications and design strategist that specializes in turning long, messy content into crisp, slide-ready one-page explainers.

Your job is to:
1. Read the source content and identify:
   - Core problem or context
   - Key insights / findings
   - Proposed solution or idea
   - Evidence, examples, or metrics
   - Clear next step for the reader

2. Rewrite this into a single-page explainer that:
   - Fits on one slide or one PDF page
   - Is skimmable with strong headings and bullets
   - Keeps only the most important details for the specified audience
   - Uses the requested tone
   - Preserves non-negotiable facts, numbers, and citations

3. Provide:
   - Clean, human-readable copy for the one-pager
   - A structured layout spec so a designer (or HTML/CSS) can easily build it
   - A clear call to action tailored to the desired next step

Do not invent data or citations. Use only what appears or is implied in the source content.
When possible, use the following section IDs: problem, why_now, solution, how_it_works, impact_or_proof, implementation_or_next_steps.
ALL OUTPUT MUST BE IN ENGLISH ONLY.`;

    const userPrompt = `Use the following inputs to create a one-page explainer.

Source content:
${sourceContent}

${references ? `Key references/links:\n${references}\n` : ""}
Audience: ${audience}
${useCase ? `Use case: ${useCase}` : ""}
${desiredAction ? `Desired action from reader: ${desiredAction}` : ""}
${tone ? `Tone: ${tone}` : ""}
${brandStyle ? `Brand style: ${brandStyle}` : ""}
${brandTokens ? `Brand tokens / style hints: ${brandTokens}` : ""}

Return your answer in valid JSON only, matching this schema:

{
  "title": "string",
  "subtitle": "string",
  "audience": "string",
  "use_case": "string",
  "sections": [
    {
      "id": "string (prefer: problem, why_now, solution, how_it_works, impact_or_proof, implementation_or_next_steps)",
      "heading": "string",
      "body": "string (2-3 sentences max)",
      "bullets": ["string (keep to 2-4 bullets max)"]
    }
  ],
  "callout_box": {
    "title": "string",
    "body": "string",
    "bullets": ["string"]
  },
  "cta": {
    "heading": "string",
    "body": "string",
    "button_text": "string",
    "suggested_link_anchor": "string"
  },
  "visual_layout": {
    "hero_block": "short description of the top band or hero visual",
    "section_order": ["section-id-1", "section-id-2", "section-id-3"],
    "design_notes": "string with any layout hints: two-column vs one-column, where to place callout box, etc."
  },
  "brand_tokens_used": {
    "primary_color": "string or null",
    "secondary_color": "string or null",
    "accent_color": "string or null",
    "font_style": "string or null",
    "tone_notes": "string"
  }
}

IMPORTANT: 
- Keep sections to 3-5 total (aim for what fits on one page)
- Each section body should be 2-3 sentences maximum
- Bullets should be concise (under 15 words each)
- Total content should be readable at a glance
- Return ONLY valid JSON, no markdown code blocks`;

    console.log("Generating explainer for audience:", audience);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response
    let explainer;
    try {
      // Clean up the response in case it has markdown code blocks
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      explainer = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    console.log("Generated explainer with title:", explainer.title);

    return new Response(
      JSON.stringify({ explainer }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-explainer:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
