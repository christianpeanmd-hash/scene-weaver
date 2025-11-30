export interface InfographicStyle {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
  useCase: string;
}

export const INFOGRAPHIC_STYLES: InfographicStyle[] = [
  {
    id: "minimalist-bw",
    name: "Minimalist Black & White",
    description: "Ultra-detailed sketch style with clean lines and minimal color",
    promptTemplate: "Create an infographic on {topic}, in a minimalistic (black and white) but ultra-detailed style.",
    useCase: "Academic papers, research summaries, complex concepts",
  },
  {
    id: "sketch-style",
    name: "Hand-Drawn Sketch",
    description: "Organic sketch style with hand-drawn elements, avoiding futuristic aesthetics",
    promptTemplate: "Create an infographic on {topic}. Be as detailed as possible, with a sketch style. Avoid futuristic style.",
    useCase: "YouTube summaries, learning content, tutorials",
  },
  {
    id: "complex-technical",
    name: "Complex Technical",
    description: "Detailed technical diagrams explaining systems and processes",
    promptTemplate: "Make an infographic that explains {topic}. Include all key components, connections, and flow of information.",
    useCase: "Technical concepts, system architecture, scientific processes",
  },
  {
    id: "step-by-step",
    name: "Step-by-Step Tutorial",
    description: "Clean flat design with numbered steps in rounded boxes",
    promptTemplate: "A step-by-step tutorial graphic titled '{topic}'. Create a clean, flat-design infographic with steps, each inside rounded boxes. Use minimal vector-style illustrations, clear sans-serif English text, simple icons, and a modern layout. Include a large header banner at the top and numbered steps below. White background, high contrast, high-resolution. Be as detailed as possible.",
    useCase: "How-to guides, tutorials, process explanations",
  },
  {
    id: "career-map",
    name: "Themed Career/Journey Map",
    description: "Creative journey map with themed metaphors (fantasy, adventure, etc.)",
    promptTemplate: "Create a fun career/journey map of {topic} using a creative theme. Include relevant allusions or metaphors that connect the content to the chosen theme, so the map feels coherent. Write all text legibly and clearly.",
    useCase: "LinkedIn profiles, career paths, company history",
  },
  {
    id: "cheatsheet",
    name: "Key Takeaways Cheatsheet",
    description: "Condensed 9:16 vertical format with key points",
    promptTemplate: "Turn this content into a cheatsheet with key takeaways, as a 9:16 vertical infographic. Topic: {topic}",
    useCase: "Social media, quick reference, summaries",
  },
  {
    id: "landmark-map",
    name: "3D Landmark Map",
    description: "3D illustrated map with iconic landmarks",
    promptTemplate: "Make a landmark map of {topic} with 3D landmarks and clear labels.",
    useCase: "City guides, travel content, location-based info",
  },
  {
    id: "biology-diagram",
    name: "Scientific Diagram",
    description: "Clean biological/scientific diagrams showing cycles and processes",
    promptTemplate: "Generate a detailed diagram of {topic}, showing all stages and connections clearly labeled.",
    useCase: "Biology, chemistry, scientific processes",
  },
  {
    id: "mega-infographic",
    name: "Custom Design",
    description: "Fully customizable with aspect ratio, style, colors, and layout",
    promptTemplate: `Design a {aspectRatio} infographic.

## SUBJECT MATTER
Topic: {topic}
Central Focus: {centralFocus}

## VISUAL STYLE
Art Style: {artStyle}
Color Palette: {colorPalette}
Background: {background}

## COMPOSITION & LAYOUT
Structure: {structure}
Elements: {elements}`,
    useCase: "Custom branded content, presentations, marketing",
  },
];

export const INFOGRAPHIC_ASPECT_RATIOS = [
  { id: "16:9", name: "Landscape (16:9)", description: "Presentations, YouTube thumbnails" },
  { id: "9:16", name: "Portrait (9:16)", description: "Instagram Stories, TikTok" },
  { id: "1:1", name: "Square (1:1)", description: "Social media posts" },
  { id: "4:3", name: "Standard (4:3)", description: "Traditional presentations" },
];
