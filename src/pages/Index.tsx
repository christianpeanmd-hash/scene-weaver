import { useState } from "react";
import { VideoPromptBuilder } from "@/components/VideoPromptBuilder";
import { ImagePromptBuilder } from "@/components/ImagePromptBuilder";
import { InfographicPromptBuilder } from "@/components/InfographicPromptBuilder";
import { HeroSection, BuilderType } from "@/components/HeroSection";

const Index = () => {
  const [activeBuilder, setActiveBuilder] = useState<BuilderType>("video");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection 
        activeBuilder={activeBuilder} 
        onSelectBuilder={setActiveBuilder} 
      />

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
  );
};

export default Index;
