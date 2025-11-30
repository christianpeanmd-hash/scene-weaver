import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface SubscriptionState {
  subscribed: boolean;
  tier: "free" | "creator" | "studio";
  subscriptionEnd: string | null;
  isTrial: boolean;
  isLoading: boolean;
}

// Price IDs for each plan
export const PRICE_IDS = {
  creator: {
    monthly: "price_1SZ4isI0xQMxVy2n4mN0Admg",
    yearly: "price_1SZ4jHI0xQMxVy2nSAoqzsZS",
  },
  studio: {
    monthly: "price_1SZ4jUI0xQMxVy2nkoUMdjtU",
    yearly: "price_1SZ4jhI0xQMxVy2nR7x8LesR",
  },
};

export function useSubscription() {
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionState>({
    subscribed: false,
    tier: "free",
    subscriptionEnd: null,
    isTrial: false,
    isLoading: true,
  });

  const checkSubscription = useCallback(async () => {
    if (!session?.access_token) {
      setSubscription({
        subscribed: false,
        tier: "free",
        subscriptionEnd: null,
        isTrial: false,
        isLoading: false,
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

      setSubscription({
        subscribed: data.subscribed,
        tier: data.tier || "free",
        subscriptionEnd: data.subscription_end,
        isTrial: data.is_trial || false,
        isLoading: false,
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

  return {
    ...subscription,
    checkSubscription,
    startCheckout,
    openCustomerPortal,
  };
}
