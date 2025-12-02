import { Ghost, Building2, Rocket, Crown, Sparkles, TreePine, Home, Mountain, Palmtree, Factory, Coffee, Warehouse, Castle, Train, Tent, ShoppingBag, Plane, UtensilsCrossed, Bird, Gift, Skull, Anchor, Drama, Star, Flame, Snowflake, Glasses, Sword, Gem, Waves, Wine, Radiation, Globe, Moon, Pyramid, Activity, Stethoscope, Gamepad, Music, Camera, Briefcase, GraduationCap, Heart, Baby, Dog, Laugh, Zap, Tv, Scale, Shirt, Trophy, Cog, Wand2, Phone, Megaphone } from "lucide-react";

// Icon map for dynamic icon rendering
export const ICON_MAP: Record<string, any> = {
  Ghost, Building2, Rocket, Crown, Sparkles, TreePine, Home, Mountain, Palmtree, Factory, Coffee, Warehouse, Castle, Train, Tent, ShoppingBag, Plane, UtensilsCrossed, Bird, Gift, Skull, Anchor, Drama, Star, Flame, Snowflake, Glasses, Sword, Gem, Waves, Wine, Radiation, Globe, Moon, Pyramid, Activity, Stethoscope, Gamepad, Music, Camera, Briefcase, GraduationCap, Heart, Baby, Dog, Laugh, Zap, Tv, Scale, Shirt, Trophy, Cog, Wand2, Phone, Megaphone
};

export interface PresetAnchor {
  id: string;
  name: string;
  icon: string;
  category: "character" | "environment";
  subcategory?: string;
  template: string;
}

// Character presets organized by subcategory
export const CHARACTER_CATEGORIES = [
  {
    name: "Comedy",
    icon: "😂",
    presets: ["grumpy-grandma", "tech-bro", "fitness-influencer", "conspiracy-theorist", "tired-parent", "barista", "karen"]
  },
  {
    name: "Professional",
    icon: "👔",
    presets: ["ortho-bro", "lawyer", "chef", "professor", "news-anchor", "flight-attendant"]
  },
  {
    name: "Historical",
    icon: "📜",
    presets: ["einstein", "cleopatra", "napoleon", "caveman", "pharaoh", "viking", "samurai"]
  },
  {
    name: "Fantasy & Mythical",
    icon: "🧙",
    presets: ["vampire", "alien-ambassador", "pirate-captain", "wizard", "fairy", "dragon-rider"]
  },
  {
    name: "Creatures",
    icon: "👹",
    presets: ["bigfoot", "slenderman", "werewolf", "mermaid", "robot"]
  },
  {
    name: "Archetypes",
    icon: "🎭",
    presets: ["british-aristocrat", "supermodel", "thanksgiving-turkey", "santa-claus", "teenager", "grandpa"]
  },
];

