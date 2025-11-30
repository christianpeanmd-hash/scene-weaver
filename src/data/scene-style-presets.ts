import { Video, Camera, Tv, Megaphone, MessageSquare, Film } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SceneStylePreset {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  template: string;
}

export const SCENE_STYLE_PRESETS: SceneStylePreset[] = [
  {
    id: "shaky-vlog",
    name: "Shaky Vlog",
    icon: Camera,
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
  {
    id: "commercial-parody",
    name: "Commercial Parody",
    icon: Tv,
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
    id: "cinematic-drama",
    name: "Cinematic Drama",
    icon: Video,
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
    id: "social-skit",
    name: "Social Skit",
    icon: Megaphone,
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
];
