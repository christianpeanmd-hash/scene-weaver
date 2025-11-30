export interface InfographicStyle {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
  useCase: string;
  category: "educational" | "data" | "process" | "marketing" | "social" | "custom";
}

export const INFOGRAPHIC_STYLES: InfographicStyle[] = [
  // Educational & Explainer
  {
    id: "explainer",
    name: "Explainer Infographic",
    description: "Step-by-step breakdown with headline, intro, icons and takeaway box",
    promptTemplate: `Create a vertical infographic that explains {topic} in a step-by-step format. Start with a short, engaging headline and a brief one-sentence intro. Break the content into 3–5 simple steps. Each step should have a bold title, an icon, and 1–2 short lines of text. Keep the layout clean and consistent. Add a visual summary or takeaway box at the bottom.`,
    useCase: "Tutorials, how-to guides, concept explanations",
    category: "educational",
  },
  {
    id: "educational",
    name: "Educational Breakdown",
    description: "Structured content blocks: What, Why, and How sections",
    promptTemplate: `Create an educational infographic on {topic}. Divide it into 3–4 content blocks with section titles like 'What it is,' 'Why it matters,' and 'How to apply it.' Each block should have 2–3 bullet points, icons, and clear headings. Use visual consistency and a bold opening to catch attention.`,
    useCase: "Learning content, concept explanations, training materials",
    category: "educational",
  },
  {
    id: "step-by-step",
    name: "Step-by-Step Tutorial",
    description: "Numbered steps in rounded boxes with minimal vector illustrations",
    promptTemplate: `A step-by-step tutorial graphic titled '{topic}'. Create a clean, flat-design infographic with steps, each inside rounded boxes. Use minimal vector-style illustrations, clear sans-serif English text, simple icons, and a modern layout. Include a large header banner at the top and numbered steps below. White background, high contrast, high-resolution. Be as detailed as possible.`,
    useCase: "How-to guides, tutorials, process explanations",
    category: "process",
  },
  
  // Data & Analytics
  {
    id: "data-driven",
    name: "Data-Driven Insights",
    description: "Key stats, charts, and trend analysis with visual callouts",
    promptTemplate: `Design a data-focused infographic to present insights from {topic}. Begin with a headline that grabs attention. Include 3 sections: Key Stats (with icons or number callouts), Graphs (bar, pie, or line chart), and Insights (brief commentary or trend summary). Stick to visual clarity. Add your source or CTA at the bottom.`,
    useCase: "Reports, research summaries, statistics presentation",
    category: "data",
  },
  {
    id: "comparison",
    name: "Comparison Chart",
    description: "Side-by-side two-column comparison with feature rows",
    promptTemplate: `Design a two-column infographic comparing aspects of {topic}. Start with a centered title. Each column should include 3–5 feature rows, with icons and bold headers. Highlight differences using contrasting background colors. Add a conclusion box with a quick summary or recommendation.`,
    useCase: "Product comparisons, pros/cons, decision making",
    category: "data",
  },
  {
    id: "complex-technical",
    name: "Technical Diagram",
    description: "Detailed system diagrams showing components and connections",
    promptTemplate: `Make an infographic that explains {topic}. Include all key components, connections, and flow of information. Use technical diagram style with clear labels and arrows showing relationships.`,
    useCase: "Technical concepts, system architecture, scientific processes",
    category: "data",
  },
  
  // Process & Timeline
  {
    id: "timeline",
    name: "Timeline Infographic",
    description: "Horizontal or vertical progression with milestones and dates",
    promptTemplate: `Create a horizontal or vertical timeline infographic for {topic}. Start with a title and brief intro. Add 4–6 time markers (dates or milestones) with short descriptions and icons. Use visual spacing to guide the eye from start to finish. Use arrows or lines to show progress.`,
    useCase: "History, project phases, company milestones",
    category: "process",
  },
  {
    id: "process-flow",
    name: "Process Flow",
    description: "Workflow diagram with arrows showing direction and order",
    promptTemplate: `Design a flow-style infographic explaining the process of {topic}. Include a short headline and 5–7 steps. Each step should use an arrow, line, or number to show direction. Add icons, step titles, and short action points. Light spacing and clear order.`,
    useCase: "Workflows, procedures, operational guides",
    category: "process",
  },
  {
    id: "career-map",
    name: "Journey Map",
    description: "Creative themed journey with metaphors and milestones",
    promptTemplate: `Create a fun career/journey map of {topic} using a creative theme. Include relevant allusions or metaphors that connect the content to the chosen theme, so the map feels coherent. Write all text legibly and clearly.`,
    useCase: "Career paths, customer journeys, learning paths",
    category: "process",
  },
  
  // Marketing & Lead Gen
  {
    id: "lead-magnet",
    name: "Lead Magnet",
    description: "Downloadable value-packed tips designed for PDF sharing",
    promptTemplate: `Design a downloadable lead magnet infographic titled '{topic}.' Include 3–5 value-packed tips or facts, each with icons, bold headlines, and supporting details. Add a footer with a CTA like 'Download the full version' or 'Learn more at [Website].' Ensure it's optimized for PDF and social media sharing.`,
    useCase: "Email sign-ups, gated content, downloads",
    category: "marketing",
  },
  {
    id: "product-benefits",
    name: "Product Benefits",
    description: "Feature showcase with benefit icons and descriptions",
    promptTemplate: `Design a product benefits infographic for {topic}. Start with a strong title like 'Why You'll Love This.' Include 4–6 points, each with a bold benefit name, icon, and short description. Leave space for a product photo or hero image.`,
    useCase: "Product marketing, sales pages, feature lists",
    category: "marketing",
  },
  {
    id: "checklist",
    name: "Checklist Infographic",
    description: "Branded checklist with check icons and action items",
    promptTemplate: `Create a branded checklist infographic titled '{topic}.' Use a vertical layout with 6–10 checklist items. Each item should include a check icon, a bold title, and 1 short sentence of description. Use a clear font, consistent icon style. Add a footer with a download link or call-to-action.`,
    useCase: "Action guides, audit lists, preparation guides",
    category: "marketing",
  },
  
  // Social Media
  {
    id: "social-media",
    name: "Social Media Graphic",
    description: "Mobile-optimized vertical layout for Stories and Reels",
    promptTemplate: `Create a mobile-optimized infographic for social media on {topic}. Use a vertical layout (9:16 aspect ratio). Break it into 3–5 sections with bold titles and short captions. Include consistent icons, large text, and white space for easy reading on small screens.`,
    useCase: "Instagram Stories, TikTok, Pinterest",
    category: "social",
  },
  {
    id: "cheatsheet",
    name: "Quick Cheatsheet",
    description: "Condensed key takeaways in vertical format",
    promptTemplate: `Turn this content into a cheatsheet with key takeaways, as a 9:16 vertical infographic. Topic: {topic}. Include bullet points, key stats, and memorable tips.`,
    useCase: "Quick reference, summaries, study aids",
    category: "social",
  },
  
  // Scientific & Specialized
  {
    id: "biology-diagram",
    name: "Scientific Diagram",
    description: "Clean labeled diagrams showing cycles and processes",
    promptTemplate: `Generate a detailed scientific diagram of {topic}, showing all stages and connections clearly labeled. Use clean lines, proper scientific notation, and clear visual hierarchy.`,
    useCase: "Biology, chemistry, physics, scientific processes",
    category: "data",
  },
  {
    id: "minimalist-bw",
    name: "Minimalist Sketch",
    description: "Ultra-detailed black & white sketch style",
    promptTemplate: `Create an infographic on {topic}, in a minimalistic (black and white) but ultra-detailed sketch style. Focus on clean lines and elegant typography.`,
    useCase: "Academic papers, research summaries, elegant presentations",
    category: "educational",
  },
  {
    id: "sketch-style",
    name: "Hand-Drawn Style",
    description: "Organic hand-drawn elements with warm tones",
    promptTemplate: `Create an infographic on {topic}. Be as detailed as possible, with a hand-drawn sketch style. Use organic shapes and warm colors. Avoid futuristic style.`,
    useCase: "YouTube summaries, learning content, friendly tutorials",
    category: "educational",
  },
  {
    id: "landmark-map",
    name: "3D Landmark Map",
    description: "3D illustrated map with iconic landmarks and labels",
    promptTemplate: `Make a landmark map of {topic} with 3D landmarks and clear labels. Include perspective view and visual depth.`,
    useCase: "City guides, travel content, location-based info",
    category: "data",
  },
  
  // Custom
  {
    id: "mega-infographic",
    name: "Custom Design",
    description: "Fully customizable aspect ratio, style, colors, and layout",
    promptTemplate: `Design a custom infographic about {topic}. 

## VISUAL STYLE
Use a professional, modern design with clear visual hierarchy.

## COMPOSITION & LAYOUT
- Start with an attention-grabbing headline
- Organize content into logical sections
- Use icons, illustrations, and visual elements to break up text
- Include a clear CTA or conclusion at the bottom
- Maintain consistent spacing and alignment throughout`,
    useCase: "Custom branded content, presentations, marketing",
    category: "custom",
  },
];

export const INFOGRAPHIC_CATEGORIES = [
  { id: "educational", name: "Educational", icon: "📚" },
  { id: "data", name: "Data & Analytics", icon: "📊" },
  { id: "process", name: "Process & Timeline", icon: "🔄" },
  { id: "marketing", name: "Marketing", icon: "🎯" },
  { id: "social", name: "Social Media", icon: "📱" },
  { id: "custom", name: "Custom", icon: "✨" },
];

export const INFOGRAPHIC_ASPECT_RATIOS = [
  { id: "16:9", name: "Landscape (16:9)", description: "Presentations, YouTube thumbnails" },
  { id: "9:16", name: "Portrait (9:16)", description: "Instagram Stories, TikTok" },
  { id: "1:1", name: "Square (1:1)", description: "Social media posts" },
  { id: "4:3", name: "Standard (4:3)", description: "Traditional presentations" },
];