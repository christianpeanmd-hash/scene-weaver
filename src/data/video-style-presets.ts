import { Video, Camera, Tv, Film, Clapperboard, Sparkles, Zap, Heart, GraduationCap, Laugh, Ghost, Palette, Music, Swords, Rewind, Volume2, TreePine, Search, Crown, Rocket, Baby, Skull, Stars, Wand2 } from "lucide-react";
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
    id: "comedy-skit",
    name: "Comedy Skit",
    icon: Laugh,
    description: "Timing-focused comedic delivery",
    prompt: "Comedy skit style with snappy timing, reaction shots, comedic pauses, bright even lighting, quick cuts on punchlines, exaggerated performances",
  },
  {
    id: "horror",
    name: "Horror",
    icon: Ghost,
    description: "Unsettling, suspenseful atmosphere",
    prompt: "Horror style with low-key lighting, deep shadows, unsettling angles, slow creeping camera moves, desaturated cold tones, suspenseful pacing, jump scare timing",
  },
  {
    id: "anime",
    name: "Anime",
    icon: Palette,
    description: "Japanese animation aesthetic",
    prompt: "Anime style with cel-shaded look, vibrant colors, dramatic speed lines, exaggerated expressions, dynamic action poses, cherry blossom particles, manga panel transitions",
  },
  {
    id: "music-video",
    name: "Music Video",
    icon: Music,
    description: "Stylized performance visuals",
    prompt: "Music video style with dramatic lighting changes, smoke and haze, rhythmic cuts synced to beat, lens flares, slow-motion moments, stylized color grading, performance energy",
  },
  {
    id: "action",
    name: "Action",
    icon: Swords,
    description: "High-energy dynamic sequences",
    prompt: "Action style with dynamic camera movement, speed ramping, impactful cuts, dramatic angles, motion blur, intense color grading, adrenaline pacing",
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
  {
    id: "educational",
    name: "Educational",
    icon: GraduationCap,
    description: "Clear, informative explainer style",
    prompt: "Educational style with clean well-lit framing, presenter-facing camera, clear visual hierarchy, animated graphics overlay areas, steady tripod shots, talking-head with B-roll cutaways, neutral background, professional but approachable tone",
  },
  {
    id: "retro-80s",
    name: "Retro 80s",
    icon: Rewind,
    description: "Neon-soaked synthwave nostalgia",
    prompt: "1980s retro style with neon pink and cyan color palette, VHS scan lines and tracking artifacts, chrome text effects, grid landscapes, lens flares, synthesizer-driven aesthetic, Miami Vice vibes",
  },
  {
    id: "silent-film",
    name: "Silent Film",
    icon: Volume2,
    description: "Classic black & white era",
    prompt: "Silent film era style with black and white footage, film scratches and dust, vignette edges, exaggerated theatrical acting, intertitle cards for dialogue, piano accompaniment feel, 18fps slightly sped-up motion",
  },
  {
    id: "nature-doc",
    name: "Nature Documentary",
    icon: TreePine,
    description: "David Attenborough wildlife style",
    prompt: "Nature documentary style with telephoto lens compression, patient observational shots, golden hour wildlife lighting, hushed narrator pacing, slow zooms on subjects, ambient nature sounds, BBC Earth aesthetic",
  },
  {
    id: "true-crime",
    name: "True Crime",
    icon: Search,
    description: "Investigation mystery aesthetic",
    prompt: "True crime documentary style with dramatic reenactments, evidence photos with zoom, interview talking heads with dark backgrounds, tense string music, newspaper clipping overlays, grainy surveillance footage flashbacks",
  },
  {
    id: "fairytale",
    name: "Fairytale",
    icon: Wand2,
    description: "Magical storybook enchantment",
    prompt: "Fairytale style with soft dreamy glow, magical particle effects, saturated jewel-tone colors, storybook framing, enchanted forest atmosphere, whimsical camera movements, Disney-inspired warmth",
  },
  {
    id: "sci-fi-epic",
    name: "Sci-Fi Epic",
    icon: Rocket,
    description: "Grand space opera visuals",
    prompt: "Science fiction epic style with vast establishing shots, sleek futuristic design, blue and orange contrast, lens flares, holographic UI elements, epic orchestral pacing, Blade Runner meets Star Wars aesthetic",
  },
  {
    id: "stop-motion",
    name: "Stop Motion",
    icon: Baby,
    description: "Handcrafted claymation feel",
    prompt: "Stop motion animation style with visible frame-by-frame movement, slight texture wobble, handcrafted miniature set feel, warm practical lighting, Wes Anderson color palette, Laika Studios craftsmanship",
  },
  {
    id: "noir",
    name: "Film Noir",
    icon: Skull,
    description: "1940s detective mystery",
    prompt: "Film noir style with high contrast black and white, venetian blind shadow patterns, cigarette smoke, rain-slicked streets, femme fatale framing, jazz undertones, cynical voiceover aesthetic",
  },
  {
    id: "fantasy-epic",
    name: "Fantasy Epic",
    icon: Crown,
    description: "Lord of the Rings grandeur",
    prompt: "Fantasy epic style with sweeping landscape shots, medieval castle atmosphere, golden hour lighting, dramatic battle framing, orchestral swell pacing, practical armor and weapons, New Zealand vista aesthetic",
  },
  {
    id: "dreamy-surreal",
    name: "Dreamy Surreal",
    icon: Stars,
    description: "Ethereal otherworldly visuals",
    prompt: "Surrealist dream style with impossible geometry, floating objects, soft focus transitions, non-linear time, pastel and neon color contrasts, underwater movement on land, Salvador Dali meets Terrence Malick",
  },
];
