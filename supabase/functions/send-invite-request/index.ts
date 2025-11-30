import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const ADMIN_EMAIL = "christian@techysurgeon.com";
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 requests per hour per IP

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteRequest {
  name: string;
  email: string;
  message?: string;
  type: "invite" | "contact" | "enterprise";
}

// Simple hash function for IP addresses
async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";
    
    const ipHash = await hashIP(clientIP);
    
    // Initialize Supabase client with service role for rate limit tracking
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check rate limit - count recent requests from this IP
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    
    const { count, error: countError } = await supabase
      .from("invite_requests")
      .select("*", { count: "exact", head: true })
      .gte("created_at", windowStart)
      .eq("ip_hash", ipHash);

    if (countError) {
      console.error("Rate limit check error:", countError);
    }

    if (count !== null && count >= MAX_REQUESTS_PER_WINDOW) {
      console.log(`Rate limit exceeded for IP hash: ${ipHash.substring(0, 8)}...`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email, message, type }: InviteRequest = await req.json();

    // Validate input
    if (!name || typeof name !== "string" || name.length > 100) {
      return new Response(
        JSON.stringify({ error: "Invalid name" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    if (!email || typeof email !== "string" || !email.includes("@") || email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Invalid email" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    if (message && (typeof message !== "string" || message.length > 1000)) {
      return new Response(
        JSON.stringify({ error: "Invalid message" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const validTypes = ["invite", "contact", "enterprise"];
    if (!type || !validTypes.includes(type)) {
      return new Response(
        JSON.stringify({ error: "Invalid request type" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Insert the request with IP hash for rate limiting (using service role)
    const { error: insertError } = await supabase
      .from("invite_requests")
      .insert({
        name: name.trim().substring(0, 100),
        email: email.trim().toLowerCase().substring(0, 255),
        message: message?.trim().substring(0, 1000) || null,
        request_type: type,
        ip_hash: ipHash,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to submit request" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`New ${type} request from ${name}`);

    // Log email notification (would be sent in production)
    const logMessage = {
      to: ADMIN_EMAIL,
      subject: getSubject(type, name),
      body: formatEmailBody(type, name, email, message),
    };
    console.log("Email notification (would be sent):", logMessage);

    // Return success - no submitted data returned
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-invite-request function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function getSubject(type: string, name: string): string {
  switch (type) {
    case "invite":
      return `[Memoable] New waitlist signup: ${name}`;
    case "enterprise":
      return `[Memoable] Enterprise inquiry from ${name}`;
    case "contact":
    default:
      return `[Memoable] Contact form submission from ${name}`;
  }
}

function formatEmailBody(type: string, name: string, email: string, message?: string): string {
  const typeLabel = type === "enterprise" ? "Enterprise Inquiry" : type === "invite" ? "Waitlist Signup" : "Contact Form";
  
  return `
New ${typeLabel}

Name: ${name}
Email: ${email}
${message ? `\nMessage:\n${message}` : ""}

---
Sent from Memoable Scenes
  `.trim();
}

serve(handler);
