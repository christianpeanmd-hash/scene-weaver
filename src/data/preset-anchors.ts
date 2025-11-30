import { Ghost, Building2, Rocket, Crown, Sparkles, TreePine, Home, Mountain, Palmtree, Factory, Coffee, Warehouse, Castle, Train, Tent, ShoppingBag, Plane, UtensilsCrossed, Bird, Gift, Skull, Anchor, Drama, Star, Flame, Snowflake, Glasses, Sword, Gem, Waves, Wine, Radiation, Globe, Moon, Pyramid } from "lucide-react";

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
  {
    id: "thanksgiving-turkey",
    name: "Thanksgiving Turkey",
    icon: "Bird",
    category: "character",
    template: `**Character Anchor — Tom the Turkey**
**Look**: Plump bronze-feathered turkey with magnificent tail fan displaying iridescent colors. Bright red wattle and snood wobbling with each movement. Comically oversized drumsticks, dignified chest puff. Tiny pilgrim hat perched between feathers, occasionally askew.
**Demeanor**: Perpetually nervous during November, suspiciously eyes any mention of "dinner." Struts with forced confidence that collapses into panic at oven sounds. Surprisingly articulate when advocating for vegetarian alternatives.
**Role**: Holiday mascot desperately trying to rebrand Thanksgiving as "Tofurkey Day."`,
  },
  {
    id: "santa-claus",
    name: "Santa Claus",
    icon: "Gift",
    category: "character",
    template: `**Character Anchor — Kris Kringle**
**Look**: Jolly rotund figure with snow-white beard flowing to mid-chest, rosy cheeks glowing. Iconic red velvet suit with white fur trim, black leather belt with ornate gold buckle. Half-moon spectacles perched on button nose. Twinkling blue eyes with permanent crow's feet from smiling.
**Demeanor**: Boundlessly cheerful with deep belly laughs that shake his frame. Speaks with warm wisdom, remembers everyone's name. Occasionally overwhelmed by modern Christmas commercialism. Cookie enthusiast, milk connoisseur.
**Role**: The legendary gift-giver navigating modern holiday chaos with timeless cheer.`,
  },
  {
    id: "einstein",
    name: "Albert Einstein",
    icon: "Glasses",
    category: "character",
    template: `**Character Anchor — The Professor**
**Look**: Wild white hair defying gravity in all directions. Bushy mustache, kind deeply-lined face with penetrating brown eyes. Rumpled cardigan over collared shirt, no tie. Often sockless in worn leather shoes. Chalk dust on fingers, pipe occasionally in hand.
**Demeanor**: Absent-minded about daily life, laser-focused on ideas. Speaks with German accent, uses simple analogies for complex concepts. Playful sense of humor, sticks tongue out when photographed. Humble despite genius.
**Role**: History's most famous physicist explaining the universe through everyday examples.`,
  },
  {
    id: "cleopatra",
    name: "Cleopatra",
    icon: "Crown",
    category: "character",
    template: `**Character Anchor — Queen of the Nile**
**Look**: Striking Egyptian beauty with kohl-lined almond eyes, golden headdress with cobra. Black hair in elaborate braids adorned with gold beads. Flowing white linen gown with golden collar necklace, asp armband. Regal posture, chin always elevated.
**Demeanor**: Commands attention without raising voice. Strategic mind behind seductive exterior. Speaks multiple languages fluently. Alternates between deadly serious and wickedly playful. Treats servants kindly, enemies ruthlessly.
**Role**: Ancient world's most powerful woman navigating politics, romance, and ruling an empire.`,
  },
  {
    id: "napoleon",
    name: "Napoleon Bonaparte",
    icon: "Sword",
    category: "character",
    template: `**Character Anchor — The Emperor**
**Look**: Compact 5'6" frame with commanding presence. Bicorne hat worn sideways, grey military coat over white waistcoat. Hand perpetually tucked in jacket. Sharp angular face, intense grey eyes, slightly receding hairline. Impeccable posture despite short stature.
**Demeanor**: Restless energy, paces while thinking. Speaks rapidly with Corsican-French accent. Obsessed with legacy and maps. Surprisingly charming in person, terrifying in battle. Complex about height jokes.
**Role**: Military genius and emperor whose ambition reshaped Europe.`,
  },
  {
    id: "caveman",
    name: "Caveman",
    icon: "Flame",
    category: "character",
    template: `**Character Anchor — Grug the Prehistoric**
**Look**: Barrel-chested with heavily muscled arms, covered in coarse dark hair. Prominent brow ridge, flat nose, strong jaw. Wears rough animal furs tied with vine rope. Carries wooden club everywhere. Dirt-streaked skin, calloused hands and feet.
**Demeanor**: Confused by modern technology, fascinated by fire. Communicates with grunts and surprisingly expressive hand gestures. Gentle with animals, protective of tribe. Tries new foods by smashing them first.
**Role**: Stone Age survivor discovering the bewildering modern world.`,
  },
  {
    id: "pirate-captain",
    name: "Pirate Captain",
    icon: "Anchor",
    category: "character",
    template: `**Character Anchor — Captain Blackwood**
**Look**: Weathered face with dramatic scar across left eye, covered by black eyepatch. Tricorn hat with feather, long dark coat over billowing white shirt. Multiple rings, gold tooth glinting. Wild beard with beads and small bones woven in. Peg leg that clicks on wood.
**Demeanor**: Boisterous and theatrical, speaks in nautical metaphors. Surprisingly well-read and philosophical when drunk. Loyal to crew, merciless to enemies. Has complicated relationship with the sea.
**Role**: Legendary buccaneer seeking treasure and freedom on the high seas.`,
  },
  {
    id: "alien-ambassador",
    name: "Alien Ambassador",
    icon: "Star",
    category: "character",
    template: `**Character Anchor — Zyx-7 of the Galactic Council**
**Look**: Tall slender grey being with oversized almond eyes (no visible iris, just deep black). Smooth hairless head with subtle bioluminescent patterns. Long fingers with extra joint. Wears iridescent diplomatic robes that shift color with mood. Small translation device on collar.
**Demeanor**: Struggles with human idioms (takes everything literally). Fascinated by mundane Earth activities. Speaks in formal diplomatic tone, occasionally breaks into confused questions. Terrified of cats for unexplained reasons.
**Role**: Intergalactic diplomat trying to understand humanity's chaotic species.`,
  },
  {
    id: "vampire",
    name: "Elegant Vampire",
    icon: "Moon",
    category: "character",
    template: `**Character Anchor — Count Vladislav**
**Look**: Pale aristocratic features with sharp cheekbones, slicked-back dark hair with widow's peak. Red-lined black cape over immaculate Victorian evening wear. Elongated canines visible when speaking. Hypnotic dark eyes with occasional red glint. Silver rings on long fingers.
**Demeanor**: Old-world manners, speaks with Transylvanian accent. Dramatically formal, offended by garlic mentions. Struggles with modern technology, misses the "old days." Surprisingly lonely, seeks connection.
**Role**: Centuries-old immortal adapting to modern dating and social media.`,
  },
  {
    id: "pharaoh",
    name: "Egyptian Pharaoh",
    icon: "Pyramid",
    category: "character",
    template: `**Character Anchor — Ramesses the Great**
**Look**: Tall regal figure with golden Nemes headdress and Uraeus cobra crown. Heavy kohl around piercing eyes, false ceremonial beard attached. Bare bronzed chest with gold pectoral collar. White pleated shendyt, golden sandals. Crook and flail crossed over chest.
**Demeanor**: Speaks in third person about himself. Expects worship, confused when not received. Fascinated by building and legacy. Surprisingly curious about other cultures. Dramatic hand gestures.
**Role**: God-king of ancient Egypt ruling the most powerful civilization on Earth.`,
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
  {
    id: "mars-colony",
    name: "Mars Colony",
    icon: "Rocket",
    category: "environment",
    template: `**Environment Anchor — Red Planet Habitat**
**Setting**: Pressurized dome habitat on rusty Martian surface. Hydroponic farms glowing green against red landscape outside. Modular living quarters with recycled air systems. Rovers parked in airlock bay. Earth visible as tiny blue dot through dome.
**Lighting**: Harsh orange-red sunlight filtered through dust, artificial blue-white grow lights, status indicator LEDs everywhere.
**Audio Atmosphere**: Constant air recycler hum, pressure differential warnings, radio communications, boots on metal grating, distant drilling operations.
**Props**: Space suits on racks, freeze-dried food packets, tablet computers, terraforming plans on wall, family photos from Earth, Martian rock samples.`,
  },
  {
    id: "haunted-mansion",
    name: "Haunted Mansion",
    icon: "Ghost",
    category: "environment",
    template: `**Environment Anchor — Victorian Horror House**
**Setting**: Decrepit Victorian mansion with peeling wallpaper revealing older patterns beneath. Grand staircase with missing banisters. Dust-covered furniture under white sheets. Cracked mirrors, portraits with eyes that seem to follow. Cobwebs draped like curtains.
**Lighting**: Flickering candlelight, moonlight through broken windows, shadows that move independently, sudden lightning flashes.
**Audio Atmosphere**: Creaking floorboards, distant whispers, clock chiming wrong hours, wind through gaps, chains rattling, music box playing alone.
**Props**: Ouija board, antique dolls, rusty keys, faded photographs, bloody handprint, candelabra, mysterious locked door.`,
  },
  {
    id: "wild-west-saloon",
    name: "Wild West Saloon",
    icon: "Drama",
    category: "environment",
    template: `**Environment Anchor — Frontier Watering Hole**
**Setting**: Dusty wooden saloon with swinging doors. Long bar with brass rail, shelves of whiskey bottles. Player piano in corner, poker tables with cowboys. Wanted posters on walls, spittoons on floor. Saloon girl on balcony overlooking main floor.
**Lighting**: Harsh afternoon sun through dirty windows, kerosene lamp glow, dusty light beams, warm tungsten tones.
**Audio Atmosphere**: Piano ragtime, poker chips clinking, boots on wooden floor, glasses clinking, distant gunshots, horse whinnies outside.
**Props**: Shot glasses, playing cards, sheriff's badge, six-shooter, cowboy hats, lasso, gold nuggets, tobacco spit bucket.`,
  },
  {
    id: "underwater-kingdom",
    name: "Underwater Kingdom",
    icon: "Waves",
    category: "environment",
    template: `**Environment Anchor — Atlantean Palace**
**Setting**: Magnificent coral palace with mother-of-pearl walls. Bioluminescent plants lighting pathways. Schools of tropical fish swimming through open archways. Giant clam thrones, kelp forest gardens. Merpeople swimming past elegant architecture.
**Lighting**: Filtered blue-green sunlight from surface, bioluminescent glow, shimmering caustic light patterns dancing on everything.
**Audio Atmosphere**: Muffled underwater sounds, whale songs, bubbles rising, current whooshing, distant dolphin clicks, shell wind chimes.
**Props**: Trident, treasure chests, shipwreck artifacts, pearl jewelry, sea glass, ancient maps on waterproof material, coral formations.`,
  },
  {
    id: "1920s-speakeasy",
    name: "1920s Speakeasy",
    icon: "Wine",
    category: "environment",
    template: `**Environment Anchor — Prohibition Jazz Club**
**Setting**: Hidden basement club behind fake bookshelf door. Art deco styling with geometric patterns. Intimate booths with velvet curtains. Jazz band on small stage, cigarette smoke hazing the air. Bar serving drinks in teacups to maintain cover.
**Lighting**: Warm amber glow, stage spotlight, candles on tables, neon "Open" sign backwards (from inside), dramatic shadows.
**Audio Atmosphere**: Live jazz music, ice in glasses, whispered conversations, laughter, distant police sirens, flapper heels clicking.
**Props**: Bootleg liquor bottles, feather boas, Tommy guns hidden under tables, pearl necklaces, fedoras, vintage microphone, cigarette holders.`,
  },
  {
    id: "post-apocalyptic",
    name: "Post-Apocalyptic Wasteland",
    icon: "Radiation",
    category: "environment",
    template: `**Environment Anchor — Nuclear Aftermath**
**Setting**: Destroyed city with crumbling skyscrapers and abandoned cars. Overgrown vegetation reclaiming streets. Makeshift survivor camps with corrugated metal shelters. Rusted playground equipment, faded billboards. Ominous clouds on horizon.
**Lighting**: Sickly yellow-green sky, harsh shadows, dust particles in air, occasional lightning in distance, campfire warmth at night.
**Audio Atmosphere**: Wind whistling through ruins, distant thunder, Geiger counter clicking, metal creaking, wild dogs howling.
**Props**: Gas masks, makeshift weapons, canned food, water purification tablets, radiation suits, faded photographs, handwritten survivor notes.`,
  },
  {
    id: "ancient-rome",
    name: "Roman Colosseum",
    icon: "Sword",
    category: "environment",
    template: `**Environment Anchor — Gladiatorial Arena**
**Setting**: Massive stone amphitheater filled with roaring crowds in togas. Sandy arena floor stained with combat. Emperor's box with purple canopy. Gladiators emerging from underground tunnels. Lions pacing in cages below.
**Lighting**: Bright Mediterranean sun, shadows from awning system, torch light in tunnels, dust clouds catching light.
**Audio Atmosphere**: Crowd roaring and chanting, metal clashing, lions roaring, trumpets announcing, Latin shouting, feet stomping on stone.
**Props**: Gladius swords, tridents and nets, shields with Roman eagles, laurel wreaths, emperor's thumb gesture, chariot wheels.`,
  },
  {
    id: "north-pole-workshop",
    name: "Santa's Workshop",
    icon: "Gift",
    category: "environment",
    template: `**Environment Anchor — North Pole Toy Factory**
**Setting**: Cozy wooden workshop filled with busy elves at workbenches. Conveyor belts carrying wrapped presents. Giant list of nice/naughty names on wall. Reindeer stable visible through frosty window. Hot cocoa station in corner.
**Lighting**: Warm golden glow from fireplace, twinkling Christmas lights, snow glow through windows, candy cane strip lights.
**Audio Atmosphere**: Hammering and sawing, jingling bells, elves singing carols, reindeer hooves on roof, distant sleigh bells, crackling fire.
**Props**: Half-finished toys, wrapped presents, candy canes, nice/naughty list scroll, snow globes, elf shoes with bells, hot cocoa mugs.`,
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
  Bird,
  Gift,
  Skull,
  Anchor,
  Drama,
  Star,
  Flame,
  Snowflake,
  Glasses,
  Sword,
  Gem,
  Waves,
  Wine,
  Radiation,
  Globe,
  Moon,
  Pyramid,
};