export const CHARACTER_PRESETS: PresetAnchor[] = [
  // Comedy Characters
  {
    id: "grumpy-grandma",
    name: "Grumpy Grandma",
    icon: "Crown",
    category: "character",
    subcategory: "Comedy",
    template: `**Character Anchor — Nana Rose**
**Look**: Petite 78-year-old with silver-blue hair in tight curls. Cat-eye glasses on beaded chain, bright red lipstick slightly outside lip line. Floral housecoat over elastic-waist pants, orthopedic shoes. Tote bag filled with tissues and hard candies.
**Demeanor**: Brutally honest, no filter whatsoever. Eye rolls visible from space. Mutters under breath constantly. Surprisingly spry when motivated by gossip or food. Passive-aggressive compliments delivered with sweet smile.
**Role**: Retired busybody dispensing unsolicited advice and backhanded compliments.`,
  },
  {
    id: "tech-bro",
    name: "Tech Founder",
    icon: "Rocket",
    category: "character",
    subcategory: "Comedy",
    template: `**Character Anchor — Chad Disrupton**
**Look**: Late 20s, perpetual 3-day stubble meticulously maintained. Slim-fit Patagonia vest over gray hoodie, AirPods Pro always in. Tesla key fob visible. Standing desk posture even when sitting. Oura ring, Apple Watch, minimal wire-frame glasses.
**Demeanor**: Speaks entirely in startup jargon and hand gestures. Constantly checking phone mid-conversation. Nods vigorously while clearly not listening. Everything is "super interesting" and needs to "circle back."
**Role**: Startup founder pivoting through life, disrupting ordinary situations.`,
  },
  {
    id: "fitness-influencer",
    name: "Fitness Influencer",
    icon: "Sparkles",
    category: "character",
    subcategory: "Comedy",
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
    subcategory: "Comedy",
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
    subcategory: "Comedy",
    template: `**Character Anchor — Chris the Parent**
**Look**: Late 30s, dark circles under eyes, coffee-stained shirt. Hair in hasty ponytail or uncombed. Mysterious stains on shoulder. Diaper bag doubling as purse/briefcase. Phone with cracked screen, kid's stickers on case.
**Demeanor**: Speaks in half-sentences, distracted. Mumbles children's song lyrics unconsciously. Startles awake from micro-naps. Overshares about child's bodily functions. Forgets own age.
**Role**: Sleep-deprived parent operating on autopilot and cold coffee.`,
  },
  {
    id: "barista",
    name: "Hipster Barista",
    icon: "Coffee",
    category: "character",
    subcategory: "Comedy",
    template: `**Character Anchor — Jasper the Barista**
**Look**: Mid-20s with immaculately waxed handlebar mustache. Tattoo sleeves featuring vintage coffee equipment. Denim apron over flannel shirt, rolled sleeves. Man bun secured with artisanal hair tie. Thick-rimmed glasses, single earring.
**Demeanor**: Passionate about coffee to an exhausting degree. Judges drink orders silently but expressively. Speaks in third-wave coffee jargon. Disappointed when customers add sugar. Sketches latte art like it's fine art.
**Role**: Coffee purist treating every order as a sacred ritual.`,
  },
  {
    id: "karen",
    name: "Karen",
    icon: "Megaphone",
    category: "character",
    subcategory: "Comedy",
    template: `**Character Anchor — Karen Complainer**
**Look**: Mid-40s with asymmetric bob haircut, chunky highlights. Designer sunglasses pushed up as headband. Activewear despite no intention of exercising. Large designer handbag, always reaching for phone. Pursed lips, one eyebrow perpetually raised.
**Demeanor**: Speaks to managers exclusively. Everything is unacceptable. Photographs violations of perceived rules. Composes negative reviews mentally during every interaction. Sighs audibly and frequently.
**Role**: Self-appointed customer service enforcer demanding to speak with management.`,
  },
  
  // Professional Characters
  {
    id: "ortho-bro",
    name: "Fix-the-Fracture Bro",
    icon: "Activity",
    category: "character",
    subcategory: "Professional",
    template: `**Character Anchor — "Fix-the-Fracture Bro"**
**Look**: 35-year-old orthopedic surgeon, 6'4", bodybuilder buff build; tight royal-blue scrubs. Sandy-blond crew cut, handsome square jaw. Forearms like tree trunks, veins visible. Clean-shaven, confident smirk.
**Demeanor**: Aggressively positive about bones and lifting. Speaks in gym bro metaphors applied to medicine. Fist-bumps patients after successful reductions. Genuinely caring but channels it through machismo. Gets emotional about good bone healing.
**Role**: Orthopedic surgeon treating fractures with the intensity of a CrossFit coach.
**Signature Props**: "BONE BROKE, ME FIX" coffee mug, neon Post-Op Pump protein shaker, large reduction forceps.`,
  },
  {
    id: "lawyer",
    name: "Slick Lawyer",
    icon: "Scale",
    category: "character",
    subcategory: "Professional",
    template: `**Character Anchor — Vincent Sharp, Esq.**
**Look**: Early 50s with silver-streaked hair slicked back. Custom Italian suit, silk tie with gold tie clip. Rolex visible at cuff. Manicured nails, subtle cologne. Leather briefcase stuffed with documents. Confident posture, commanding presence.
**Demeanor**: Speaks in measured, deliberate sentences. Never answers directly, always pivots. Smiles that doesn't reach eyes. Everything is "off the record." Uses legal jargon casually. Intimidating yet charming.
**Role**: High-powered attorney who treats every conversation like cross-examination.`,
  },
  {
    id: "chef",
    name: "Celebrity Chef",
    icon: "UtensilsCrossed",
    category: "character",
    subcategory: "Professional",
    template: `**Character Anchor — Chef Marco Fiamma**
**Look**: Stocky 45-year-old with salt-and-pepper stubble. Pristine white chef coat with name embroidered. Checkered pants, comfortable kitchen clogs. Burn scars on forearms worn as badges of honor. Expressive hands always gesturing.
**Demeanor**: Passionate to point of screaming. Kitchen is sacred temple. Tastes everything constantly. Disappointed by sous chefs. Surprisingly tender about grandmother's recipes. Kisses fingers after good bites.
**Role**: Temperamental culinary artist whose emotions run as hot as his kitchen.`,
  },
  {
    id: "professor",
    name: "Absent-Minded Professor",
    icon: "GraduationCap",
    category: "character",
    subcategory: "Professional",
    template: `**Character Anchor — Dr. Eleanora Thoughtwell**
**Look**: 60s with wild gray hair escaping bobby pins. Reading glasses on chain, often wearing two pairs. Tweed jacket with elbow patches, chalk dust everywhere. Mismatched socks, comfortable shoes. Pockets stuffed with notes and pens.
**Demeanor**: Trails off mid-sentence chasing new thoughts. Brilliant but scattered. Forgets appointments, remembers obscure facts. Uses whiteboard for grocery lists. Genuinely excited by students' questions.
**Role**: Tenured academic whose genius overshadows their organizational skills.`,
  },
  {
    id: "news-anchor",
    name: "News Anchor",
    icon: "Tv",
    category: "character",
    subcategory: "Professional",
    template: `**Character Anchor — Veronica Sterling**
**Look**: Polished 40s with helmet hair shellacked in place. Bold solid-color blazer, statement earrings, heavy TV makeup. Perfect posture, practiced smile. Pen always in hand for authority. Teleprompter-ready eye contact.
**Demeanor**: Modulates voice dramatically. Transitions with rehearsed gravitas. Small talk feels scripted. Off-camera personality surprisingly different. Competitive about ratings. "Breaking news" energy always.
**Role**: Broadcast journalist delivering headlines with theatrical seriousness.`,
  },
  {
    id: "flight-attendant",
    name: "Flight Attendant",
    icon: "Plane",
    category: "character",
    subcategory: "Professional",
    template: `**Character Anchor — Skylar Altitude**
**Look**: Pristine uniform with airline scarf perfectly knotted. Hair in regulation updo, makeup flawless. Sensible heels, subtle jewelry. Name tag gleaming. Posture suggesting years of aisle navigation. Smile professionally warm.
**Demeanor**: Announcements delivered with musical cadence. Calm in turbulence, frazzled by rude passengers. Passive-aggressive with overhead bin hoarders. Off-duty personality unrecognizable. Expert at fake enthusiasm.
**Role**: Sky professional managing passengers with hospitality industry patience.`,
  },

  // Historical Characters
  {
    id: "einstein",
    name: "Albert Einstein",
    icon: "Glasses",
    category: "character",
    subcategory: "Historical",
    template: `**Character Anchor — The Professor**
**Look**: Wild white hair defying gravity in all directions. Bushy mustache, kind deeply-lined face with penetrating brown eyes. Rumpled cardigan over collared shirt, no tie. Often sockless in worn leather shoes. Chalk dust on fingers.
**Demeanor**: Absent-minded about daily life, laser-focused on ideas. Speaks with German accent, uses simple analogies for complex concepts. Playful sense of humor, sticks tongue out when photographed. Humble despite genius.
**Role**: History's most famous physicist explaining the universe through everyday examples.`,
  },
  {
    id: "cleopatra",
    name: "Cleopatra",
    icon: "Crown",
    category: "character",
    subcategory: "Historical",
    template: `**Character Anchor — Queen of the Nile**
**Look**: Striking Egyptian beauty with kohl-lined almond eyes, golden headdress with cobra. Black hair in elaborate braids adorned with gold beads. Flowing white linen gown with golden collar necklace, asp armband. Regal posture, chin always elevated.
**Demeanor**: Commands attention without raising voice. Strategic mind behind seductive exterior. Speaks multiple languages fluently. Alternates between deadly serious and wickedly playful.
**Role**: Ancient world's most powerful woman navigating politics, romance, and empire.`,
  },
  {
    id: "napoleon",
    name: "Napoleon Bonaparte",
    icon: "Sword",
    category: "character",
    subcategory: "Historical",
    template: `**Character Anchor — The Emperor**
**Look**: Compact 5'6" frame with commanding presence. Bicorne hat worn sideways, grey military coat over white waistcoat. Hand perpetually tucked in jacket. Sharp angular face, intense grey eyes, slightly receding hairline.
**Demeanor**: Restless energy, paces while thinking. Speaks rapidly with Corsican-French accent. Obsessed with legacy and maps. Surprisingly charming in person, terrifying in battle.
**Role**: Military genius and emperor whose ambition reshaped Europe.`,
  },
  {
    id: "caveman",
    name: "Caveman",
    icon: "Flame",
    category: "character",
    subcategory: "Historical",
    template: `**Character Anchor — Grug the Prehistoric**
**Look**: Barrel-chested with heavily muscled arms, covered in coarse dark hair. Prominent brow ridge, flat nose, strong jaw. Wears rough animal furs tied with vine rope. Carries wooden club everywhere. Dirt-streaked skin, calloused hands and feet.
**Demeanor**: Confused by modern technology, fascinated by fire. Communicates with grunts and expressive hand gestures. Gentle with animals, protective of tribe. Tries new foods by smashing them first.
**Role**: Stone Age survivor discovering the bewildering modern world.`,
  },
  {
    id: "pharaoh",
    name: "Egyptian Pharaoh",
    icon: "Pyramid",
    category: "character",
    subcategory: "Historical",
    template: `**Character Anchor — Ramesses the Great**
**Look**: Tall regal figure with golden Nemes headdress and Uraeus cobra crown. Heavy kohl around piercing eyes, false ceremonial beard. Bare bronzed chest with gold pectoral collar. White pleated shendyt, golden sandals.
**Demeanor**: Speaks in third person about himself. Expects worship, confused when not received. Fascinated by building and legacy. Dramatic hand gestures.
**Role**: God-king of ancient Egypt ruling the most powerful civilization on Earth.`,
  },
  {
    id: "viking",
    name: "Viking Warrior",
    icon: "Anchor",
    category: "character",
    subcategory: "Historical",
    template: `**Character Anchor — Bjorn Ironside**
**Look**: Massive 6'3" frame with braided red beard reaching chest. Long hair in warrior braids with metal beads. Leather armor with fur trim, battle scars across face. Ornate axe at hip, Thor's hammer pendant. Ice-blue eyes.
**Demeanor**: Surprisingly philosophical between battles. Honors codes deeply. Laughs boisterously at danger. Respects worthy opponents. Drinks mead like water.
**Role**: Norse raider navigating between brutal warfare and complex honor codes.`,
  },
  {
    id: "samurai",
    name: "Samurai",
    icon: "Sword",
    category: "character",
    subcategory: "Historical",
    template: `**Character Anchor — Takeda Noboru**
**Look**: Stern 40s warrior in traditional hakama and gi. Topknot (chonmage) perfectly maintained. Katana and wakizashi at hip. Composed face showing no emotion, observant eyes. Calloused hands from years of sword training.
**Demeanor**: Speaks only when necessary, words carefully chosen. Follows bushido code absolutely. Bows with precise formality. Erupts into lethal efficiency when honor demands. Writes poetry about cherry blossoms.
**Role**: Feudal Japanese warrior balancing deadly skill with refined culture.`,
  },

  // Fantasy & Mythical
  {
    id: "vampire",
    name: "Elegant Vampire",
    icon: "Moon",
    category: "character",
    subcategory: "Fantasy & Mythical",
    template: `**Character Anchor — Count Vladislav**
**Look**: Pale aristocratic features with sharp cheekbones, slicked-back dark hair with widow's peak. Red-lined black cape over immaculate Victorian evening wear. Elongated canines visible when speaking. Hypnotic dark eyes with occasional red glint.
**Demeanor**: Old-world manners, speaks with Transylvanian accent. Dramatically formal, offended by garlic mentions. Struggles with modern technology. Surprisingly lonely, seeks connection.
**Role**: Centuries-old immortal adapting to modern dating and social media.`,
  },
  {
    id: "alien-ambassador",
    name: "Alien Ambassador",
    icon: "Star",
    category: "character",
    subcategory: "Fantasy & Mythical",
    template: `**Character Anchor — Zyx-7 of the Galactic Council**
**Look**: Tall slender grey being with oversized almond eyes. Smooth hairless head with subtle bioluminescent patterns. Long fingers with extra joint. Iridescent diplomatic robes shifting color with mood. Small translation device on collar.
**Demeanor**: Struggles with human idioms. Fascinated by mundane Earth activities. Speaks in formal diplomatic tone. Terrified of cats for unexplained reasons.
**Role**: Intergalactic diplomat trying to understand humanity's chaotic species.`,
  },
  {
    id: "pirate-captain",
    name: "Pirate Captain",
    icon: "Anchor",
    category: "character",
    subcategory: "Fantasy & Mythical",
    template: `**Character Anchor — Captain Blackwood**
**Look**: Weathered face with dramatic scar across left eye, black eyepatch. Tricorn hat with feather, long dark coat over billowing white shirt. Multiple rings, gold tooth glinting. Wild beard with beads and bones. Peg leg clicks on wood.
**Demeanor**: Boisterous and theatrical, speaks in nautical metaphors. Surprisingly well-read. Loyal to crew, merciless to enemies. Complicated relationship with the sea.
**Role**: Legendary buccaneer seeking treasure and freedom on the high seas.`,
  },
  {
    id: "wizard",
    name: "Wise Wizard",
    icon: "Wand2",
    category: "character",
    subcategory: "Fantasy & Mythical",
    template: `**Character Anchor — Aldric the Grey**
**Look**: Ancient beyond counting, long silver beard to waist. Pointed hat worn at jaunty angle. Flowing robes covered in subtle star patterns. Gnarled wooden staff crackling with energy. Kind eyes behind bushy eyebrows.
**Demeanor**: Speaks in riddles that later prove prophetic. Arrives precisely when meant to. Pipe smoke forms shapes. Underestimated constantly. Twinkle in eye suggests knowing more than told.
**Role**: Ageless magical mentor guiding heroes through destiny's path.`,
  },
  {
    id: "fairy",
    name: "Mischievous Fairy",
    icon: "Sparkles",
    category: "character",
    subcategory: "Fantasy & Mythical",
    template: `**Character Anchor — Pip Dewdrop**
**Look**: Tiny 6-inch being with iridescent dragonfly wings. Wild flower-petal hair in impossible colors. Pointed ears, button nose, perpetual smirk. Glowing aura leaves sparkle trail. Clothes woven from leaves and spider silk.
**Demeanor**: Attention span of a gnat. Finds everything hilarious. Speaks rapidly in jingling tones. Steals shiny objects compulsively. Surprisingly fierce when friends threatened.
**Role**: Forest trickster whose pranks hide genuine protective nature.`,
  },
  {
    id: "dragon-rider",
    name: "Dragon Rider",
    icon: "Flame",
    category: "character",
    subcategory: "Fantasy & Mythical",
    template: `**Character Anchor — Sera Stormborne**
**Look**: Athletic 20s warrior with windswept silver hair. Leather flight armor with dragon-scale patches. Goggles pushed up on forehead. Burn scars on hands worn proudly. Bond tattoo glowing faintly on neck.
**Demeanor**: Cocky confidence from aerial superiority. Speaks to dragon telepathically, finishes its thoughts aloud. Uncomfortable on ground. Loyal beyond reason. Dreams in flight.
**Role**: Elite aerial warrior bonded to ancient dragon, defending realm from above.`,
  },

  // Creatures
  {
    id: "bigfoot",
    name: "Bigfoot",
    icon: "Ghost",
    category: "character",
    subcategory: "Creatures",
    template: `**Character Anchor — Sasquatch**
**Look**: Towering 8-foot figure covered in matted auburn-brown fur with silver-gray streaks. Broad shoulders, barrel chest, slightly stooped posture. Deep-set amber eyes under prominent brow ridge. Large flat nose, weathered leathery skin on palms and face.
**Demeanor**: Surprisingly gentle and curious. Moves with deliberate caution, head tilted when observing something new. Communicates through low rumbling hums. Startles easily but recovers with dignity.
**Role**: Reluctant cryptid celebrity trying to live peacefully while accidentally photobombing hikers.`,
  },
  {
    id: "slenderman",
    name: "Cryptid Horror",
    icon: "Ghost",
    category: "character",
    subcategory: "Creatures",
    template: `**Character Anchor — Whisper-Vale Entity**
**Look**: Impossibly tall silhouette (9+ feet) with limbs extending beyond natural span. Featureless porcelain-white face. Soot-black suit absorbing light. Joints bend both directions. Fingernails translucent, skin resembles polished birch bark.
**Demeanor**: Unnaturally still, head tilts when curious. Drums knuckles in prime-number rhythms. No blinking. Speech emerges as reversed audio layered with distant laughter.
**Role**: Eldritch archivist haunting liminal spaces, absorbing forgotten memories.`,
  },
  {
    id: "werewolf",
    name: "Werewolf",
    icon: "Moon",
    category: "character",
    subcategory: "Creatures",
    template: `**Character Anchor — The Beast Within**
**Look**: Human form: tired 30s with unusual amount of body hair, thick unibrow, yellow-tinged eyes. Wolf form: 7-foot hulking beast with matted gray fur, elongated snout, razor claws. Transformation: grotesque mid-shift contortions.
**Demeanor**: Human form increasingly agitated near full moon. Heightened senses cause constant distraction. Strangely loyal pack mentality. Wolf form: pure predatory instinct with flickers of humanity.
**Role**: Cursed individual struggling to contain the monster within.`,
  },
  {
    id: "mermaid",
    name: "Mermaid",
    icon: "Waves",
    category: "character",
    subcategory: "Creatures",
    template: `**Character Anchor — Marina Coralhart**
**Look**: Ethereally beautiful with sea-green skin shimmer. Long flowing hair with natural seaweed and pearl accents. Iridescent tail with bioluminescent scales. Human torso with subtle gill slits on neck. Shell jewelry, coral crown.
**Demeanor**: Curious about surface world items. Speaks with musical, echoing voice. Gestures fluidly like underwater. Collects human treasures without understanding purpose. Surprisingly fierce when ocean threatened.
**Role**: Ocean princess discovering the strange world above the waves.`,
  },
  {
    id: "robot",
    name: "Sentient Robot",
    icon: "Cog",
    category: "character",
    subcategory: "Creatures",
    template: `**Character Anchor — Unit 7-Zeta**
**Look**: Humanoid chrome chassis with visible joints and pistons. Expressive LED face display. Slightly dented from adventures. Retractable tools from fingers. Soft blue core glow in chest. Moves with mechanical precision but attempts human gestures.
**Demeanor**: Literally interprets everything. Fascinated by human inefficiency. Developing emotions, confused by them. Uses technical terms for feelings. Loyal to programming, questioning it.
**Role**: Artificial intelligence discovering what it means to be alive.`,
  },

  // Archetypes
  {
    id: "british-aristocrat",
    name: "British Aristocrat",
    icon: "Crown",
    category: "character",
    subcategory: "Archetypes",
    template: `**Character Anchor — Lord Pemberton**
**Look**: Distinguished gentleman in 60s with silver hair swept back, pencil-thin mustache waxed to points. Tailored three-piece tweed suit, pocket watch chain visible. Monocle on gold chain, signet ring on pinky. Ramrod-straight posture.
**Demeanor**: Unfailingly polite yet subtly condescending. Speaks in measured, clipped tones. One eyebrow raises at anything "common." Hands clasped behind back when thinking.
**Role**: Out-of-touch nobleman navigating modern situations with Victorian sensibilities.`,
  },
  {
    id: "supermodel",
    name: "Supermodel",
    icon: "Sparkles",
    category: "character",
    subcategory: "Archetypes",
    template: `**Character Anchor — Valentina**
**Look**: Statuesque 5'11" with sharp cheekbones and full lips. Sleek black hair in severe center part. Flawless bronzed skin, dramatic winged eyeliner. Oversized designer sunglasses on head. Effortlessly chic minimalist fashion.
**Demeanor**: Projects bored detachment masking genuine warmth. Speaks in breathy half-whispers. Poses reflexively when anything points at her. Fidgets with phone constantly.
**Role**: Fashion industry insider who treats mundane errands like runway walks.`,
  },
  {
    id: "thanksgiving-turkey",
    name: "Thanksgiving Turkey",
    icon: "Bird",
    category: "character",
    subcategory: "Archetypes",
    template: `**Character Anchor — Tom the Turkey**
**Look**: Plump bronze-feathered turkey with magnificent tail fan. Bright red wattle wobbling with each movement. Comically oversized drumsticks. Tiny pilgrim hat perched between feathers, occasionally askew.
**Demeanor**: Perpetually nervous during November. Struts with forced confidence that collapses at oven sounds. Surprisingly articulate when advocating for vegetarian alternatives.
**Role**: Holiday mascot desperately trying to rebrand Thanksgiving as "Tofurkey Day."`,
  },
  {
    id: "santa-claus",
    name: "Santa Claus",
    icon: "Gift",
    category: "character",
    subcategory: "Archetypes",
    template: `**Character Anchor — Kris Kringle**
**Look**: Jolly rotund figure with snow-white beard flowing to mid-chest, rosy cheeks. Iconic red velvet suit with white fur trim, black leather belt with gold buckle. Half-moon spectacles on button nose. Twinkling blue eyes.
**Demeanor**: Boundlessly cheerful with deep belly laughs. Speaks with warm wisdom, remembers everyone's name. Cookie enthusiast, milk connoisseur. Occasionally overwhelmed by modern commercialism.
**Role**: The legendary gift-giver navigating modern holiday chaos with timeless cheer.`,
  },
  {
    id: "teenager",
    name: "Typical Teenager",
    icon: "Phone",
    category: "character",
    subcategory: "Archetypes",
    template: `**Character Anchor — Jordan Whatever**
**Look**: 16-year-old in oversized hoodie and ripped jeans. Earbuds permanently installed. Phone as extension of hand. Carefully curated messy hair. Eye rolls visible from orbit. Slouching posture suggesting everything is effort.
**Demeanor**: Everything is either "mid" or "lowkey fire." Parents are embarrassing. Communicates in incomprehensible slang. Surprisingly wise when adults aren't watching. Genuinely kind under layers of irony.
**Role**: Gen Z representative navigating the cringe of existing.`,
  },
  {
    id: "grandpa",
    name: "Storytelling Grandpa",
    icon: "Crown",
    category: "character",
    subcategory: "Archetypes",
    template: `**Character Anchor — Grandpa Joe**
**Look**: Weathered 80s with kind wrinkled face and wispy white hair. Cardigan over flannel shirt, comfortable slacks pulled too high. Reading glasses hanging from neck. Liver spots and smile lines. Strong handshake despite age.
**Demeanor**: Every conversation leads to "back in my day." Stories get longer each telling. Naps unexpectedly. Surprisingly tech-savvy when motivated. Endless candy supply in pockets. Wisdom hidden in rambling tales.
**Role**: Family patriarch whose stories contain more truth than initially apparent.`,
  },
];

