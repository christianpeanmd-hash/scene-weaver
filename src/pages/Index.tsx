import { useState } from "react";
import { VideoPromptBuilder } from "@/components/VideoPromptBuilder";
import { ImagePromptBuilder } from "@/components/ImagePromptBuilder";
import { HeroSection } from "@/components/HeroSection";

type BuilderType = "video" | "image";

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
        {activeBuilder === "video" ? (
          <VideoPromptBuilder onSwitchToImage={() => setActiveBuilder("image")} />
        ) : (
          <ImagePromptBuilder onSwitchToVideo={() => setActiveBuilder("video")} />
        )}
      </div>
    </div>
  );
};

export default Index;
