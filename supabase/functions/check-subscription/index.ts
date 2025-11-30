import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

// Product ID to tier mapping
const PRODUCT_TIERS: Record<string, string> = {
  // New pricing products
  "prod_TW72izzMZyLYGt": "creator",
  "prod_TW72LrlV9fiZvi": "creator",
  "prod_TW73a6a72eGqHA": "pro",
  "prod_TW73Na0Eq5M2na": "pro",
  "prod_TW74oDdSdLDr4m": "studio",
  "prod_TW74OXOraT0tm7": "studio",
  // Old pricing products (for backwards compatibility)
  "prod_TW6wmlFLF0EktU": "creator",
  "prod_TW6xEBY4agTyYy": "creator",
  "prod_TW6x1xTWdYX40G": "studio",
  "prod_TW6xxq7Cl84XIs": "studio",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get user's profile for generation count
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("monthly_generations, generation_reset_at, subscription_tier")
      .eq("user_id", user.id)
      .single();

    let monthlyGenerations = profile?.monthly_generations || 0;
    
    // Check if we need to reset the monthly counter
    if (profile?.generation_reset_at) {
      const resetDate = new Date(profile.generation_reset_at);
      const now = new Date();
      const daysSinceReset = (now.getTime() - resetDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceReset >= 30) {
        // Reset the counter
        await supabaseClient
          .from("profiles")
          .update({ 
            monthly_generations: 0, 
            generation_reset_at: now.toISOString() 
          })
          .eq("user_id", user.id);
        monthlyGenerations = 0;
        logStep("Monthly generation count reset");
      }
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No customer found");
      return new Response(JSON.stringify({ 
        subscribed: false, 
        tier: "free",
        subscription_end: null,
        is_trial: false,
        monthly_generations: monthlyGenerations
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Check for active or trialing subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 10,
    });

    const activeSubscription = subscriptions.data.find(
      (sub: Stripe.Subscription) => sub.status === "active" || sub.status === "trialing"
    );

    if (!activeSubscription) {
      logStep("No active subscription found");
      return new Response(JSON.stringify({ 
        subscribed: false, 
        tier: "free",
        subscription_end: null,
        is_trial: false,
        monthly_generations: monthlyGenerations
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const subscriptionEnd = new Date(activeSubscription.current_period_end * 1000).toISOString();
    const productId = activeSubscription.items.data[0].price.product as string;
    const tier = PRODUCT_TIERS[productId] || "creator";
    const isTrial = activeSubscription.status === "trialing";

    logStep("Active subscription found", { 
      subscriptionId: activeSubscription.id, 
      status: activeSubscription.status,
      tier,
      isTrial
    });

    // Update subscription tier in profiles table
    await supabaseClient
      .from("profiles")
      .update({ subscription_tier: tier })
      .eq("user_id", user.id);

    return new Response(JSON.stringify({
      subscribed: true,
      tier,
      subscription_end: subscriptionEnd,
      is_trial: isTrial,
      monthly_generations: monthlyGenerations
    }), {
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
