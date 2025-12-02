import { Video, Camera, Tv, Film, Clapperboard, Sparkles, Zap, Heart, GraduationCap, Laugh, Ghost, Palette, Music, Swords, Rewind, Volume2, TreePine, Search, Crown, Rocket, Baby, Skull, Stars, Wand2, Gamepad, Mic, Globe, Coffee, Trophy, Utensils, Shirt, Home, Briefcase, Plane, PartyPopper, Stethoscope, Scale, BookOpen, FlaskConical, MessageCircle, TrendingUp, Megaphone, Lightbulb, Target, Users, Timer, Eye, Repeat, Play, Image, Anchor, Mountain, Compass, Moon, Sun, Cloud, Cog, Building } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface VideoStylePreset {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  prompt: string;
  category: string;
}

export interface VideoStyleCategory {
  name: string;
  icon: LucideIcon;
  presets: VideoStylePreset[];
}

export const VIDEO_STYLE_CATEGORIES: VideoStyleCategory[] = [
  {
    name: "Cinematic",
    icon: Film,
    presets: [
      {
        id: "cinematic",
        name: "Cinematic",
        icon: Film,
        description: "Film-quality with dramatic lighting",
        prompt: "Cinematic style with shallow depth of field, dramatic lighting, film grain, widescreen 2.35:1 aspect ratio, rich color grading, motivated practical lighting, deliberate camera movements",
        category: "Cinematic"
      },
      {
        id: "noir",
        name: "Film Noir",
        icon: Skull,
        description: "1940s detective mystery",
        prompt: "Film noir style with high contrast black and white, venetian blind shadow patterns, cigarette smoke, rain-slicked streets, femme fatale framing, jazz undertones, cynical voiceover aesthetic",
        category: "Cinematic"
      },
      {
        id: "dramatic",
        name: "Dramatic",
        icon: Video,
        description: "High contrast intense mood",
        prompt: "Dramatic style with high contrast lighting, deep shadows, intense color grading, slow deliberate movements, tension-building pacing, atmospheric sound design",
        category: "Cinematic"
      },
      {
        id: "heartfelt",
        name: "Heartfelt",
        icon: Heart,
        description: "Warm emotional storytelling",
        prompt: "Heartfelt style with warm golden hour lighting, intimate close-ups, soft focus backgrounds, emotional beats, genuine performances, subtle score underneath",
        category: "Cinematic"
      },
      {
        id: "epic-blockbuster",
        name: "Epic Blockbuster",
        icon: Crown,
        description: "Big-budget Hollywood feel",
        prompt: "Epic blockbuster style with sweeping establishing shots, IMAX-worthy framing, dramatic orchestral score feel, lens flares, slow-motion hero moments, massive scale",
        category: "Cinematic"
      },
    ]
  },
  {
    name: "Social & Viral",
    icon: Zap,
    presets: [
      {
        id: "social-viral",
        name: "Social Viral",
        icon: Zap,
        description: "TikTok/Reels optimized",
        prompt: "Social media viral style with punchy quick cuts, bright well-lit scenes, exaggerated reactions, hook in first 0.5 seconds, works on mute, vertical 9:16 or horizontal 16:9",
        category: "Social & Viral"
      },
      {
        id: "vlog-raw",
        name: "Raw Vlog",
        icon: Camera,
        description: "Authentic handheld footage",
        prompt: "Raw vlog style with obvious hand-shake, phone footage grain, natural lighting, selfie framing, authentic and unpolished feel, 16:9 horizontal",
        category: "Social & Viral"
      },
      {
        id: "asmr",
        name: "ASMR",
        icon: Mic,
        description: "Satisfying sensory focus",
        prompt: "ASMR style with extreme close-ups, detailed textures, soft whispery ambiance, slow deliberate movements, satisfying sounds emphasized, intimate camera angles",
        category: "Social & Viral"
      },
      {
        id: "day-in-life",
        name: "Day in the Life",
        icon: Sun,
        description: "Morning routine aesthetic",
        prompt: "Day-in-the-life style with golden morning light, cozy aesthetic, montage transitions, ambient lo-fi feel, casual authentic moments, aesthetic B-roll",
        category: "Social & Viral"
      },
      {
        id: "transition-magic",
        name: "Transition Magic",
        icon: Repeat,
        description: "Seamless creative cuts",
        prompt: "Transition-focused style with seamless cuts, match-on-action transitions, creative wardrobe changes, snap-cut magic, satisfying visual flow",
        category: "Social & Viral"
      },
    ]
  },
  {
    name: "Comedy",
    icon: Laugh,
    presets: [
      {
        id: "comedy-skit",
        name: "Comedy Skit",
        icon: Laugh,
        description: "Timing-focused comedic delivery",
        prompt: "Comedy skit style with snappy timing, reaction shots, comedic pauses, bright even lighting, quick cuts on punchlines, exaggerated performances",
        category: "Comedy"
      },
      {
        id: "mockumentary",
        name: "Mockumentary",
        icon: Clapperboard,
        description: "Documentary-style interview",
        prompt: "Mockumentary style with handheld shoulder cam feel, slightly desaturated documentary color grade, interview framing, deadpan delivery timing",
        category: "Comedy"
      },
      {
        id: "sitcom",
        name: "Sitcom",
        icon: Tv,
        description: "Multi-cam laugh track feel",
        prompt: "Classic sitcom style with bright flat lighting, three-camera setup feel, predictable framing, pause for laughs timing, living room set aesthetic",
        category: "Comedy"
      },
      {
        id: "parody",
        name: "Parody",
        icon: Target,
        description: "Satirical genre spoof",
        prompt: "Parody style mimicking target genre conventions but exaggerated, satirical tone, self-aware humor, genre tropes played for laughs",
        category: "Comedy"
      },
      {
        id: "meme-format",
        name: "Meme Format",
        icon: MessageCircle,
        description: "Internet humor template",
        prompt: "Meme video style with recognizable formats, ironic editing, bass-boosted moments, zoom-in reactions, intentionally rough cuts, internet humor timing",
        category: "Comedy"
      },
    ]
  },
  {
    name: "Commercial",
    icon: Tv,
    presets: [
      {
        id: "commercial",
        name: "Commercial",
        icon: Tv,
        description: "Clean polished advertising",
        prompt: "Professional commercial style with clean bright lighting, smooth camera movements, product-focused framing, polished color grading, high production value",
        category: "Commercial"
      },
      {
        id: "product-hero",
        name: "Product Hero",
        icon: Sparkles,
        description: "Apple-style product shots",
        prompt: "Product hero style with minimalist backgrounds, dramatic lighting on product, slow rotating shots, macro detail shots, premium feel, seamless white or black backdrop",
        category: "Commercial"
      },
      {
        id: "testimonial",
        name: "Testimonial",
        icon: Users,
        description: "Customer review style",
        prompt: "Testimonial style with authentic-feeling interviews, natural lighting, documentary approach, B-roll cutaways, genuine emotional delivery",
        category: "Commercial"
      },
      {
        id: "before-after",
        name: "Before/After",
        icon: TrendingUp,
        description: "Transformation reveal",
        prompt: "Before-after style with side-by-side or split-screen reveals, dramatic transformation timing, satisfying result shots, clear visual comparison",
        category: "Commercial"
      },
      {
        id: "infomercial",
        name: "Infomercial",
        icon: Megaphone,
        description: "Over-the-top selling",
        prompt: "Infomercial style with black and white 'problem' shots, color 'solution' reveal, enthusiastic presenter, text overlays, 'but wait there's more' energy",
        category: "Commercial"
      },
    ]
  },
  {
    name: "Educational",
    icon: GraduationCap,
    presets: [
      {
        id: "educational",
        name: "Educational",
        icon: GraduationCap,
        description: "Clear informative explainer",
        prompt: "Educational style with clean well-lit framing, presenter-facing camera, clear visual hierarchy, animated graphics overlay areas, steady tripod shots, talking-head with B-roll cutaways",
        category: "Educational"
      },
      {
        id: "whiteboard",
        name: "Whiteboard",
        icon: BookOpen,
        description: "Hand-drawn explanation",
        prompt: "Whiteboard animation style with hand drawing graphics, simple line art, step-by-step reveal, clean white background, marker sound effects feel",
        category: "Educational"
      },
      {
        id: "tutorial",
        name: "Tutorial",
        icon: Lightbulb,
        description: "Step-by-step guide",
        prompt: "Tutorial style with screen recording feel, clear numbered steps, pause on key moments, zoom-in on details, helpful annotations, patient pacing",
        category: "Educational"
      },
      {
        id: "science-explainer",
        name: "Science Explainer",
        icon: FlaskConical,
        description: "Kurzgesagt-inspired",
        prompt: "Science explainer style with flat vector animations, smooth transitions, cosmic zoom outs, cell and atom close-ups, optimistic color palette, clear visual metaphors",
        category: "Educational"
      },
      {
        id: "ted-talk",
        name: "TED Talk",
        icon: Mic,
        description: "Inspirational presentation",
        prompt: "TED Talk style with single speaker on stage, red circle floor, dramatic lighting, passionate delivery, audience reaction shots, idea-focused framing",
        category: "Educational"
      },
    ]
  },
  {
    name: "Documentary",
    icon: Search,
    presets: [
      {
        id: "nature-doc",
        name: "Nature Documentary",
        icon: TreePine,
        description: "David Attenborough style",
        prompt: "Nature documentary style with telephoto lens compression, patient observational shots, golden hour wildlife lighting, hushed narrator pacing, slow zooms on subjects, BBC Earth aesthetic",
        category: "Documentary"
      },
      {
        id: "true-crime",
        name: "True Crime",
        icon: Search,
        description: "Investigation mystery",
        prompt: "True crime documentary style with dramatic reenactments, evidence photos with zoom, interview talking heads with dark backgrounds, tense string music, newspaper clipping overlays",
        category: "Documentary"
      },
      {
        id: "street-interview",
        name: "Street Interview",
        icon: Mic,
        description: "Man on the street",
        prompt: "Street interview style with handheld camera, public location, candid responses, natural audio with background noise, documentary authenticity",
        category: "Documentary"
      },
      {
        id: "historical",
        name: "Historical",
        icon: BookOpen,
        description: "Ken Burns archival",
        prompt: "Historical documentary style with slow pan on photos, sepia tone archival footage, dramatic narration pauses, expert interview cutaways, timeline graphics",
        category: "Documentary"
      },
    ]
  },
  {
    name: "Animation",
    icon: Palette,
    presets: [
      {
        id: "anime",
        name: "Anime",
        icon: Palette,
        description: "Japanese animation aesthetic",
        prompt: "Anime style with cel-shaded look, vibrant colors, dramatic speed lines, exaggerated expressions, dynamic action poses, cherry blossom particles, manga panel transitions",
        category: "Animation"
      },
      {
        id: "stop-motion",
        name: "Stop Motion",
        icon: Baby,
        description: "Handcrafted claymation",
        prompt: "Stop motion animation style with visible frame-by-frame movement, slight texture wobble, handcrafted miniature set feel, warm practical lighting, Laika Studios craftsmanship",
        category: "Animation"
      },
      {
        id: "pixar-3d",
        name: "Pixar 3D",
        icon: Sparkles,
        description: "Modern CGI animation",
        prompt: "Pixar-style 3D animation with expressive characters, detailed textures, gorgeous lighting, emotional storytelling moments, family-friendly aesthetic, smooth animation",
        category: "Animation"
      },
      {
        id: "flat-motion",
        name: "Flat Motion Graphics",
        icon: Play,
        description: "Clean vector animation",
        prompt: "Flat motion graphics style with bold colors, geometric shapes, smooth easing transitions, minimal shadows, modern corporate animation feel",
        category: "Animation"
      },
      {
        id: "cartoon-retro",
        name: "Retro Cartoon",
        icon: Tv,
        description: "Classic hand-drawn",
        prompt: "Retro cartoon style with rubber hose animation, exaggerated squash and stretch, simple backgrounds, bold outlines, 1930s Fleischer Studios aesthetic",
        category: "Animation"
      },
    ]
  },
  {
    name: "Genre",
    icon: Ghost,
    presets: [
      {
        id: "horror",
        name: "Horror",
        icon: Ghost,
        description: "Unsettling suspense",
        prompt: "Horror style with low-key lighting, deep shadows, unsettling angles, slow creeping camera moves, desaturated cold tones, suspenseful pacing, jump scare timing",
        category: "Genre"
      },
      {
        id: "sci-fi-epic",
        name: "Sci-Fi Epic",
        icon: Rocket,
        description: "Space opera visuals",
        prompt: "Science fiction epic style with vast establishing shots, sleek futuristic design, blue and orange contrast, lens flares, holographic UI elements, epic orchestral pacing",
        category: "Genre"
      },
      {
        id: "fantasy-epic",
        name: "Fantasy Epic",
        icon: Crown,
        description: "Lord of the Rings grandeur",
        prompt: "Fantasy epic style with sweeping landscape shots, medieval castle atmosphere, golden hour lighting, dramatic battle framing, orchestral swell pacing",
        category: "Genre"
      },
      {
        id: "action",
        name: "Action",
        icon: Swords,
        description: "High-energy dynamic",
        prompt: "Action style with dynamic camera movement, speed ramping, impactful cuts, dramatic angles, motion blur, intense color grading, adrenaline pacing",
        category: "Genre"
      },
      {
        id: "thriller",
        name: "Thriller",
        icon: Eye,
        description: "Tense psychological",
        prompt: "Thriller style with claustrophobic framing, paranoid camera movements, muted colors, tension-building cuts, unsettling close-ups, dread-inducing pacing",
        category: "Genre"
      },
      {
        id: "romance",
        name: "Romance",
        icon: Heart,
        description: "Dreamy love story",
        prompt: "Romance style with soft diffused lighting, dreamy bokeh backgrounds, intimate two-shots, warm color palette, tender moment pacing, meaningful glances",
        category: "Genre"
      },
    ]
  },
  {
    name: "Retro & Vintage",
    icon: Rewind,
    presets: [
      {
        id: "retro-80s",
        name: "Retro 80s",
        icon: Rewind,
        description: "Neon synthwave nostalgia",
        prompt: "1980s retro style with neon pink and cyan color palette, VHS scan lines and tracking artifacts, chrome text effects, grid landscapes, lens flares, synthesizer-driven aesthetic",
        category: "Retro & Vintage"
      },
      {
        id: "silent-film",
        name: "Silent Film",
        icon: Volume2,
        description: "Classic black & white era",
        prompt: "Silent film era style with black and white footage, film scratches and dust, vignette edges, exaggerated theatrical acting, intertitle cards for dialogue, 18fps motion",
        category: "Retro & Vintage"
      },
      {
        id: "vhs-camcorder",
        name: "VHS Camcorder",
        icon: Camera,
        description: "Home video nostalgia",
        prompt: "VHS camcorder style with tracking lines, date stamp overlay, auto-focus hunting, washed out colors, tape hiss audio feel, family video authenticity",
        category: "Retro & Vintage"
      },
      {
        id: "70s-funk",
        name: "70s Funk",
        icon: Music,
        description: "Disco era aesthetic",
        prompt: "1970s funk style with warm amber tones, split screens, zoom lens push-ins, disco lighting, afros and bell bottoms aesthetic, groovy transitions",
        category: "Retro & Vintage"
      },
      {
        id: "90s-mtv",
        name: "90s MTV",
        icon: Tv,
        description: "Music video era",
        prompt: "1990s MTV style with fisheye lens, quick cuts, saturated colors, handheld energy, teen drama aesthetic, pop punk vibes",
        category: "Retro & Vintage"
      },
    ]
  },
  {
    name: "Music & Performance",
    icon: Music,
    presets: [
      {
        id: "music-video",
        name: "Music Video",
        icon: Music,
        description: "Stylized performance",
        prompt: "Music video style with dramatic lighting changes, smoke and haze, rhythmic cuts synced to beat, lens flares, slow-motion moments, stylized color grading, performance energy",
        category: "Music & Performance"
      },
      {
        id: "concert",
        name: "Concert",
        icon: Mic,
        description: "Live performance energy",
        prompt: "Concert style with stage lighting beams, crowd shots, dramatic silhouettes, sweat and energy, handheld camera movement, live audio feel",
        category: "Music & Performance"
      },
      {
        id: "lyric-video",
        name: "Lyric Video",
        icon: MessageCircle,
        description: "Animated typography",
        prompt: "Lyric video style with kinetic typography, words appearing on beat, minimal backgrounds, creative text animations, mood-matching colors",
        category: "Music & Performance"
      },
      {
        id: "dance-performance",
        name: "Dance Performance",
        icon: Users,
        description: "Choreography showcase",
        prompt: "Dance performance style with wide shots for formations, quick cuts on hits, floor-level angles, dramatic lighting, synchronized movement emphasis",
        category: "Music & Performance"
      },
    ]
  },
  {
    name: "Aesthetic & Mood",
    icon: Sparkles,
    presets: [
      {
        id: "aesthetic",
        name: "Aesthetic",
        icon: Sparkles,
        description: "Soft dreamy visual",
        prompt: "Aesthetic style with soft diffused lighting, pastel or warm color palette, gentle camera movements, dreamy atmosphere, film-like quality with subtle grain",
        category: "Aesthetic & Mood"
      },
      {
        id: "dreamy-surreal",
        name: "Dreamy Surreal",
        icon: Stars,
        description: "Ethereal otherworldly",
        prompt: "Surrealist dream style with impossible geometry, floating objects, soft focus transitions, non-linear time, pastel and neon color contrasts, underwater movement on land",
        category: "Aesthetic & Mood"
      },
      {
        id: "fairytale",
        name: "Fairytale",
        icon: Wand2,
        description: "Magical storybook",
        prompt: "Fairytale style with soft dreamy glow, magical particle effects, saturated jewel-tone colors, storybook framing, enchanted forest atmosphere, whimsical camera movements",
        category: "Aesthetic & Mood"
      },
      {
        id: "cozy-hygge",
        name: "Cozy Hygge",
        icon: Coffee,
        description: "Warm comfortable",
        prompt: "Cozy hygge style with warm tungsten lighting, candle flickers, soft textures, intimate framing, rainy window backgrounds, comfortable domestic settings",
        category: "Aesthetic & Mood"
      },
      {
        id: "dark-moody",
        name: "Dark Moody",
        icon: Moon,
        description: "Atmospheric shadows",
        prompt: "Dark moody style with heavy shadows, minimal lighting, atmospheric haze, noir-influenced framing, desaturated colors, contemplative pacing",
        category: "Aesthetic & Mood"
      },
    ]
  },
  {
    name: "Professional",
    icon: Briefcase,
    presets: [
      {
        id: "corporate",
        name: "Corporate",
        icon: Building,
        description: "Business professional",
        prompt: "Corporate video style with clean office backgrounds, professional attire, neutral color palette, steady tripod shots, lower-third graphics, polished business feel",
        category: "Professional"
      },
      {
        id: "real-estate",
        name: "Real Estate",
        icon: Home,
        description: "Property showcase",
        prompt: "Real estate style with wide-angle interiors, gimbal smooth movements, golden hour exterior shots, drone aerials, room-by-room flow, aspirational lifestyle feel",
        category: "Professional"
      },
      {
        id: "medical",
        name: "Medical",
        icon: Stethoscope,
        description: "Healthcare professional",
        prompt: "Medical video style with clean clinical environments, white coats, warm reassuring tone, patient testimonials, procedure B-roll, trustworthy professional feel",
        category: "Professional"
      },
      {
        id: "legal",
        name: "Legal",
        icon: Scale,
        description: "Law firm authority",
        prompt: "Legal video style with mahogany office backgrounds, bookshelves with law books, authoritative framing, serious but approachable tone, professional gravitas",
        category: "Professional"
      },
    ]
  },
  {
    name: "Lifestyle",
    icon: Globe,
    presets: [
      {
        id: "travel",
        name: "Travel",
        icon: Plane,
        description: "Wanderlust adventure",
        prompt: "Travel video style with drone establishing shots, golden hour landscapes, cultural immersion moments, local food close-ups, upbeat pacing, bucket-list destinations",
        category: "Lifestyle"
      },
      {
        id: "food",
        name: "Food",
        icon: Utensils,
        description: "Culinary showcase",
        prompt: "Food video style with macro texture shots, steam rising, cheese pulls, satisfying pours, top-down plating, warm lighting, appetite-inducing close-ups",
        category: "Lifestyle"
      },
      {
        id: "fitness",
        name: "Fitness",
        icon: Trophy,
        description: "Athletic motivation",
        prompt: "Fitness video style with dynamic movement shots, gym lighting, sweat glistening, slow-motion form, motivational energy, before/after transformation feel",
        category: "Lifestyle"
      },
      {
        id: "fashion",
        name: "Fashion",
        icon: Shirt,
        description: "Style editorial",
        prompt: "Fashion video style with editorial lighting, model poses, outfit details, urban backdrops, confident struts, magazine-quality aesthetic",
        category: "Lifestyle"
      },
      {
        id: "gaming",
        name: "Gaming",
        icon: Gamepad,
        description: "Streamer energy",
        prompt: "Gaming video style with screen capture, facecam overlay, RGB lighting, reaction shots, quick cuts on highlights, esports energy, subscriber goal overlays",
        category: "Lifestyle"
      },
    ]
  },
  {
    name: "Event",
    icon: PartyPopper,
    presets: [
      {
        id: "wedding",
        name: "Wedding",
        icon: Heart,
        description: "Romantic celebration",
        prompt: "Wedding video style with dreamy slow motion, emotional first looks, golden hour couple shots, guest reactions, romantic string music feel, timeless elegance",
        category: "Event"
      },
      {
        id: "party",
        name: "Party",
        icon: PartyPopper,
        description: "Celebration energy",
        prompt: "Party video style with confetti moments, dancing crowds, strobe lighting, champagne pops, quick celebratory cuts, high-energy atmosphere",
        category: "Event"
      },
      {
        id: "sports",
        name: "Sports",
        icon: Trophy,
        description: "Athletic competition",
        prompt: "Sports video style with slow-motion replays, crowd reactions, determined athlete faces, victory moments, dramatic commentary feel, highlight reel pacing",
        category: "Event"
      },
    ]
  },
];

// Flat array for backward compatibility
export const VIDEO_STYLE_PRESETS: VideoStylePreset[] = VIDEO_STYLE_CATEGORIES.flatMap(cat => cat.presets);
