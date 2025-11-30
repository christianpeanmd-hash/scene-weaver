import { Check, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RequestInviteModal } from "./RequestInviteModal";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription, PRICE_IDS } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";

interface PricingTier {
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: "default" | "outline";
  popular?: boolean;
  tier: "free" | "creator" | "pro" | "studio";
  note?: string;
  generationLimit: string;
}

const tiers: PricingTier[] = [
  {
    name: "Free",
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    description: "Try Techy Memo risk-free",
    features: [
      "3 generations total",
      "No login required",
      "Great for testing",
    ],
    buttonText: "Start for free",
    buttonVariant: "outline",
    tier: "free",
    generationLimit: "3 total",
    note: "Anonymous preview. Scenes aren't saved."
  },
  {
    name: "Creator",
    monthlyPrice: "$9",
    yearlyPrice: "$90",
    period: "/ month",
    description: "For individual creators",
    features: [
      "50 generations per month",
      "Save scenes, characters & styles",
      "Image & infographic prompts",
      "Export for Sora, Veo, Runway",
    ],
    buttonText: "Start 7-day free trial",
    buttonVariant: "outline",
    tier: "creator",
    generationLimit: "50/month",
  },
  {
    name: "Pro",
    monthlyPrice: "$19",
    yearlyPrice: "$190",
    period: "/ month",
    description: "For power users",
    features: [
      "200 generations per month",
      "Everything in Creator",
      "Priority generation queue",
      "Advanced templates",
    ],
    buttonText: "Start 7-day free trial",
    buttonVariant: "default",
    popular: true,
    tier: "pro",
    generationLimit: "200/month",
  },
  {
    name: "Studio",
    monthlyPrice: "$29",
    yearlyPrice: "$290",
    period: "/ month",
    description: "For teams & agencies",
    features: [
      "Unlimited generations",
      "Everything in Pro",
      "Up to 5 team members",
      "Shared libraries",
      "Priority support",
    ],
    buttonText: "Start 7-day free trial",
    buttonVariant: "outline",
    tier: "studio",
    generationLimit: "Unlimited",
  },
];

export function PricingSection() {
  const { user } = useAuth();
  const { tier: currentTier, subscribed, isTrial, startCheckout, openCustomerPortal, isLoading: subLoading } = useSubscription();
  const { toast } = useToast();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteType, setInviteType] = useState<"invite" | "enterprise">("invite");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleTierClick = async (tier: PricingTier) => {
    if (tier.tier === "free") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // If user not logged in, redirect to auth
    if (!user) {
      window.location.href = "/auth";
      return;
    }

    // If already subscribed to this tier
    if (subscribed && currentTier === tier.tier) {
      try {
        await openCustomerPortal();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to open subscription management. Please try again.",
          variant: "destructive",
        });
      }
      return;
    }

    // Start checkout
    try {
      setLoadingTier(tier.tier);
      let priceId: string;
      
      if (tier.tier === "creator") {
        priceId = billingCycle === "monthly" ? PRICE_IDS.creator.monthly : PRICE_IDS.creator.yearly;
      } else if (tier.tier === "pro") {
        priceId = billingCycle === "monthly" ? PRICE_IDS.pro.monthly : PRICE_IDS.pro.yearly;
      } else {
        priceId = billingCycle === "monthly" ? PRICE_IDS.studio.monthly : PRICE_IDS.studio.yearly;
      }
      
      await startCheckout(priceId);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start checkout",
        variant: "destructive",
      });
    } finally {
      setLoadingTier(null);
    }
  };

  const getButtonText = (tier: PricingTier) => {
    if (loadingTier === tier.tier) return "Loading...";
    if (subscribed && currentTier === tier.tier) {
      return isTrial ? "Manage Trial" : "Current Plan";
    }
    if (tier.tier === "free") return "Start for free";
    if (!user) return "Sign up to subscribe";
    return "Start 7-day free trial";
  };

  const isCurrentPlan = (tier: PricingTier) => subscribed && currentTier === tier.tier;

  return (
    <section id="pricing" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Simple, transparent pricing</h2>
          <p className="text-muted-foreground mb-6">
            Start free, upgrade when you need more.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-2 bg-muted rounded-full p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                billingCycle === "monthly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                billingCycle === "yearly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Yearly
              <span className="ml-1.5 text-xs text-primary">Save 2 months</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative bg-card border rounded-2xl p-5 flex flex-col",
                tier.popular
                  ? "border-primary shadow-lg"
                  : "border-border",
                isCurrentPlan(tier) && "ring-2 ring-primary"
              )}
            >
              {tier.popular && !isCurrentPlan(tier) && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Most popular
                  </span>
                </div>
              )}

              {isCurrentPlan(tier) && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {isTrial ? "Current Trial" : "Your Plan"}
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    {billingCycle === "monthly" ? tier.monthlyPrice : tier.yearlyPrice}
                  </span>
                  {tier.period && (
                    <span className="text-muted-foreground text-sm">
                      {billingCycle === "yearly" ? "/ year" : tier.period}
                    </span>
                  )}
                </div>
                <p className="text-xs text-primary font-medium mt-1">{tier.generationLimit}</p>
              </div>

              <ul className="space-y-2 mb-5 flex-grow">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.buttonVariant}
                size="sm"
                className={cn(
                  "w-full",
                  tier.popular && !isCurrentPlan(tier) && "bg-primary hover:bg-primary/90 text-primary-foreground"
                )}
                onClick={() => handleTierClick(tier)}
                disabled={loadingTier === tier.tier || subLoading}
              >
                {loadingTier === tier.tier && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {getButtonText(tier)}
              </Button>

              {tier.note && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {tier.note}
                </p>
              )}

              {tier.tier !== "free" && !isCurrentPlan(tier) && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  7-day free trial
                </p>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Need custom limits or more seats?{" "}
          <button
            onClick={() => {
              setInviteType("enterprise");
              setIsInviteModalOpen(true);
            }}
            className="text-primary hover:underline"
          >
            Contact us
          </button>
        </p>
      </div>

      <RequestInviteModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        type={inviteType}
      />
    </section>
  );
}
