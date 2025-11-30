import { Video, Camera, Tv, Megaphone, MessageSquare, Film, Laugh, Skull, Zap, Sparkles, Ghost, Palette, Clapperboard, Flame, Heart, Music } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SceneStylePreset {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  template: string;
  category?: "comedy" | "action" | "cinematic" | "social" | "animation";
}

export const SCENE_STYLE_PRESETS: SceneStylePreset[] = [
  // COMEDY STYLES
  {
    id: "humorous",
    name: "Humorous/Comedy",
    icon: Laugh,
    category: "comedy",
    description: "Light-hearted comedy with comedic timing and reactions",
    template: `Create a comedic video with excellent timing and physical humor.

COMEDY PRINCIPLES:
- Rule of threes: setup, reinforcement, subversion
- Pause before punchlines for anticipation
- Exaggerated reactions but grounded performance
- Visual gags that work without dialogue

TIMING RULES:
- Quick cuts on jokes, hold on reactions
- Let awkward moments breathe
- Smash cuts for unexpected reveals
- Slow-mo only for emphasis (sparingly)

PERFORMANCE:
- Deadpan delivery contrasts absurd situations
- Double-takes and delayed reactions
- Breaking the fourth wall (optional)
- Character commits fully to ridiculous premise

AUDIO:
- Comedic timing beats (rimshots, record scratches used sparingly)
- Silence before big reveals
- Sound design emphasizes physical comedy`,
  },
  {
    id: "meme-style",
    name: "Meme / Viral",
    icon: Skull,
    category: "comedy",
    description: "Internet meme culture aesthetic with chaotic energy",
    template: `Create a meme-style video with viral potential and internet culture references.

MEME AESTHETICS:
- Chaotic energy, unpredictable pacing
- Deep-fried/oversaturated color grading option
- Sudden zooms on faces during key moments
- Screen shake on impact/emphasis

KEY ELEMENTS:
- Subverted expectations
- Relatable "it me" moments
- Reaction-worthy climax
- Rewatchable twist or detail

EDITING STYLE:
- Jump cuts, no smooth transitions
- Text pops if absolutely necessary (minimal)
- Zoom-ins on facial expressions
- Freeze frames for emphasis

SOUND DESIGN:
- Bass-boosted impacts
- Vine boom energy
- Ironic music choices
- Sudden silence for comedy`,
  },
  {
    id: "shaky-vlog",
    name: "Shaky Vlog",
    icon: Camera,
    category: "social",
    description: "Raw phone footage with hand-shake and selfie framing",
    template: `Create an 8-second, single-take **horizontal 16:9** video that feels like raw phone footage.

STYLE RULES:
- Obvious hand-shake, light phone-footage grain, minor lens-flare streaks on turns
- ~70% of frame is character's head & upper torso, ~30% shows background
- Natural lighting with dust motes or ambient haze if appropriate
- Include one accidental finger edge or brief focus wobble

ACTION TIMELINE (ad-lib motion, no hard cuts):
- 0-2s: Character starts recording, addresses lens
- 2-4s: Quick tilt/pan to show background detail/problem
- 4-6s: Camera swings back; character reacts (gasp, shrug, etc.)
- 6-8s: Character gives punch-line, subtle nod; FREEZE on last frame

AUDIO: Ambient audio only (wind, birds, distant hum). Natural volume dialogue.`,
  },
  {
    id: "mock-doc",
    name: "Mock-Doc Meme",
    icon: Film,
    category: "comedy",
    description: "Short mockumentary style with interview framing",
    template: `Script a short mock-doc meme video lasting ≤ 7 seconds.

KEY RULES:
- Prioritize ACTION + AUDIO (dialogue/SFX) — absolutely no on-screen text, graphics, labels, or captions
- Dialogue should be fluid and spoken in natural complete sentences
- Horizontal 16:9 shots only
- Keep every dialogue line ≤ 12 words
- Use minimal props — 1-3 total

VISUAL BREAKDOWN (Time Budget: 0-2s / 2-4s / 4-6s / 6-7s):
- Opening beat with character intro/setup
- Reveal or twist moment
- Pay-off gag or demo
- Freeze or final gesture

DIRECTION NOTES:
- Performance: Deadpan delivery, subtle timing beats
- Camera: Handheld shoulder cam feel
- Color Grade: Slightly desaturated documentary look`,
  },
  // ACTION STYLES
  {
    id: "extreme-action",
    name: "Extreme Action",
    icon: Zap,
    category: "action",
    description: "High-octane action with dynamic camera and impacts",
    template: `Create an extreme action sequence with maximum intensity.

CAMERA WORK:
- Dutch angles during chaos
- Whip pans between action beats
- Low-angle hero shots
- POV shots for immersion
- Drone/aerial establishing shots

ACTION CHOREOGRAPHY:
- Clear cause and effect for each beat
- Impact frames with motion blur
- Speed ramping: slow-mo impacts, fast recovery
- Debris, particles, environmental destruction

EDITING:
- Quick cuts during action (0.5-1.5s per shot)
- Match cuts on movement
- J-cuts for sound leading visuals
- Flash frames on big impacts

SOUND DESIGN:
- Punchy impacts with bass
- Whoosh sounds on fast movement
- Environmental destruction foley
- Heartbeat/breathing for tension
- Epic trailer music energy`,
  },
  {
    id: "sports-highlight",
    name: "Sports Highlight",
    icon: Flame,
    category: "action",
    description: "ESPN-style highlight reel with replays and slow-mo",
    template: `Create a sports highlight style video with broadcast energy.

BROADCAST STYLE:
- Multiple camera angles on same moment
- Slow-motion replay of key action
- Wide establishing → tight action → reaction
- Clean, professional framing

TIMING:
- Build tension with anticipation shots
- Climax with the big moment
- Celebration/reaction aftermath
- Optional replay from different angle

GRAPHICS (minimal):
- No text overlays (AI renders text poorly)
- Focus on pure visual storytelling
- Let the action speak for itself

SOUND:
- Crowd atmosphere and reactions
- Natural sport sounds (impact, whistle, etc.)
- Dramatic score underneath
- Commentary energy in performance`,
  },
  // ANIMATION STYLES
  {
    id: "pixar-animation",
    name: "Pixar/3D Animation",
    icon: Sparkles,
    category: "animation",
    description: "Pixar-style 3D animation with expressive characters",
    template: `Create a Pixar/Disney-style 3D animated scene.

VISUAL STYLE:
- Rounded, appealing character designs
- Large expressive eyes with subtle reflections
- Subsurface scattering on skin
- Rich, saturated color palette
- Soft global illumination lighting

CHARACTER ANIMATION:
- Squash and stretch on movements
- Anticipation before major actions
- Exaggerated expressions (big brows, wide smiles)
- Secondary motion (hair, clothes, accessories)
- Clear silhouettes in poses

CAMERA:
- Smooth crane and dolly moves
- Shallow depth of field for emotion
- Wide establishing shots for environment
- Close-ups for emotional beats

ENVIRONMENT:
- Stylized but detailed backgrounds
- Atmospheric depth and haze
- Motivated practical lighting
- Magical/whimsical details`,
  },
  {
    id: "anime-style",
    name: "Anime",
    icon: Ghost,
    category: "animation",
    description: "Japanese anime aesthetic with dynamic poses",
    template: `Create an anime-style animated scene.

VISUAL STYLE:
- Clean line art with cel shading
- Large expressive eyes
- Dynamic hair movement
- Speed lines for motion
- Dramatic lighting with rim lights

ANIMATION TECHNIQUES:
- Limited but impactful animation
- Hold frames for dramatic effect
- Smear frames for fast action
- Background parallax scrolling
- Chibi reactions for comedy

CAMERA WORK:
- Dramatic zoom-ins on reactions
- Multi-angle action sequences
- Background blurs during speed
- Dutch angles for intensity

EFFECTS:
- Sparkle/shine effects
- Dramatic wind (hair, clothes)
- Sweat drops, emotion symbols
- Screen shake on impacts
- Light beams and lens flares`,
  },
  {
    id: "stop-motion",
    name: "Stop Motion",
    icon: Clapperboard,
    category: "animation",
    description: "Claymation/stop-motion tactile aesthetic",
    template: `Create a stop-motion animation style scene.

VISUAL CHARACTERISTICS:
- Slightly jerky, frame-by-frame movement
- Tactile, handmade textures
- Visible material qualities (clay, felt, paper)
- Miniature set design aesthetic
- Warm, practical lighting

ANIMATION STYLE:
- 12fps stop-motion feel
- Subtle fingerprint impressions
- Wobbly, charming imperfection
- Character squash on contacts
- Simple but expressive faces

ENVIRONMENT:
- Tabletop scale feeling
- Craft materials visible
- Shallow depth of field
- Practical miniature props

LIGHTING:
- Soft key lighting
- Visible shadows for depth
- Warm color temperature
- Occasional flicker for authenticity`,
  },
  // CINEMATIC STYLES
  {
    id: "cinematic-drama",
    name: "Cinematic Drama",
    icon: Video,
    category: "cinematic",
    description: "Film-quality dramatic scene with cinematic lighting",
    template: `Create a cinematic dramatic scene with film-quality production values.

VISUAL STYLE:
- Widescreen 2.35:1 or 16:9 aspect ratio
- Shallow depth of field with bokeh
- Motivated lighting (practical sources visible)
- Rich color grading with cinematic LUT feel

CAMERA WORK:
- Deliberate, smooth movements
- Establishing wide shots before close-ups
- Dramatic low or high angles for emphasis
- Slow push-ins for tension

PACING:
- Allow beats to breathe
- Use silence and pauses effectively
- Build tension through shot selection
- Meaningful character glances and reactions

AUDIO:
- Atmospheric sound design
- Subtle score underneath
- Foley details for immersion`,
  },
  {
    id: "horror-thriller",
    name: "Horror/Thriller",
    icon: Ghost,
    category: "cinematic",
    description: "Suspenseful horror with tension and dread",
    template: `Create a horror/thriller scene with mounting tension.

ATMOSPHERE:
- Low-key lighting with deep shadows
- Desaturated, cold color palette
- Negative space creating unease
- Environmental storytelling (something's wrong)

CAMERA TECHNIQUES:
- Slow, creeping dolly moves
- Long static shots (something might happen)
- Sudden reveals through movement
- Dutch angles for disorientation
- POV shots for vulnerability

TENSION BUILDING:
- False scares before real ones
- Sound design leading visual scares
- Character reactions before reveals
- Environmental sounds becoming threatening

SOUND DESIGN:
- Silence is terrifying
- Low frequency drones
- Sudden stingers for scares
- Distorted, unnatural sounds
- Breathing, heartbeat for POV`,
  },
  {
    id: "romantic",
    name: "Romantic/Dreamy",
    icon: Heart,
    category: "cinematic",
    description: "Soft, romantic aesthetic with warm tones",
    template: `Create a romantic, dreamy scene with emotional warmth.

VISUAL STYLE:
- Soft, diffused lighting
- Warm golden hour tones
- Shallow depth of field (bokeh)
- Slight overexposure for dreaminess
- Lens flares and light leaks

CAMERA WORK:
- Slow, floating movements
- Intimate close-ups
- Two-shots showing connection
- Gentle orbits around subjects
- Rack focus between characters

PERFORMANCE:
- Tender, subtle expressions
- Meaningful eye contact
- Gentle touches and gestures
- Natural, unforced intimacy

SOUND:
- Soft ambient sounds
- Gentle score (piano, strings)
- Muted environmental audio
- Focus on breath and whispers`,
  },
  // SOCIAL STYLES
  {
    id: "commercial-parody",
    name: "Commercial Parody",
    icon: Tv,
    category: "social",
    description: "Over-the-top infomercial or ad spoof",
    template: `Create a commercial parody in the style of an over-the-top infomercial.

STYLE RULES:
- Overly enthusiastic presenter energy
- Dramatic product reveals with camera push-ins
- Before/after style transitions
- Cheesy sound effects and triumphant music stings

VISUAL APPROACH:
- Clean, bright studio lighting
- Product hero shots at 45-degree angles
- Reaction shots showing amazement
- Optional split-screen comparisons

AUDIO ELEMENTS:
- Enthusiastic voice-over style dialogue
- "But wait, there's more!" energy
- Swoosh and ding sound effects

ACTION STRUCTURE:
- Problem setup (frustration moment)
- Product introduction (dramatic reveal)
- Demonstration (exaggerated effectiveness)
- Call to action (absurd offer)`,
  },
  {
    id: "talking-head",
    name: "Talking Head",
    icon: MessageSquare,
    category: "social",
    description: "Direct-to-camera commentary or reaction",
    template: `Create a talking head style video with direct address to camera.

FRAMING:
- Medium shot, character centered or rule-of-thirds positioned
- Clean background (office, bedroom, neutral backdrop)
- Eye-level camera angle
- Shallow depth of field on background

PERFORMANCE STYLE:
- Natural, conversational delivery
- Hand gestures for emphasis
- Expressive facial reactions
- Occasional lean-ins for emphasis

LIGHTING:
- Soft key light from front-side
- Subtle fill to reduce shadows
- Optional rim light for separation

AUDIO:
- Clear, present voice recording
- Minimal background ambient
- Optional subtle music bed`,
  },
  {
    id: "social-skit",
    name: "Social Skit",
    icon: Megaphone,
    category: "social",
    description: "Quick TikTok/Reels style comedy skit",
    template: `Create a punchy social media comedy skit optimized for TikTok/Reels.

KEY PRINCIPLES:
- Hook in first 0.5 seconds
- Quick cuts, no dead air
- Exaggerated reactions and expressions
- Clear visual storytelling (works on mute)

STRUCTURE:
- Immediate setup (no buildup)
- Escalation or subversion
- Punchline delivery
- Optional tag/button ending

PERFORMANCE:
- Big, expressive energy
- Clear physical comedy
- Snappy dialogue delivery
- Relatable character archetypes

TECHNICAL:
- Vertical 9:16 OR horizontal 16:9
- Bright, well-lit scenes
- Clean audio with punchy timing
- Consider trending audio hooks`,
  },
  {
    id: "music-video",
    name: "Music Video",
    icon: Music,
    category: "cinematic",
    description: "Stylized music video with performance and visuals",
    template: `Create a music video style scene with strong visual rhythm.

VISUAL STYLE:
- Stylized color grading (genre-specific)
- Dynamic lighting changes
- Multiple distinct looks/locations
- Strong visual motifs and symbols

EDITING TO MUSIC:
- Cuts on beats and phrases
- Movement matches tempo
- Build to choruses/drops
- Breathing room in verses

PERFORMANCE:
- Lip sync accuracy (if dialogue)
- Choreographed movement
- Confident, magnetic presence
- Direct camera engagement

CAMERA:
- Crane and jib moves
- Tracking shots with subject
- Beauty lighting for close-ups
- Wide shots for dance/performance`,
  },
];

// Helper to get presets by category
export const getPresetsByCategory = (category: SceneStylePreset["category"]) => 
  SCENE_STYLE_PRESETS.filter(p => p.category === category);

// Categories for organization
export const STYLE_CATEGORIES = [
  { id: "comedy", name: "Comedy & Humor", icon: Laugh },
  { id: "action", name: "Action & Sports", icon: Zap },
  { id: "animation", name: "Animation", icon: Sparkles },
  { id: "cinematic", name: "Cinematic", icon: Video },
  { id: "social", name: "Social Media", icon: Megaphone },
] as const;
