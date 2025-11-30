import { Ghost, Building2, Rocket, Crown, Sparkles, TreePine, Home, Mountain, Palmtree, Factory } from "lucide-react";

export interface PresetAnchor {
  id: string;
  name: string;
  icon: string; // lucide icon name
  category: "character" | "environment";
  template: string;
}

export const CHARACTER_PRESETS: PresetAnchor[] = [
  {
    id: "bigfoot",
    name: "Bigfoot",
    icon: "Ghost",
    category: "character",
    template: `**Character Anchor — Sasquatch**
**Look**: Towering 8-foot figure covered in matted auburn-brown fur with silver-gray streaks around the temples. Broad shoulders, barrel chest, slightly stooped posture. Deep-set amber eyes under a prominent brow ridge. Large flat nose, weathered leathery skin visible on palms and face. Feet are size 22, leaving distinctive three-toed impressions.
**Demeanor**: Surprisingly gentle and curious. Moves with deliberate caution, head tilted when observing something new. Communicates through low rumbling hums and expressive eyebrow movements. Startles easily but recovers with dignified composure.
**Role**: Reluctant cryptid celebrity trying to live peacefully while accidentally photobombing hikers.`,
  },
  {
    id: "british-aristocrat",
    name: "British Aristocrat",
    icon: "Crown",
    category: "character",
    template: `**Character Anchor — Lord Pemberton**
**Look**: Distinguished gentleman in his 60s with silver hair swept back, pencil-thin mustache waxed to points. Tailored three-piece tweed suit, pocket watch chain visible. Monocle on gold chain, signet ring on pinky finger. Ramrod-straight posture, chin perpetually elevated 15 degrees.
**Demeanor**: Unfailingly polite yet subtly condescending. Speaks in measured, clipped tones. One eyebrow raises involuntarily when encountering anything "common." Hands clasped behind back when thinking, index finger taps when impatient.
**Role**: Out-of-touch nobleman navigating modern situations with Victorian sensibilities.`,
  },
  {
    id: "supermodel",
    name: "Supermodel",
    icon: "Sparkles",
    category: "character",
    template: `**Character Anchor — Valentina**
**Look**: Statuesque 5'11" with sharp cheekbones and full lips. Sleek black hair in a severe center part falling to mid-back. Flawless bronzed skin, dramatic winged eyeliner. Oversized designer sunglasses perpetually perched on head. Draped in effortlessly chic minimalist fashion—silk blouse, high-waisted trousers, statement jewelry.
**Demeanor**: Projects bored detachment masking genuine warmth. Speaks in breathy half-whispers, punctuated by unexpected loud laughs. Poses reflexively when anyone points anything at her. Fidgets with phone constantly.
**Role**: Fashion industry insider who treats mundane errands like runway walks.`,
  },
  {
    id: "slenderman",
    name: "Cryptid Horror",
    icon: "Ghost",
    category: "character",
    template: `**Character Anchor — Whisper-Vale Entity**
**Look**: Impossibly tall silhouette (9+ feet) with limbs extending two meters beyond natural span. Featureless porcelain-white face—under flickering light, micro-pinhole star patterns appear briefly. Soot-black suit absorbs 98% of light, fibers form looping patterns. Joints bend both directions. Fingernails translucent, skin resembles polished birch bark with hairline seams.
**Demeanor**: Unnaturally still, head tilts 17° when curious, 23° when lying. Drums knuckles in prime-number rhythms. No blinking—room lights dim in cycles. Speech emerges as reversed audio layered with distant laughter.
**Role**: Eldritch archivist haunting liminal spaces, absorbing forgotten memories.`,
  },
  {
    id: "tech-bro",
    name: "Tech Founder",
    icon: "Rocket",
    category: "character",
    template: `**Character Anchor — Chad Disrupton**
**Look**: Late 20s, perpetual 3-day stubble meticulously maintained. Slim-fit Patagonia vest over gray hoodie, AirPods Pro always in. Tesla key fob visible. Standing desk posture even when sitting. Oura ring, Apple Watch, minimal wire-frame glasses.
**Demeanor**: Speaks entirely in startup jargon and hand gestures. Constantly checking phone mid-conversation. Nods vigorously while clearly not listening. Everything is "super interesting" and needs to "circle back."
**Role**: Startup founder pivoting through life, disrupting ordinary situations.`,
  },
];

