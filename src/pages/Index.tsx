import { useState } from "react";
import { VideoPromptBuilder } from "@/components/VideoPromptBuilder";
import { ImagePromptBuilder } from "@/components/ImagePromptBuilder";

type BuilderType = "video" | "image";

const Index = () => {
  const [activeBuilder, setActiveBuilder] = useState<BuilderType>("video");

  return activeBuilder === "video" ? (
    <VideoPromptBuilder onSwitchToImage={() => setActiveBuilder("image")} />
  ) : (
    <ImagePromptBuilder onSwitchToVideo={() => setActiveBuilder("video")} />
  );
};

export default Index;