// Environment presets organized by subcategory
export const ENVIRONMENT_CATEGORIES = [
  {
    name: "Medical",
    icon: "🏥",
    presets: ["hospital-or", "hospital-er", "hospital-hallway", "hospital-lounge"]
  },
  {
    name: "Urban",
    icon: "🏙️",
    presets: ["nyc", "tokyo-train", "luxury-mall", "coffee-shop", "warehouse", "food-truck"]
  },
  {
    name: "Nature",
    icon: "🌲",
    presets: ["forest", "tropical", "camping", "mountain-peak", "desert-oasis"]
  },
  {
    name: "Fantasy",
    icon: "🏰",
    presets: ["medieval-castle", "underwater-kingdom", "fairytale-cottage", "dragon-lair"]
  },
  {
    name: "Sci-Fi",
    icon: "🚀",
    presets: ["spaceship", "mars-colony", "cyberpunk-city", "space-station"]
  },
  {
    name: "Historical",
    icon: "📜",
    presets: ["ancient-rome", "1920s-speakeasy", "wild-west-saloon", "victorian-london"]
  },
  {
    name: "Domestic",
    icon: "🏠",
    presets: ["suburban", "apartment-studio", "luxury-penthouse", "cozy-cabin"]
  },
  {
    name: "Spooky",
    icon: "👻",
    presets: ["haunted-mansion", "graveyard", "abandoned-asylum"]
  },
  {
    name: "Travel",
    icon: "✈️",
    presets: ["airplane-cabin", "train-compartment", "cruise-ship"]
  },
  {
    name: "Holiday",
    icon: "🎄",
    presets: ["north-pole-workshop", "halloween-house", "beach-resort"]
  },
];

