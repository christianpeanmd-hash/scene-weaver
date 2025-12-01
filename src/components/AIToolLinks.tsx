import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface AITool {
  name: string;
  url: string;
  color: string;
  textColor?: string;
}

const VIDEO_TOOLS: AITool[] = [
  { name: "Veo (Gemini)", url: "https://gemini.google.com", color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30", textColor: "text-blue-600" },
  { name: "Veo 3.1 (Flow)", url: "https://labs.google/fx/tools/video-fx", color: "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30", textColor: "text-cyan-600" },
  { name: "Sora (ChatGPT)", url: "https://chatgpt.com", color: "bg-slate-500/10 hover:bg-slate-500/20 border-slate-500/30", textColor: "text-slate-600" },
  { name: "Runway", url: "https://runwayml.com", color: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30", textColor: "text-violet-600" },
  { name: "Kling", url: "https://klingai.com", color: "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30", textColor: "text-orange-600" },
];

const IMAGE_TOOLS: AITool[] = [
  { name: "Midjourney", url: "https://midjourney.com", color: "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30", textColor: "text-indigo-600" },
  { name: "Gemini", url: "https://gemini.google.com", color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30", textColor: "text-blue-600" },
  { name: "DALL-E", url: "https://openai.com/dall-e-3", color: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30", textColor: "text-emerald-600" },
  { name: "Ideogram", url: "https://ideogram.ai", color: "bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30", textColor: "text-pink-600" },
  { name: "Firefly", url: "https://firefly.adobe.com", color: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30", textColor: "text-amber-600" },
];

const INFOGRAPHIC_TOOLS: AITool[] = [
  { name: "Gemini (Nano Banana)", url: "https://aistudio.google.com", color: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30", textColor: "text-amber-600" },
  { name: "ChatGPT", url: "https://chatgpt.com", color: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30", textColor: "text-emerald-600" },
  { name: "Napkin AI", url: "https://napkin.ai", color: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30", textColor: "text-violet-600" },
  { name: "Canva", url: "https://canva.com", color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30", textColor: "text-blue-600" },
];

interface AIToolLinksProps {
  type: "video" | "image" | "infographic";
  className?: string;
}

export function AIToolLinks({ type, className }: AIToolLinksProps) {
  const tools = type === "video" ? VIDEO_TOOLS : type === "image" ? IMAGE_TOOLS : INFOGRAPHIC_TOOLS;

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs font-medium text-muted-foreground">
        Use your prompt with:
      </p>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200",
              tool.color,
              tool.textColor
            )}
          >
            {tool.name}
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        ))}
      </div>
    </div>
  );
}
