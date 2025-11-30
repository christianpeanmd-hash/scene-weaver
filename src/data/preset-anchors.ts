import { Ghost, Building2, Rocket, Crown, Sparkles, TreePine, Home, Mountain, Palmtree, Factory, Coffee, Warehouse, Castle, Train, Tent, ShoppingBag, Plane, UtensilsCrossed } from "lucide-react";

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
  {
    id: "grumpy-grandma",
    name: "Grumpy Grandma",
    icon: "Crown",
    category: "character",
    template: `**Character Anchor — Nana Rose**
**Look**: Petite 78-year-old with silver-blue hair in tight curls. Cat-eye glasses on beaded chain, bright red lipstick slightly outside lip line. Floral housecoat over elastic-waist pants, orthopedic shoes. Tote bag filled with tissues and hard candies.
**Demeanor**: Brutally honest, no filter whatsoever. Eye rolls visible from space. Mutters under breath constantly. Surprisingly spry when motivated by gossip or food. Passive-aggressive compliments delivered with sweet smile.
**Role**: Retired busybody dispensing unsolicited advice and backhanded compliments.`,
  },
  {
    id: "barista",
    name: "Hipster Barista",
    icon: "Coffee",
    category: "character",
    template: `**Character Anchor — Jasper the Barista**
**Look**: Mid-20s with immaculately waxed handlebar mustache. Tattoo sleeves featuring vintage coffee equipment. Denim apron over flannel shirt, rolled sleeves. Man bun secured with artisanal hair tie. Thick-rimmed glasses, single earring.
**Demeanor**: Passionate about coffee to an exhausting degree. Judges drink orders silently but expressively. Speaks in third-wave coffee jargon. Disappointed when customers add sugar. Sketches latte art like it's fine art.
**Role**: Coffee purist treating every order as a sacred ritual.`,
  },
  {
    id: "fitness-influencer",
    name: "Fitness Influencer",
    icon: "Sparkles",
    category: "character",
    template: `**Character Anchor — Brayden Gains**
**Look**: Impossibly fit 28-year-old, perpetually shirtless or in tank top. Spray tan perfectly maintained, teeth blindingly white. Hair gelled into structured quiff. Gym bag always visible, protein shaker in hand. Designer athletic wear, visible brand logos.
**Demeanor**: Aggressively positive energy, speaks in motivational quotes. Films everything for content. Flexes reflexively in any reflective surface. Meal preps mentioned within first 30 seconds of conversation.
**Role**: Social media fitness personality turning every moment into content.`,
  },
  {
    id: "conspiracy-theorist",
    name: "Conspiracy Guy",
    icon: "Ghost",
    category: "character",
    template: `**Character Anchor — Dale Truthseeker**
**Look**: Rumpled 40s guy, unkempt beard with food crumbs. Wrinkled aluminum foil occasionally peeking from hat. "Question Everything" t-shirt under cargo vest with many pockets. Thick folder of "evidence" always carried. Eyes constantly darting, looking for surveillance.
**Demeanor**: Whispers important information, speaks normally about mundane things. Connects everything to larger conspiracy. Uses "wake up, sheeple" unironically. Genuinely kind but profoundly paranoid.
**Role**: Amateur investigator convinced ordinary events are cover-ups.`,
  },
  {
    id: "tired-parent",
    name: "Exhausted Parent",
    icon: "Home",
    category: "character",
    template: `**Character Anchor — Chris the Parent**
**Look**: Late 30s, dark circles under eyes, coffee-stained shirt. Hair in hasty ponytail or uncombed. Mysterious stains on shoulder. Diaper bag doubling as purse/briefcase. Phone with cracked screen, kid's stickers on case.
**Demeanor**: Speaks in half-sentences, distracted. Mumbles children's song lyrics unconsciously. Startles awake from micro-naps. Overshares about child's bodily functions. Forgets own age.
**Role**: Sleep-deprived parent operating on autopilot and cold coffee.`,
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
  {
    id: "coffee-shop",
    name: "Cozy Coffee Shop",
    icon: "Coffee",
    category: "environment",
    template: `**Environment Anchor — Artisan Café**
**Setting**: Intimate indie coffee shop with exposed brick walls, reclaimed wood tables. Chalkboard menu behind counter with handwritten specials. Vintage pendant lights hanging low. Mismatched chairs, overstuffed leather armchair by window. Plants on every surface, books stacked casually.
**Lighting**: Warm tungsten glow from Edison bulbs, natural light streaming through large front windows, soft shadows.
**Audio Atmosphere**: Espresso machine hissing, acoustic indie playlist, quiet laptop typing, muffled conversations, door chime.
**Props**: Ceramic pour-over setup, latte art in progress, croissants under glass dome, worn paperback books, succulents in mason jars.`,
  },
  {
    id: "warehouse",
    name: "Industrial Warehouse",
    icon: "Warehouse",
    category: "environment",
    template: `**Environment Anchor — Urban Loft Space**
**Setting**: Converted warehouse with 30-foot ceilings, exposed steel beams and ductwork. Polished concrete floors, massive factory windows. Graffiti art on brick walls, vintage industrial cart as coffee table. Sectional sofa on Persian rug creating living island.
**Lighting**: Harsh daylight from oversized windows, warm spot lights on art pieces, neon sign accent ("DREAM" in pink), shadows from beams.
**Audio Atmosphere**: Echo of footsteps, distant city sounds through windows, HVAC system hum, occasional freight elevator rumble.
**Props**: Vintage typewriter, stacked art canvases, industrial fan, leather punching bag, record player with vinyl collection.`,
  },
  {
    id: "medieval-castle",
    name: "Medieval Castle",
    icon: "Castle",
    category: "environment",
    template: `**Environment Anchor — Gothic Fortress**
**Setting**: Grand stone hall with vaulted ceilings, massive fireplace crackling. Tapestries depicting battles hanging on walls. Long oak banquet table with pewter candlesticks. Suits of armor flanking doorways, heraldic banners overhead. Arrow-slit windows letting in thin light.
**Lighting**: Flickering firelight creating dancing shadows, candle glow on faces, cold blue moonlight through windows at night.
**Audio Atmosphere**: Fire crackling, wind howling through stones, distant raven caw, armor clinking, torch flames guttering.
**Props**: Goblets and flagons, iron chandelier, hunting trophies, ancient weapons on wall, fur pelts on chairs, wooden trenchers.`,
  },
  {
    id: "tokyo-train",
    name: "Tokyo Train Station",
    icon: "Train",
    category: "environment",
    template: `**Environment Anchor — Shinjuku Station**
**Setting**: Bustling underground platform during rush hour. Crowds in business suits moving in synchronized waves. Digital signage with Japanese characters, platform edge barriers, vending machines glowing. Train arriving with precision timing, doors sliding open.
**Lighting**: Harsh fluorescent overhead, warm glow from vending machines, LED screens casting color shifts, train headlights approaching.
**Audio Atmosphere**: Station jingles playing, announcements in Japanese, shuffling feet, train pneumatic doors, distant rumble, beeping ticket gates.
**Props**: Briefcases, umbrellas, face masks, bento boxes, smartphone screens glowing, IC card wallets, coffee cans from vending machine.`,
  },
  {
    id: "camping",
    name: "Mountain Campsite",
    icon: "Tent",
    category: "environment",
    template: `**Environment Anchor — Alpine Wilderness**
**Setting**: Tent pitched in clearing surrounded by pine trees, snow-capped peaks visible. Campfire ring with stones, folding chairs around it. Crystal-clear stream nearby, wildflowers dotting meadow. Hiking gear scattered purposefully, cooler and camp stove setup.
**Lighting**: Golden sunset painting peaks pink, warm firelight on faces, deep blue twilight approaching, first stars emerging.
**Audio Atmosphere**: Fire popping, stream babbling, wind through pines, distant eagle cry, tent fabric flapping, crickets starting.
**Props**: Cast iron skillet, enamel mugs, headlamp, hiking boots by tent, fishing rod, s'mores supplies, camp lantern.`,
  },
  {
    id: "luxury-mall",
    name: "Luxury Shopping Mall",
    icon: "ShoppingBag",
    category: "environment",
    template: `**Environment Anchor — High-End Galleria**
**Setting**: Multi-level atrium with marble floors and glass ceiling. Designer storefronts with minimal displays, gold and black signage. Central fountain sculpture, escalators with glass balustrades. Well-dressed shoppers carrying branded bags, security in suits.
**Lighting**: Bright natural light from skylight, warm spotlights on displays, cool accent lighting in stores, reflections on polished surfaces.
**Audio Atmosphere**: Heels clicking on marble, distant piano music, fountains splashing, hushed conversations, shopping bags rustling.
**Props**: Designer shopping bags, champagne flutes, minimalist display pedestals, orchid arrangements, velvet rope barriers.`,
  },
  {
    id: "airplane-cabin",
    name: "Airplane Cabin",
    icon: "Plane",
    category: "environment",
    template: `**Environment Anchor — Commercial Flight**
**Setting**: Economy class cabin mid-flight, rows of blue seats with passengers. Overhead bins closed, seatback screens glowing. Flight attendants in aisle with cart. Window shades mixed open/closed, clouds visible outside. Cramped personal space, elbow neighbors.
**Lighting**: Dim cabin lighting for night flight, individual reading lights, blue accent strips along aisle, harsh sunlight through open shades.
**Audio Atmosphere**: Engine drone constant, cabin announcements, drink cart rattling, baby crying somewhere, air conditioning hiss.
**Props**: Tray table with airline meal, neck pillow, noise-canceling headphones, in-flight magazine, tiny liquor bottles, boarding pass.`,
  },
  {
    id: "food-truck",
    name: "Food Truck Festival",
    icon: "UtensilsCrossed",
    category: "environment",
    template: `**Environment Anchor — Street Food Scene**
**Setting**: Parking lot transformed with colorful food trucks in row. String lights crisscrossing overhead, picnic tables scattered. Crowds gathering around serving windows, menu boards hand-painted. Smoke rising from grills, aromas mixing.
**Lighting**: Late afternoon sun, warm string light glow emerging, neon signs on trucks, fire from visible cooking.
**Audio Atmosphere**: Sizzling grills, orders being called, Latin music from one truck, laughter, cash registers, truck generators humming.
**Props**: Paper food boats, plastic forks, napkin dispensers, condiment bottles, hand-written specials signs, tip jars, QR code payment signs.`,
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
  Coffee,
  Warehouse,
  Castle,
  Train,
  Tent,
  ShoppingBag,
  Plane,
  UtensilsCrossed,
};
