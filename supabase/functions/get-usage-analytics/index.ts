import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GET-USAGE-ANALYTICS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    // Get the date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Fetch generation logs for this user
    const { data: logs, error: logsError } = await supabaseClient
      .from("generation_logs")
      .select("generation_type, created_at")
      .eq("user_id", user.id)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .order("created_at", { ascending: true });

    if (logsError) {
      logStep("Error fetching logs", { error: logsError.message });
      throw new Error(`Failed to fetch generation logs: ${logsError.message}`);
    }

    logStep("Fetched logs", { count: logs?.length || 0 });

    // Group by date
    const dailyData: Record<string, { date: string; template: number; image: number; infographic: number; total: number }> = {};
    
    // Initialize all dates in range
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dailyData[dateStr] = { date: dateStr, template: 0, image: 0, infographic: 0, total: 0 };
    }

    // Count generations per day
    (logs || []).forEach((log: { generation_type: string; created_at: string }) => {
      const dateStr = new Date(log.created_at).toISOString().split('T')[0];
      if (dailyData[dateStr]) {
        dailyData[dateStr].total += 1;
        if (log.generation_type === 'template') {
          dailyData[dateStr].template += 1;
        } else if (log.generation_type === 'image') {
          dailyData[dateStr].image += 1;
        } else if (log.generation_type === 'infographic') {
          dailyData[dateStr].infographic += 1;
        }
      }
    });

    // Convert to array and sort
    const chartData = Object.values(dailyData).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate totals
    const totals = {
      template: logs?.filter((l: { generation_type: string }) => l.generation_type === 'template').length || 0,
      image: logs?.filter((l: { generation_type: string }) => l.generation_type === 'image').length || 0,
      infographic: logs?.filter((l: { generation_type: string }) => l.generation_type === 'infographic').length || 0,
      total: logs?.length || 0,
    };

    logStep("Analytics computed", { totals });

    return new Response(JSON.stringify({ chartData, totals }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
