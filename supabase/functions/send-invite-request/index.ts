import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const ADMIN_EMAIL = "christian@techysurgeon.com";

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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message, type }: InviteRequest = await req.json();

    console.log(`New ${type} request from ${name} (${email})`);

    // For now, just log the request since Resend requires domain verification
    // In production, you would send an email using Resend or another service
    const logMessage = {
      to: ADMIN_EMAIL,
      subject: getSubject(type, name),
      body: formatEmailBody(type, name, email, message),
    };

    console.log("Email notification (would be sent):", logMessage);

    // Return success - the request was saved to database already
    return new Response(
      JSON.stringify({ success: true, message: "Request logged successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-invite-request function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
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