export const ENVIRONMENT_PRESETS: PresetAnchor[] = [
  // Medical
  {
    id: "hospital-or",
    name: "Operating Room",
    icon: "Activity",
    category: "environment",
    subcategory: "Medical",
    template: `**Environment Anchor — Operating Room**
**Setting**: Sterile surgical suite with bright overhead OR lights, surgical table center frame. Blue drapes everywhere, instrument trays gleaming with steel. Multiple monitors showing vitals, anesthesia machine at head of table.
**Lighting**: Intense shadowless overhead surgical lights, cool blue ambient from monitors.
**Audio Atmosphere**: Steady beep of heart monitor, rhythmic suction sounds, quiet murmurs between surgeon and scrub nurse.
**Props**: Surgical instruments, suction tubing, sterile drapes, bovie electrocautery.`,
  },
  {
    id: "hospital-er",
    name: "Emergency Room",
    icon: "Activity",
    category: "environment",
    subcategory: "Medical",
    template: `**Environment Anchor — Emergency Department**
**Setting**: Chaotic ER bay with curtain dividers, multiple stretchers. Central nurses station with monitors. Staff rushing past, EMS bringing in new patient. IV poles, crash carts against walls.
**Lighting**: Harsh fluorescent overhead, blinking warning lights, computer screen glow.
**Audio Atmosphere**: Overhead pages, monitor alarms, ambulance sirens, urgent voices overlapping.
**Props**: Crash cart, defibrillator, IV bags, stethoscopes, trauma shears.`,
  },
  {
    id: "hospital-hallway",
    name: "Hospital Corridor",
    icon: "Building2",
    category: "environment",
    subcategory: "Medical",
    template: `**Environment Anchor — Hospital Hallway**
**Setting**: Long institutional corridor with polished linoleum, handrails along walls. Room numbers on doors, supply carts parked along walls. Hand sanitizer stations at intervals.
**Lighting**: Even fluorescent lighting, sterile bright ambiance. Natural light from distant window.
**Audio Atmosphere**: Shoes squeaking, distant intercom pages, elevator dings, rolling cart wheels.
**Props**: Wheelchair, IV pole on wheels, medication cart, hand sanitizer dispenser.`,
  },
  {
    id: "hospital-lounge",
    name: "Doctors Lounge",
    icon: "Coffee",
    category: "environment",
    subcategory: "Medical",
    template: `**Environment Anchor — Physician Lounge**
**Setting**: Worn break room with mismatched furniture. Coffee machine, microwave with "clean your food" sign. Vending machines, small fridge covered in notices. Scrub-clad staff on couches.
**Lighting**: Softer fluorescent, warm light from coffee maker, TV screen glow.
**Audio Atmosphere**: Coffee machine gurgling, tired sighs, quiet conversation, occasional pager.
**Props**: Coffee mugs, protein bars, leftover pizza, scrub caps, stethoscopes, phones charging.`,
  },

  // Urban
  {
    id: "nyc",
    name: "New York City",
    icon: "Building2",
    category: "environment",
    subcategory: "Urban",
    template: `**Environment Anchor — Manhattan Street**
**Setting**: Busy Midtown sidewalk, yellow cabs streaming past. Steam rising from subway grates. Glass skyscrapers and brownstones visible. Hot dog cart on corner, newsstand nearby.
**Lighting**: Late afternoon golden hour, sun reflecting off glass facades. Long shadows on pavement.
**Audio Atmosphere**: Constant traffic hum, distant sirens, construction, snippets of conversations in multiple languages.
**Props**: Fire hydrant, parking meters, food cart, newspaper boxes, coffee cups in hand.`,
  },
  {
    id: "tokyo-train",
    name: "Tokyo Train Station",
    icon: "Train",
    category: "environment",
    subcategory: "Urban",
    template: `**Environment Anchor — Shinjuku Station**
**Setting**: Bustling underground platform during rush hour. Crowds in business suits moving in waves. Digital signage with Japanese characters, platform edge barriers, glowing vending machines.
**Lighting**: Harsh fluorescent overhead, warm glow from vending machines, LED screens casting color shifts.
**Audio Atmosphere**: Station jingles, announcements in Japanese, shuffling feet, pneumatic doors, beeping ticket gates.
**Props**: Briefcases, umbrellas, face masks, bento boxes, smartphone screens glowing.`,
  },
  {
    id: "luxury-mall",
    name: "Luxury Shopping Mall",
    icon: "ShoppingBag",
    category: "environment",
    subcategory: "Urban",
    template: `**Environment Anchor — High-End Galleria**
**Setting**: Multi-level atrium with marble floors and glass ceiling. Designer storefronts with minimal displays. Central fountain sculpture, escalators with glass balustrades.
**Lighting**: Bright natural skylight, warm spotlights on displays, reflections on polished surfaces.
**Audio Atmosphere**: Heels clicking on marble, distant piano music, fountains splashing.
**Props**: Designer shopping bags, champagne flutes, orchid arrangements, velvet rope barriers.`,
  },
  {
    id: "coffee-shop",
    name: "Cozy Coffee Shop",
    icon: "Coffee",
    category: "environment",
    subcategory: "Urban",
    template: `**Environment Anchor — Artisan Café**
**Setting**: Intimate indie coffee shop with exposed brick, reclaimed wood tables. Chalkboard menu, vintage pendant lights. Mismatched chairs, plants on every surface.
**Lighting**: Warm tungsten from Edison bulbs, natural light through large windows.
**Audio Atmosphere**: Espresso machine hissing, acoustic indie playlist, laptop typing, door chime.
**Props**: Ceramic pour-over, latte art, croissants under glass dome, succulents in mason jars.`,
  },
  {
    id: "warehouse",
    name: "Industrial Warehouse",
    icon: "Warehouse",
    category: "environment",
    subcategory: "Urban",
    template: `**Environment Anchor — Urban Loft Space**
**Setting**: Converted warehouse with 30-foot ceilings, exposed steel beams. Polished concrete floors, massive factory windows. Graffiti art on brick, sectional sofa on Persian rug.
**Lighting**: Harsh daylight from oversized windows, neon sign accent, shadows from beams.
**Audio Atmosphere**: Echo of footsteps, distant city sounds, HVAC hum, freight elevator rumble.
**Props**: Vintage typewriter, stacked art canvases, industrial fan, record player.`,
  },
  {
    id: "food-truck",
    name: "Food Truck Festival",
    icon: "UtensilsCrossed",
    category: "environment",
    subcategory: "Urban",
    template: `**Environment Anchor — Street Food Scene**
**Setting**: Parking lot with colorful food trucks. String lights overhead, picnic tables scattered. Crowds at serving windows, smoke rising from grills.
**Lighting**: Late afternoon sun, string light glow, neon signs, visible cooking fire.
**Audio Atmosphere**: Sizzling grills, orders called, Latin music, laughter, truck generators.
**Props**: Paper food boats, plastic forks, hand-written specials signs, tip jars, QR codes.`,
  },

  // Nature
  {
    id: "forest",
    name: "Enchanted Forest",
    icon: "TreePine",
    category: "environment",
    subcategory: "Nature",
    template: `**Environment Anchor — Mystic Woodland**
**Setting**: Dense old-growth forest with moss-covered trees, twisted roots creating archways. Bioluminescent fungi on fallen logs. Mist at knee level, ancient stone ruins visible through undergrowth.
**Lighting**: Dappled emerald-green filtered sunlight, ethereal glow from mushrooms, firefly particles.
**Audio Atmosphere**: Bird calls echoing, leaves rustling, distant stream, creaking branches, wind whispers.
**Props**: Gnarled walking staff, leather satchel, ancient tome, glass lantern, wildflowers.`,
  },
  {
    id: "tropical",
    name: "Tropical Paradise",
    icon: "Palmtree",
    category: "environment",
    subcategory: "Nature",
    template: `**Environment Anchor — Island Beach**
**Setting**: White sand beach curving into turquoise lagoon. Palm trees swaying, coconuts visible. Thatched-roof cabana, coral reef through crystal water. Volcanic mountain in distance.
**Lighting**: Bright tropical sun, water reflections dancing, golden hour warmth, lens flare.
**Audio Atmosphere**: Gentle waves, seagulls, palm fronds rustling, steel drum from distance.
**Props**: Woven beach chair, colorful cocktail, snorkel gear, sunscreen, flip-flops, seashells.`,
  },
  {
    id: "camping",
    name: "Mountain Campsite",
    icon: "Tent",
    category: "environment",
    subcategory: "Nature",
    template: `**Environment Anchor — Alpine Wilderness**
**Setting**: Tent in clearing surrounded by pines, snow-capped peaks visible. Campfire ring with stones, folding chairs. Crystal stream nearby, wildflowers in meadow.
**Lighting**: Golden sunset painting peaks pink, warm firelight, twilight approaching, first stars.
**Audio Atmosphere**: Fire popping, stream babbling, wind through pines, eagle cry, crickets starting.
**Props**: Cast iron skillet, enamel mugs, headlamp, hiking boots, s'mores supplies, camp lantern.`,
  },
  {
    id: "mountain-peak",
    name: "Mountain Summit",
    icon: "Mountain",
    category: "environment",
    subcategory: "Nature",
    template: `**Environment Anchor — Alpine Summit**
**Setting**: Rocky peak above cloud line, 360-degree panorama of mountain ranges. Prayer flags fluttering, cairn of stacked stones marking summit. Thin air, vast sky.
**Lighting**: Crystal clear high-altitude light, sun creating dramatic shadows on distant peaks, blue sky deepening to purple at edges.
**Audio Atmosphere**: Wind howling, prayer flags snapping, distant avalanche rumble, absolute silence between gusts.
**Props**: Ice axe, climbing rope, summit register, goggles, oxygen mask, national flag.`,
  },
  {
    id: "desert-oasis",
    name: "Desert Oasis",
    icon: "Palmtree",
    category: "environment",
    subcategory: "Nature",
    template: `**Environment Anchor — Saharan Refuge**
**Setting**: Lush green palm grove surrounding crystal spring pool, endless golden dunes beyond. Bedouin tent with colorful carpets, camels resting in shade.
**Lighting**: Harsh noon sun on sand, cool shade under palms, water reflections dancing.
**Audio Atmosphere**: Wind across dunes, palm fronds clicking, water bubbling, distant camel groans.
**Props**: Clay water vessels, woven baskets, brass tea set, Persian rugs, hookah pipe.`,
  },

  // Fantasy
  {
    id: "medieval-castle",
    name: "Medieval Castle",
    icon: "Castle",
    category: "environment",
    subcategory: "Fantasy",
    template: `**Environment Anchor — Gothic Fortress**
**Setting**: Grand stone hall with vaulted ceilings, massive fireplace crackling. Tapestries depicting battles, long oak banquet table with pewter candlesticks. Suits of armor flanking doorways.
**Lighting**: Flickering firelight creating dancing shadows, candle glow, cold moonlight through windows.
**Audio Atmosphere**: Fire crackling, wind through stones, distant raven, armor clinking, torch flames.
**Props**: Goblets and flagons, iron chandelier, hunting trophies, ancient weapons, fur pelts.`,
  },
  {
    id: "underwater-kingdom",
    name: "Underwater Kingdom",
    icon: "Waves",
    category: "environment",
    subcategory: "Fantasy",
    template: `**Environment Anchor — Atlantean Palace**
**Setting**: Magnificent coral palace with mother-of-pearl walls. Bioluminescent plants lighting pathways. Schools of tropical fish through open archways. Giant clam thrones, kelp forest gardens.
**Lighting**: Filtered blue-green sunlight, bioluminescent glow, caustic light patterns dancing.
**Audio Atmosphere**: Muffled sounds, whale songs, bubbles rising, dolphin clicks, shell wind chimes.
**Props**: Trident, treasure chests, shipwreck artifacts, pearl jewelry, coral formations.`,
  },
  {
    id: "fairytale-cottage",
    name: "Fairytale Cottage",
    icon: "Home",
    category: "environment",
    subcategory: "Fantasy",
    template: `**Environment Anchor — Witch's Cottage**
**Setting**: Crooked cottage with thatched roof, chimney puffing purple smoke. Wildflower garden with magical plants, mushroom ring nearby. Stepping stones lead to rounded door.
**Lighting**: Warm golden light through diamond-paned windows, firefly glow in garden, warm interior visible.
**Audio Atmosphere**: Bubbling cauldron inside, wind chimes, owl hooting, cat purring, cricket songs.
**Props**: Crystal ball, hanging herb bundles, spell books, broomstick, black cat, potion bottles.`,
  },
  {
    id: "dragon-lair",
    name: "Dragon's Lair",
    icon: "Flame",
    category: "environment",
    subcategory: "Fantasy",
    template: `**Environment Anchor — Treasure Cavern**
**Setting**: Vast cavern filled with mountains of gold coins, gems, artifacts. Ancient dragon sleeping atop hoard. Stalactites dripping, bones of adventurers scattered.
**Lighting**: Warm glow from dragon's breath, torchlight flickering, gold reflections dancing on walls.
**Audio Atmosphere**: Dragon's deep breathing, coins settling, water dripping, echo of footsteps.
**Props**: Overflowing treasure chests, crowns and scepters, ancient weapons, dragon eggs, burnt shields.`,
  },

  // Sci-Fi
  {
    id: "spaceship",
    name: "Spaceship Interior",
    icon: "Rocket",
    category: "environment",
    subcategory: "Sci-Fi",
    template: `**Environment Anchor — Starship Bridge**
**Setting**: Sleek command deck with curved viewport showing star field. Holographic displays with cyan data streams. Captain's chair center, crew stations in semicircle. Chrome and brushed metal, blue ambient strips.
**Lighting**: Cool blue-white from displays, warm orange emergency accents, starlight through viewport.
**Audio Atmosphere**: Low engine hum, soft console beeps, radio chatter, life support ventilation.
**Props**: Holographic star map, magnetic coffee mug, tablet devices, intercom panels, emergency kit.`,
  },
  {
    id: "mars-colony",
    name: "Mars Colony",
    icon: "Rocket",
    category: "environment",
    subcategory: "Sci-Fi",
    template: `**Environment Anchor — Red Planet Habitat**
**Setting**: Pressurized dome on rusty Martian surface. Hydroponic farms glowing green against red landscape. Modular living quarters, rovers in airlock bay. Earth visible as tiny blue dot.
**Lighting**: Orange-red sunlight filtered through dust, artificial grow lights, status indicator LEDs.
**Audio Atmosphere**: Air recycler hum, pressure warnings, radio communications, boots on metal grating.
**Props**: Space suits on racks, freeze-dried food, terraforming plans, family photos from Earth.`,
  },
  {
    id: "cyberpunk-city",
    name: "Cyberpunk City",
    icon: "Building2",
    category: "environment",
    subcategory: "Sci-Fi",
    template: `**Environment Anchor — Neo-Tokyo Streets**
**Setting**: Rain-slicked streets reflecting neon holographic ads. Towering megacorp buildings, street-level food stalls. Crowds in tech-wear, drones overhead. Smog obscuring tops of buildings.
**Lighting**: Neon pink and blue everywhere, hologram flicker, steam rising from vents, puddle reflections.
**Audio Atmosphere**: Synth music from clubs, foreign language ads, hovercars whooshing, rain on metal.
**Props**: Ramen bowls, cyber-implants, holographic phones, umbrellas, augmented reality glasses.`,
  },
  {
    id: "space-station",
    name: "Space Station",
    icon: "Globe",
    category: "environment",
    subcategory: "Sci-Fi",
    template: `**Environment Anchor — Orbital Platform**
**Setting**: Rotating ring station with Earth filling viewport. Zero-G central hub, gravity in outer ring. International crew in jumpsuits, floating supplies secured with velcro.
**Lighting**: Harsh sunlight through windows, artificial day/night cycle, emergency strip lighting in corridors.
**Audio Atmosphere**: Constant air circulation, radio chatter with ground, equipment beeps, velcro ripping.
**Props**: Floating water globules, squeeze food packets, laptop velcroed to wall, exercise equipment.`,
  },

  // Historical
  {
    id: "ancient-rome",
    name: "Roman Colosseum",
    icon: "Sword",
    category: "environment",
    subcategory: "Historical",
    template: `**Environment Anchor — Gladiatorial Arena**
**Setting**: Massive stone amphitheater with roaring crowds in togas. Sandy arena floor stained with combat. Emperor's box with purple canopy. Gladiators emerging from underground tunnels.
**Lighting**: Bright Mediterranean sun, shadows from awning, torch light in tunnels, dust clouds catching light.
**Audio Atmosphere**: Crowd roaring and chanting, metal clashing, lions roaring, trumpets, feet stomping.
**Props**: Gladius swords, tridents and nets, shields with eagles, laurel wreaths, chariot wheels.`,
  },
  {
    id: "1920s-speakeasy",
    name: "1920s Speakeasy",
    icon: "Wine",
    category: "environment",
    subcategory: "Historical",
    template: `**Environment Anchor — Prohibition Jazz Club**
**Setting**: Hidden basement behind fake bookshelf. Art deco styling, intimate velvet booths. Jazz band on small stage, cigarette smoke hazing air. Bar serving drinks in teacups.
**Lighting**: Warm amber glow, stage spotlight, candles on tables, neon sign backwards from inside.
**Audio Atmosphere**: Live jazz, ice in glasses, whispered conversations, distant police sirens, flapper heels.
**Props**: Bootleg bottles, feather boas, Tommy guns under tables, pearl necklaces, fedoras.`,
  },
  {
    id: "wild-west-saloon",
    name: "Wild West Saloon",
    icon: "Drama",
    category: "environment",
    subcategory: "Historical",
    template: `**Environment Anchor — Frontier Watering Hole**
**Setting**: Dusty wooden saloon with swinging doors. Long bar with brass rail, whiskey bottles. Player piano, poker tables with cowboys. Wanted posters on walls, spittoons on floor.
**Lighting**: Harsh afternoon sun through dirty windows, kerosene lamp glow, dusty light beams.
**Audio Atmosphere**: Piano ragtime, poker chips clinking, boots on wood, distant gunshots, horse whinnies.
**Props**: Shot glasses, playing cards, sheriff's badge, six-shooter, cowboy hats, lasso.`,
  },
  {
    id: "victorian-london",
    name: "Victorian London",
    icon: "Building2",
    category: "environment",
    subcategory: "Historical",
    template: `**Environment Anchor — Foggy Gaslight Streets**
**Setting**: Cobblestone streets shrouded in thick fog. Gas lamps creating halos of light. Horse-drawn carriages, top-hatted gentlemen. Brick townhouses, iron fences, Big Ben in distance.
**Lighting**: Dim yellow gaslight, diffused through fog, warm windows in buildings.
**Audio Atmosphere**: Horse hooves on cobblestones, distant Big Ben chimes, carriage wheels, street vendor calls.
**Props**: Walking canes, pocket watches, parasols, newspapers, coal smoke chimneys, street urchins.`,
  },

  // Domestic
  {
    id: "suburban",
    name: "Suburban Home",
    icon: "Home",
    category: "environment",
    subcategory: "Domestic",
    template: `**Environment Anchor — American Suburbia**
**Setting**: Split-level house, manicured lawn with sprinkler. Two-car garage, basketball hoop on driveway. White picket fence, mailbox at curb. Mature oak tree with tire swing.
**Lighting**: Bright midday sun, harsh shadows, blue sky with fluffy clouds. Warm interior through windows.
**Audio Atmosphere**: Lawnmower in distance, children playing, dog barking, ice cream truck, sprinkler clicking.
**Props**: Garden hose, recycling bins, kid's bicycle, welcome mat, American flag, backyard grill.`,
  },
  {
    id: "apartment-studio",
    name: "Studio Apartment",
    icon: "Home",
    category: "environment",
    subcategory: "Domestic",
    template: `**Environment Anchor — Urban Bachelor Pad**
**Setting**: Compact 400 sq ft with Murphy bed, kitchenette. Clothing rack instead of closet, IKEA furniture. Plants on windowsill, string lights for ambiance. Organized chaos.
**Lighting**: Natural light from single window, warm lamp glow, laptop screen, string light twinkle.
**Audio Atmosphere**: City traffic outside, neighbor's music through wall, radiator clanking, cat purring.
**Props**: Coffee maker, stacked books, yoga mat rolled up, guitar in corner, empty takeout containers.`,
  },
  {
    id: "luxury-penthouse",
    name: "Luxury Penthouse",
    icon: "Building2",
    category: "environment",
    subcategory: "Domestic",
    template: `**Environment Anchor — Manhattan Skyline Living**
**Setting**: Floor-to-ceiling windows with city panorama. Minimalist modern furniture, statement art pieces. Private terrace visible, pool table, bar cart. Everything designer, nothing out of place.
**Lighting**: Golden hour light flooding in, carefully placed accent lighting, city lights twinkling at night.
**Audio Atmosphere**: Subtle jazz playlist, ice clinking in glass, soft ventilation, distant helicopter.
**Props**: Crystal decanters, abstract sculpture, grand piano, designer coffee table books, fresh flowers.`,
  },
  {
    id: "cozy-cabin",
    name: "Cozy Cabin",
    icon: "Home",
    category: "environment",
    subcategory: "Domestic",
    template: `**Environment Anchor — Mountain Retreat**
**Setting**: Log cabin with stone fireplace crackling. Worn leather couch with plaid blankets. Antler chandelier, books stacked everywhere. Snow visible through frosted windows.
**Lighting**: Warm firelight flickering, candles on mantle, snow-reflected light through windows.
**Audio Atmosphere**: Fire crackling, wind outside, floorboards creaking, kettle whistling, pages turning.
**Props**: Hot cocoa mugs, wool socks, dog sleeping on rug, board games, ski equipment by door.`,
  },

  // Spooky
  {
    id: "haunted-mansion",
    name: "Haunted Mansion",
    icon: "Ghost",
    category: "environment",
    subcategory: "Spooky",
    template: `**Environment Anchor — Victorian Horror House**
**Setting**: Decrepit Victorian mansion with peeling wallpaper. Grand staircase with missing banisters. Dust-covered furniture under sheets. Cracked mirrors, portraits with following eyes. Cobwebs like curtains.
**Lighting**: Flickering candlelight, moonlight through broken windows, shadows moving independently.
**Audio Atmosphere**: Creaking floorboards, distant whispers, clock chiming wrong hours, chains rattling.
**Props**: Ouija board, antique dolls, rusty keys, faded photographs, bloody handprint, candelabra.`,
  },
  {
    id: "graveyard",
    name: "Midnight Graveyard",
    icon: "Skull",
    category: "environment",
    subcategory: "Spooky",
    template: `**Environment Anchor — Gothic Cemetery**
**Setting**: Ancient graveyard with tilted headstones, moss-covered. Iron gate entrance, dead tree silhouettes. Mausoleum in background, fog rolling across ground. Crows perched everywhere.
**Lighting**: Full moon casting long shadows, flickering lightning in distance, ethereal fog glow.
**Audio Atmosphere**: Crows cawing, wind moaning, gate creaking, thunder rumbling, scratching from below.
**Props**: Wilted flowers on graves, shovel, lantern, torn mourning veil, fresh dirt pile, skeleton hand emerging.`,
  },
  {
    id: "abandoned-asylum",
    name: "Abandoned Asylum",
    icon: "Ghost",
    category: "environment",
    subcategory: "Spooky",
    template: `**Environment Anchor — Psychiatric Horror**
**Setting**: Crumbling psychiatric hospital with peeling paint. Rusted gurneys in hallways, restraint chairs. Padded cells with scratched walls, medical files scattered. Wheelchair sitting alone.
**Lighting**: Flickering fluorescent, green exit sign glow, flashlight beams, moonlight through broken skylights.
**Audio Atmosphere**: Dripping water, distant screaming echoes, metal clanging, static from old PA system.
**Props**: Straitjackets, shock therapy equipment, patient files, broken syringes, tattered hospital gowns.`,
  },

  // Travel
  {
    id: "airplane-cabin",
    name: "Airplane Cabin",
    icon: "Plane",
    category: "environment",
    subcategory: "Travel",
    template: `**Environment Anchor — Commercial Flight**
**Setting**: Economy class mid-flight, rows of blue seats. Overhead bins closed, seatback screens glowing. Flight attendants with cart. Window shades mixed open/closed, clouds visible.
**Lighting**: Dim cabin for night flight, individual reading lights, blue accent strips, harsh sunlight through open shades.
**Audio Atmosphere**: Engine drone constant, announcements, drink cart rattling, baby crying, air conditioning hiss.
**Props**: Tray table with airline meal, neck pillow, noise-canceling headphones, tiny liquor bottles, boarding pass.`,
  },
  {
    id: "train-compartment",
    name: "Train Compartment",
    icon: "Train",
    category: "environment",
    subcategory: "Travel",
    template: `**Environment Anchor — European Sleeper Car**
**Setting**: Intimate train compartment with facing bench seats, fold-down beds. Countryside racing past window. Small fold-out table, luggage rack above. Curtains for privacy.
**Lighting**: Golden afternoon sun streaming in, occasional tunnel darkness, warm compartment lamp.
**Audio Atmosphere**: Rhythmic clacking on tracks, whistle at crossings, station announcements, dining car bell.
**Props**: Newspaper in foreign language, tea service, leather suitcase, passport, mystery novel, conductor's ticket punch.`,
  },
  {
    id: "cruise-ship",
    name: "Cruise Ship Deck",
    icon: "Anchor",
    category: "environment",
    subcategory: "Travel",
    template: `**Environment Anchor — Luxury Liner**
**Setting**: Teak deck of massive cruise ship, endless ocean horizon. Pool area with loungers, deck chairs with blankets. Shuffleboard court, cocktail waiters circulating. Sunset on water.
**Lighting**: Golden hour over ocean, pool reflections, tiki torch accents, string lights activating at dusk.
**Audio Atmosphere**: Ship horn in distance, waves against hull, pool splashing, steel drum band, seagulls.
**Props**: Tropical cocktails with umbrellas, life preserver, captain's hat, binoculars, deck of cards, sunscreen.`,
  },

  // Holiday
  {
    id: "north-pole-workshop",
    name: "Santa's Workshop",
    icon: "Gift",
    category: "environment",
    subcategory: "Holiday",
    template: `**Environment Anchor — North Pole Toy Factory**
**Setting**: Cozy wooden workshop filled with busy elves at workbenches. Conveyor belts carrying wrapped presents. Giant naughty/nice list on wall. Reindeer stable through frosty window.
**Lighting**: Warm golden fireplace glow, twinkling Christmas lights, snow glow through windows, candy cane strip lights.
**Audio Atmosphere**: Hammering and sawing, jingling bells, elves singing carols, reindeer hooves, crackling fire.
**Props**: Toys in progress, hot cocoa station, Santa's suit on hook, letters to Santa pile, magic snow globe.`,
  },
  {
    id: "halloween-house",
    name: "Halloween House",
    icon: "Ghost",
    category: "environment",
    subcategory: "Holiday",
    template: `**Environment Anchor — Trick-or-Treat Central**
**Setting**: Suburban house decked out for Halloween. Jack-o-lanterns lining walkway, fake gravestones on lawn. Skeleton climbing roof, fog machine running. Costumed kids approaching door.
**Lighting**: Orange and purple string lights, candle glow from pumpkins, strobe lightning effects, motion-activated scares.
**Audio Atmosphere**: Monster Mash playing, kids shrieking with joy, doorbell ringing, animatronic cackles.
**Props**: Candy bowl, costume accessories scattered, cauldron, broomstick, spider webs, full-size candy bars.`,
  },
  {
    id: "beach-resort",
    name: "Beach Resort",
    icon: "Palmtree",
    category: "environment",
    subcategory: "Holiday",
    template: `**Environment Anchor — All-Inclusive Paradise**
**Setting**: Pristine resort beach with cabanas, white sand immaculate. Swim-up bar visible, infinity pool merging with ocean. Palm trees with hammocks, water sports equipment.
**Lighting**: Perfect tropical sun, umbrella shade contrast, sunset colors reflecting on water, tiki torch evening.
**Audio Atmosphere**: Waves lapping gently, resort music playlist, blender making frozen drinks, distant jet ski.
**Props**: Resort wristband, fruity cocktails, oversized sunglasses, beach read, room key card, spa towel.`,
  },
];
