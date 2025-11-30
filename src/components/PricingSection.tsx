import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useState } from "react";
import { RequestInviteModal } from "./RequestInviteModal";

interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: "default" | "outline";
  popular?: boolean;
  comingSoon?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: "Free Preview",
    price: "$0",
    description: "Try Memoable on one or two ideas",
    features: [
      "Up to 3 scene generations per browser",
      "No login, no setup",
      "Great for testing Memoable",
    ],
    buttonText: "Start for free",
    buttonVariant: "outline",
  },
  {
    name: "Creator",
    price: "$19",
    period: "/month",
    description: "For creators, educators, and marketers",
    features: [
      "Unlimited SceneBlock generations",
      "Save and reuse scenes, characters, environments",
      "Full infographic & image prompt library",
      "Export-ready prompts for Sora, Veo, Runway",
      "Priority support",
    ],
    buttonText: "Start 7-day free trial",
    buttonVariant: "default",
    popular: true,
  },
  {
    name: "Studio",
    price: "$49",
    period: "/month",
    description: "For teams and agencies",
    features: [
      "Everything in Creator, plus:",
      "Up to 5 team members",
      "Shared libraries for brands and styles",
      "Higher usage limits",
      "Dedicated support",
    ],
    buttonText: "Join waitlist",
    buttonVariant: "outline",
    comingSoon: true,
  },
];

export function PricingSection() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteType, setInviteType] = useState<"invite" | "enterprise">("invite");

  const handleTierClick = (tier: PricingTier) => {
    if (tier.name === "Free Preview") {
      // Scroll to top to start using the tool
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (tier.comingSoon) {
      setInviteType("invite");
      setIsInviteModalOpen(true);
    } else {
      // For Creator tier, open signup
      window.location.href = "/auth";
    }
  };

  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Try it free, then upgrade when you're ready to build more.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative bg-card border rounded-2xl p-6 flex flex-col",
                tier.popular
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.period && (
                    <span className="text-muted-foreground">{tier.period}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {tier.description}
                </p>
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.buttonVariant}
                className={cn(
                  "w-full",
                  tier.popular &&
                    "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white border-0"
                )}
                onClick={() => handleTierClick(tier)}
              >
                {tier.buttonText}
              </Button>

              {tier.name === "Free Preview" && (
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Anonymous preview only. Scenes aren't saved.
                </p>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Need more than 5 seats or custom limits?{" "}
          <button
            onClick={() => {
              setInviteType("enterprise");
              setIsInviteModalOpen(true);
            }}
            className="text-primary hover:underline"
          >
            Contact us for an enterprise plan
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
