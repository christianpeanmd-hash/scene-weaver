import { Sparkles, Video, Image, Wand2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemoableLogo } from "./MemoableLogo";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  activeBuilder: "video" | "image";
  onSelectBuilder: (builder: "video" | "image") => void;
}

export function HeroSection({ activeBuilder, onSelectBuilder }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-500/15 to-teal-500/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 pt-8 pb-10 md:pt-12 md:pb-14">
        {/* Logo */}
        <div className="flex justify-center mb-6 md:mb-8 animate-fade-in">
          <MemoableLogo size="lg" />
        </div>

        {/* Tagline */}
        <div className="text-center space-y-4 mb-8 md:mb-10">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight animate-slide-up">
            Create stunning prompts for
            <span className="block gradient-text">AI-generated media</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            From idea to production-ready prompt in minutes. Build consistent characters, 
            environments, and scenes for Veo, Sora, Midjourney, and more.
          </p>
        </div>

        {/* Builder Toggle */}
        <div className="flex justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="inline-flex p-1.5 bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-lg">
            <button
              onClick={() => onSelectBuilder("video")}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm md:text-base transition-all duration-300",
                activeBuilder === "video"
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Video className="w-4 h-4 md:w-5 md:h-5" />
              <span>Video Prompts</span>
            </button>
            <button
              onClick={() => onSelectBuilder("image")}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm md:text-base transition-all duration-300",
                activeBuilder === "image"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Image className="w-4 h-4 md:w-5 md:h-5" />
              <span>Image Prompts</span>
            </button>
          </div>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <FeatureBadge icon={Sparkles} label="AI-Powered" />
          <FeatureBadge icon={Wand2} label="Production-Ready" />
          <FeatureBadge icon={ArrowRight} label="Copy & Go" />
        </div>
      </div>
    </div>
  );
}

function FeatureBadge({ icon: Icon, label }: { icon: typeof Sparkles; label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-card/60 backdrop-blur-sm border border-border/50 rounded-full text-xs md:text-sm text-muted-foreground">
      <Icon className="w-3.5 h-3.5 text-primary" />
      <span>{label}</span>
    </div>
  );
}
