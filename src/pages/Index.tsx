import { useState } from "react";
import { VideoPromptBuilder } from "@/components/VideoPromptBuilder";
import { ImagePromptBuilder } from "@/components/ImagePromptBuilder";
import { InfographicPromptBuilder } from "@/components/InfographicPromptBuilder";
import { HeroSection, BuilderType } from "@/components/HeroSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";
import { FreeLimitModal } from "@/components/FreeLimitModal";
import { useUsageLimit } from "@/hooks/useUsageLimit";

const Index = () => {
  const [activeBuilder, setActiveBuilder] = useState<BuilderType>("video");
  const { showLimitModal, setShowLimitModal } = useUsageLimit();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <HeroSection 
        activeBuilder={activeBuilder} 
        onSelectBuilder={setActiveBuilder} 
      />

      {/* Builder Content */}
      <div className="relative flex-grow">
        {activeBuilder === "video" && (
          <VideoPromptBuilder onSwitchToImage={() => setActiveBuilder("image")} />
        )}
        {activeBuilder === "image" && (
          <ImagePromptBuilder onSwitchToVideo={() => setActiveBuilder("video")} />
        )}
        {activeBuilder === "infographic" && (
          <InfographicPromptBuilder />
        )}
      </div>

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <Footer />

      {/* Free Limit Modal */}
      <FreeLimitModal open={showLimitModal} onOpenChange={setShowLimitModal} />
    </div>
  );
};

export default Index;
