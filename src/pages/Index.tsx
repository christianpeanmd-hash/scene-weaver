import { useState, useRef } from "react";
import { VideoPromptBuilder } from "@/components/VideoPromptBuilder";
import { ImagePromptBuilder } from "@/components/ImagePromptBuilder";
import { InfographicPromptBuilder } from "@/components/InfographicPromptBuilder";
import { HeroSection, BuilderType } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";
import { FreeLimitModal } from "@/components/FreeLimitModal";
import { useUsageLimit } from "@/hooks/useUsageLimit";
import { Video, Image, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const [activeBuilder, setActiveBuilder] = useState<BuilderType>("video");
  const { showLimitModal, setShowLimitModal } = useUsageLimit();
  const toolRef = useRef<HTMLDivElement>(null);

  const scrollToTool = () => {
    toolRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <HeroSection onStartScene={scrollToTool} />

      {/* How it Works Section */}
      <HowItWorksSection />

      {/* Tool Section */}
      <section id="tool" ref={toolRef} className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          {/* Builder Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-muted rounded-xl">
              <button
                onClick={() => setActiveBuilder("video")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all",
                  activeBuilder === "video"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Video className="w-4 h-4" />
                <span>Video</span>
              </button>
              <button
                onClick={() => setActiveBuilder("image")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all",
                  activeBuilder === "image"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Image className="w-4 h-4" />
                <span>Image</span>
              </button>
              <button
                onClick={() => setActiveBuilder("infographic")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all",
                  activeBuilder === "infographic"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FileText className="w-4 h-4" />
                <span>Infographic</span>
              </button>
            </div>
          </div>

          {/* Builder Content */}
          <div className="relative">
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
        </div>
      </section>

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
