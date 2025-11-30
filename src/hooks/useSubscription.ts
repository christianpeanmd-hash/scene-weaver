import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface SubscriptionState {
  subscribed: boolean;
  tier: "free" | "creator" | "pro" | "studio";
  subscriptionEnd: string | null;
  isTrial: boolean;
  isLoading: boolean;
  monthlyGenerations: number;
  generationLimit: number;
}

// Price IDs for each plan
export const PRICE_IDS = {
  creator: {
    monthly: "price_1SZ4oII0xQMxVy2nO3fBcZeF",
    yearly: "price_1SZ4ofI0xQMxVy2n5XAJrhkK",
  },
  pro: {
    monthly: "price_1SZ4p1I0xQMxVy2nZtYWzjC8",
    yearly: "price_1SZ4paI0xQMxVy2nln4RtvIp",
  },
  studio: {
    monthly: "price_1SZ4q3I0xQMxVy2nIY46QSEq",
    yearly: "price_1SZ4qFI0xQMxVy2nuQE9lpdT",
  },
};

// Generation limits per tier
export const GENERATION_LIMITS = {
  free: 3,
  creator: 50,
  pro: 200,
  studio: 999999, // Unlimited (fair use)
};

export function useSubscription() {
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionState>({
    subscribed: false,
    tier: "free",
    subscriptionEnd: null,
    isTrial: false,
    isLoading: true,
    monthlyGenerations: 0,
    generationLimit: GENERATION_LIMITS.free,
  });

  const checkSubscription = useCallback(async () => {
    if (!session?.access_token) {
      setSubscription({
        subscribed: false,
        tier: "free",
        subscriptionEnd: null,
        isTrial: false,
        isLoading: false,
        monthlyGenerations: 0,
        generationLimit: GENERATION_LIMITS.free,
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error("Error checking subscription:", error);
        setSubscription(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const tier = data.tier || "free";
      setSubscription({
        subscribed: data.subscribed,
        tier,
        subscriptionEnd: data.subscription_end,
        isTrial: data.is_trial || false,
        isLoading: false,
        monthlyGenerations: data.monthly_generations || 0,
        generationLimit: GENERATION_LIMITS[tier as keyof typeof GENERATION_LIMITS] || GENERATION_LIMITS.free,
      });
    } catch (error) {
      console.error("Error checking subscription:", error);
      setSubscription(prev => ({ ...prev, isLoading: false }));
    }
  }, [session?.access_token]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Auto-refresh subscription status every minute
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  const startCheckout = async (priceId: string) => {
    if (!session?.access_token) {
      throw new Error("You must be logged in to subscribe");
    }

    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { priceId },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    if (data?.url) {
      window.open(data.url, "_blank");
    }
  };

  const openCustomerPortal = async () => {
    if (!session?.access_token) {
      throw new Error("You must be logged in to manage subscription");
    }

    const { data, error } = await supabase.functions.invoke("customer-portal", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    if (data?.url) {
      window.open(data.url, "_blank");
    }
  };

  const canGenerate = subscription.monthlyGenerations < subscription.generationLimit;
  const generationsRemaining = Math.max(0, subscription.generationLimit - subscription.monthlyGenerations);

  return {
    ...subscription,
    checkSubscription,
    startCheckout,
    openCustomerPortal,
    canGenerate,
    generationsRemaining,
  };
}
