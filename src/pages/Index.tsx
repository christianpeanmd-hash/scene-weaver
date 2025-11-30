import { useState } from "react";
import { VideoPromptBuilder } from "@/components/VideoPromptBuilder";
import { ImagePromptBuilder } from "@/components/ImagePromptBuilder";
import { AnimatePhotoBuilder } from "@/components/AnimatePhotoBuilder";
import { InfographicPromptBuilder } from "@/components/InfographicPromptBuilder";
import { OnePageExplainerBuilder } from "@/components/OnePageExplainerBuilder";
import { HeroSection, BuilderType } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { NewsletterSection } from "@/components/NewsletterSection";
import { Footer } from "@/components/Footer";
import { FreeLimitModal } from "@/components/FreeLimitModal";
import { useUsageLimit } from "@/hooks/useUsageLimit";

const Index = () => {
  const [activeBuilder, setActiveBuilder] = useState<BuilderType>("image");
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
        {activeBuilder === "animate" && (
          <AnimatePhotoBuilder onSwitchToVideo={() => setActiveBuilder("video")} />
        )}
        {activeBuilder === "image" && (
          <ImagePromptBuilder onSwitchToVideo={() => setActiveBuilder("video")} />
        )}
        {activeBuilder === "infographic" && (
          <InfographicPromptBuilder />
        )}
        {activeBuilder === "explainer" && (
          <OnePageExplainerBuilder />
        )}
      </div>

      {/* How it Works Section */}
      <HowItWorksSection />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Footer */}
      <Footer />

      {/* Free Limit Modal */}
      <FreeLimitModal open={showLimitModal} onOpenChange={setShowLimitModal} />
    </div>
  );
};

export default Index;