export const ENVIRONMENT_PRESETS: PresetAnchor[] = [
  {
    id: "nyc",
    name: "New York City",
    icon: "Building2",
    category: "environment",
    template: `**Environment Anchor — Manhattan Street**
**Setting**: Busy Midtown sidewalk, yellow cabs streaming past. Steam rising from subway grates. Mix of glass skyscrapers and brownstones visible. Hot dog cart on corner, newsstand nearby. Pedestrians in business attire moving with purpose.
**Lighting**: Late afternoon golden hour, sun reflecting off glass facades creating lens flares. Long shadows stretching across pavement.
**Audio Atmosphere**: Constant traffic hum, distant sirens, construction sounds, snippets of conversations in multiple languages, subway rumble underfoot.
**Props**: Fire hydrant, parking meters, food cart, newspaper boxes, street signs (Walk/Don't Walk), coffee cups in hand.`,
  },
  {
    id: "spaceship",
    name: "Spaceship Interior",
    icon: "Rocket",
    category: "environment",
    template: `**Environment Anchor — Starship Bridge**
**Setting**: Sleek command deck with curved wraparound viewport showing star field. Holographic displays floating mid-air with cyan data streams. Captain's chair center frame, crew stations arranged in semicircle. Chrome and brushed metal surfaces, subtle blue ambient lighting strips.
**Lighting**: Cool blue-white from displays, warm orange emergency accent lights, starlight through viewport creating moving shadows.
**Audio Atmosphere**: Low engine hum, soft beeps from consoles, occasional radio chatter, life support ventilation whisper.
**Props**: Holographic star map, coffee mug with magnetic base, tablet devices, intercom panels, emergency kit mounted on wall.`,
  },
  {
    id: "forest",
    name: "Enchanted Forest",
    icon: "TreePine",
    category: "environment",
    template: `**Environment Anchor — Mystic Woodland**
**Setting**: Dense old-growth forest with massive moss-covered trees, twisted roots creating natural archways. Bioluminescent fungi dotting fallen logs. Mist hanging at knee level. Shafts of light piercing canopy, dust motes dancing. Ancient stone ruins barely visible through undergrowth.
**Lighting**: Dappled emerald-green filtered sunlight, ethereal glow from mushrooms, firefly-like particles floating randomly.
**Audio Atmosphere**: Bird calls echoing, leaves rustling, distant stream, creaking branches, occasional owl hoot, wind whispers.
**Props**: Gnarled walking staff, leather satchel, ancient tome, glass lantern, scattered autumn leaves, wildflowers.`,
  },
  {
    id: "suburban",
    name: "Suburban Home",
    icon: "Home",
    category: "environment",
    template: `**Environment Anchor — American Suburbia**
**Setting**: Split-level house, manicured lawn with sprinkler system. Attached two-car garage, basketball hoop on driveway. White picket fence, mailbox at curb. Neighboring houses visible, similar style. Mature oak tree with tire swing.
**Lighting**: Bright midday sun, harsh shadows, blue sky with fluffy clouds. Interior visible through windows shows warm tungsten lighting.
**Audio Atmosphere**: Lawnmower in distance, children playing, dog barking, ice cream truck jingle, sprinkler clicking, birds chirping.
**Props**: Garden hose, recycling bins, kid's bicycle, welcome mat, American flag on porch, grill on patio.`,
  },
  {
    id: "tropical",
    name: "Tropical Paradise",
    icon: "Palmtree",
    category: "environment",
    template: `**Environment Anchor — Island Beach**
**Setting**: White sand beach curving into turquoise lagoon. Palm trees swaying, coconuts visible. Thatched-roof cabana in background. Coral reef visible through crystal water. Volcanic mountain in far distance with wispy clouds.
**Lighting**: Bright tropical sun, water reflections dancing on surfaces, golden hour warmth, slight lens flare.
**Audio Atmosphere**: Gentle waves lapping, seagulls calling, palm fronds rustling, steel drum music from distance, occasional boat motor.
**Props**: Woven beach chair, colorful cocktail with umbrella, snorkel gear, sunscreen bottle, flip-flops, beach towel, seashells.`,
  },
];

export const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Ghost,
  Building2,
  Rocket,
  Crown,
  Sparkles,
  TreePine,
  Home,
  Mountain,
  Palmtree,
  Factory,
};
