import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileBase64, fileName, fileType } = await req.json();

    if (!fileBase64) {
      throw new Error("No file data provided");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Determine the MIME type
    let mimeType = fileType;
    const ext = fileName?.toLowerCase().split('.').pop() || '';
    
    if (!mimeType || mimeType === '.' + ext) {
      switch (ext) {
        case 'pdf':
          mimeType = 'application/pdf';
          break;
        case 'doc':
          mimeType = 'application/msword';
          break;
        case 'docx':
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case 'txt':
          mimeType = 'text/plain';
          break;
        case 'md':
          mimeType = 'text/markdown';
          break;
        default:
          mimeType = 'application/octet-stream';
      }
    }

    // For text files, just decode directly
    if (mimeType === 'text/plain' || mimeType === 'text/markdown') {
      const bytes = Uint8Array.from(atob(fileBase64), c => c.charCodeAt(0));
      const text = new TextDecoder().decode(bytes);
      return new Response(JSON.stringify({ text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // For PDF and Word docs, use Gemini's vision capability to extract text
    console.log(`Processing ${fileName} (${mimeType})`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a document text extraction assistant. Your job is to extract ALL text content from the provided document accurately and completely. 

Rules:
- Extract all text exactly as it appears, preserving structure where possible
- Include headings, paragraphs, lists, and any other text content
- Do NOT summarize or interpret - just extract the raw text
- Maintain paragraph breaks with blank lines
- Convert tables to readable text format
- If the document contains multiple pages, extract from all of them
- Output ONLY the extracted text, no additional commentary`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please extract all text content from this ${ext.toUpperCase()} document named "${fileName}". Return ONLY the extracted text with proper formatting preserved.`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${fileBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI extraction failed: ${errorText}`);
    }

    const data = await response.json();
    const extractedText = data.choices?.[0]?.message?.content || "";

    if (!extractedText) {
      throw new Error("No text could be extracted from the document");
    }

    console.log(`Extracted ${extractedText.length} characters from ${fileName}`);

    return new Response(JSON.stringify({ text: extractedText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error parsing document:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to parse document" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
