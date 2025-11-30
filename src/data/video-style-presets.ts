import { Video, Camera, Tv, Film, Clapperboard, Sparkles, Zap, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface VideoStylePreset {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  prompt: string;
}

export const VIDEO_STYLE_PRESETS: VideoStylePreset[] = [
  {
    id: "cinematic",
    name: "Cinematic",
    icon: Film,
    description: "Film-quality with dramatic lighting and composition",
    prompt: "Cinematic style with shallow depth of field, dramatic lighting, film grain, widescreen 2.35:1 aspect ratio, rich color grading, motivated practical lighting, deliberate camera movements",
  },
  {
    id: "vlog-raw",
    name: "Raw Vlog",
    icon: Camera,
    description: "Authentic handheld phone footage feel",
    prompt: "Raw vlog style with obvious hand-shake, phone footage grain, natural lighting, selfie framing, authentic and unpolished feel, 16:9 horizontal",
  },
  {
    id: "commercial",
    name: "Commercial",
    icon: Tv,
    description: "Clean, polished advertising aesthetic",
    prompt: "Professional commercial style with clean bright lighting, smooth camera movements, product-focused framing, polished color grading, high production value",
  },
  {
    id: "mockumentary",
    name: "Mockumentary",
    icon: Clapperboard,
    description: "Documentary-style with interview framing",
    prompt: "Mockumentary style with handheld shoulder cam feel, slightly desaturated documentary color grade, interview framing, deadpan delivery timing",
  },
  {
    id: "social-viral",
    name: "Social Viral",
    icon: Zap,
    description: "TikTok/Reels optimized quick cuts",
    prompt: "Social media viral style with punchy quick cuts, bright well-lit scenes, exaggerated reactions, hook in first 0.5 seconds, works on mute, vertical 9:16 or horizontal 16:9",
  },
  {
    id: "aesthetic",
    name: "Aesthetic",
    icon: Sparkles,
    description: "Soft, dreamy visual style",
    prompt: "Aesthetic style with soft diffused lighting, pastel or warm color palette, gentle camera movements, dreamy atmosphere, film-like quality with subtle grain",
  },
  {
    id: "dramatic",
    name: "Dramatic",
    icon: Video,
    description: "High contrast with intense mood",
    prompt: "Dramatic style with high contrast lighting, deep shadows, intense color grading, slow deliberate movements, tension-building pacing, atmospheric sound design",
  },
  {
    id: "heartfelt",
    name: "Heartfelt",
    icon: Heart,
    description: "Warm, emotional storytelling",
    prompt: "Heartfelt style with warm golden hour lighting, intimate close-ups, soft focus backgrounds, emotional beats, genuine performances, subtle score underneath",
  },
];
