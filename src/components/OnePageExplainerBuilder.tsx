import { useState, useMemo, useCallback } from "react";
import { FileText, Sparkles, Copy, Download, ChevronDown, ChevronUp, Check, Loader2, Eye, Code, Star, Save, Palette, Upload, File, X, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useBrandLibrary, Brand } from "@/hooks/useBrandLibrary";
import { BrandPreviewPanel } from "@/components/BrandPreviewPanel";

interface ExplainerSection {
  id: string;
  heading: string;
  body: string;
  bullets: string[];
}

interface ExplainerResult {
  title: string;
  subtitle: string;
  audience: string;
  use_case: string;
  sections: ExplainerSection[];
  callout_box: {
    title: string;
    body: string;
    bullets: string[];
  };
  cta: {
    heading: string;
    body: string;
    button_text: string;
    suggested_link_anchor: string;
  };
  visual_layout: {
    hero_block: string;
    section_order: string[];
    design_notes: string;
  };
  brand_tokens_used: {
    primary_color: string | null;
    secondary_color: string | null;
    accent_color: string | null;
    font_style: string | null;
    tone_notes: string;
  };
}

const USE_CASES = [
  { value: "internal-strategy", label: "Internal strategy one-pager" },
  { value: "investor", label: "Investor / fundraising one-pager" },
  { value: "clinical-overview", label: "Clinical program overview" },
  { value: "product-explainer", label: "Product / feature explainer" },
  { value: "patient-friendly", label: "Patient-friendly explainer" },
  { value: "research-explainer", label: "Research explainer" },
  { value: "custom", label: "Custom (other)" },
];

const BRAND_STYLES = [
  // Healthcare & Clinical
  { value: "techy-surgeon", label: "Techy Surgeon – editorial, clinical, modern", colors: { primary: "#0B2545", secondary: "#3B82F6", accent: "#F59E0B" }, font: "SF Pro / Inter" },
  { value: "clinical-trust", label: "Clinical Trust – calming, professional healthcare", colors: { primary: "#1E3A5F", secondary: "#4A90A4", accent: "#7BC67E" }, font: "Merriweather / Open Sans" },
  { value: "medical-modern", label: "Medical Modern – bright, approachable care", colors: { primary: "#0077B6", secondary: "#00B4D8", accent: "#90E0EF" }, font: "Nunito / Lato" },
  
  // Tech & SaaS
  { value: "revelai", label: "RevelAi – gradient, health tech SaaS", colors: { primary: "#6366F1", secondary: "#8B5CF6", accent: "#EC4899" }, font: "Plus Jakarta Sans" },
  { value: "minimal-saas", label: "Minimal SaaS – neutral, clean, deck-friendly", colors: { primary: "#1F2937", secondary: "#6B7280", accent: "#10B981" }, font: "Inter / System" },
  { value: "startup-bold", label: "Startup Bold – energetic, venture-ready", colors: { primary: "#7C3AED", secondary: "#A78BFA", accent: "#FBBF24" }, font: "Outfit / DM Sans" },
  { value: "enterprise-pro", label: "Enterprise Pro – corporate, trustworthy", colors: { primary: "#1E40AF", secondary: "#3B82F6", accent: "#F97316" }, font: "IBM Plex Sans" },
  
  // Finance & Consulting
  { value: "finance-classic", label: "Finance Classic – navy, gold, prestigious", colors: { primary: "#1A2744", secondary: "#334155", accent: "#D4AF37" }, font: "Playfair Display / Roboto" },
  { value: "consulting-elite", label: "Consulting Elite – BCG/McKinsey style", colors: { primary: "#0F172A", secondary: "#475569", accent: "#22C55E" }, font: "Georgia / Helvetica Neue" },
  
  // Creative & Marketing
  { value: "creative-agency", label: "Creative Agency – bold, artistic, standout", colors: { primary: "#18181B", secondary: "#EC4899", accent: "#8B5CF6" }, font: "Space Grotesk / Manrope" },
  { value: "lifestyle-brand", label: "Lifestyle Brand – warm, inviting, human", colors: { primary: "#78350F", secondary: "#D97706", accent: "#FDE68A" }, font: "Libre Baskerville / Source Sans" },
  { value: "eco-friendly", label: "Eco Friendly – sustainable, natural, green", colors: { primary: "#14532D", secondary: "#22C55E", accent: "#A7F3D0" }, font: "Poppins / Quicksand" },
  
  // Education & Research
  { value: "academic", label: "Academic – scholarly, authoritative, classic", colors: { primary: "#7C2D12", secondary: "#B45309", accent: "#1E3A8A" }, font: "Crimson Text / Lora" },
  { value: "edtech-fresh", label: "EdTech Fresh – modern learning, engaging", colors: { primary: "#4338CA", secondary: "#6366F1", accent: "#06B6D4" }, font: "Lexend / Inter" },
  { value: "academic-journal", label: "Academic Journal – peer-review formal, citation-ready", colors: { primary: "#1F2937", secondary: "#4B5563", accent: "#0369A1" }, font: "Times New Roman / Helvetica" },
  { value: "research-poster", label: "Research Poster – conference-ready, visual hierarchy", colors: { primary: "#1E3A8A", secondary: "#3B82F6", accent: "#F59E0B" }, font: "Arial / Calibri" },
  { value: "grant-proposal", label: "Grant Proposal – NIH/NSF style, structured, formal", colors: { primary: "#0F172A", secondary: "#334155", accent: "#059669" }, font: "Arial / Times New Roman" },
  { value: "scientific-modern", label: "Scientific Modern – Nature/Science style, clean data", colors: { primary: "#18181B", secondary: "#52525B", accent: "#2563EB" }, font: "Helvetica Neue / Georgia" },
  { value: "clinical-research", label: "Clinical Research – IRB-friendly, patient-focused", colors: { primary: "#0C4A6E", secondary: "#0284C7", accent: "#16A34A" }, font: "Calibri / Open Sans" },
  
  // Government & Non-profit
  { value: "gov-official", label: "Government Official – formal, accessible", colors: { primary: "#1E3A5F", secondary: "#4B5563", accent: "#DC2626" }, font: "Source Serif Pro / Public Sans" },
  { value: "nonprofit", label: "Non-Profit Impact – warm, mission-driven", colors: { primary: "#7C3AED", secondary: "#A855F7", accent: "#F59E0B" }, font: "Nunito Sans / Open Sans" },
  
  // Dark themes
  { value: "dark-executive", label: "Dark Executive – sleek, premium, noir", colors: { primary: "#18181B", secondary: "#27272A", accent: "#FAFAFA" }, font: "SF Pro Display / Inter" },
  { value: "midnight-tech", label: "Midnight Tech – dark mode, developer-friendly", colors: { primary: "#0F172A", secondary: "#1E293B", accent: "#38BDF8" }, font: "JetBrains Mono / Inter" },
  
  { value: "custom", label: "Custom" },
];

const TONES = [
  { value: "executive", label: "Concise & executive" },
  { value: "clinical", label: "Clinical / academic" },
  { value: "accessible", label: "Warm & accessible" },
  { value: "marketing", label: "Marketing-forward" },
];

export function OnePageExplainerBuilder() {
  // Brand library
  const { brands: savedBrands, saveBrand, isLoading: brandsLoading } = useBrandLibrary();
  
  // Form state
  const [sourceContent, setSourceContent] = useState("");
  const [references, setReferences] = useState("");
  const [audience, setAudience] = useState("");
  const [useCase, setUseCase] = useState("");
  const [desiredAction, setDesiredAction] = useState("");
  const [brandStyle, setBrandStyle] = useState("");
  const [selectedSavedBrandId, setSelectedSavedBrandId] = useState<string | null>(null);
  const [customBrandTokens, setCustomBrandTokens] = useState("");
  const [tone, setTone] = useState("");
  
  // Save brand dialog state
  const [saveBrandDialogOpen, setSaveBrandDialogOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandDescription, setNewBrandDescription] = useState("");
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ExplainerResult | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    source: true,
    audience: false,
    brand: false,
  });
  const [viewMode, setViewMode] = useState<"preview" | "json">("preview");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Compute current brand preview colors
  const currentBrandPreview = useMemo(() => {
    if (selectedSavedBrandId) {
      const savedBrand = savedBrands.find(b => b.id === selectedSavedBrandId);
      if (savedBrand?.colors && savedBrand.colors.length >= 3) {
        return {
          colors: {
            primary: savedBrand.colors[0],
            secondary: savedBrand.colors[1],
            accent: savedBrand.colors[2],
          },
          font: savedBrand.fonts || undefined,
          name: savedBrand.name,
        };
      }
    }
    
    if (brandStyle && brandStyle !== "custom") {
      const preset = BRAND_STYLES.find(b => b.value === brandStyle);
      if (preset?.colors) {
        return {
          colors: preset.colors,
          font: preset.font,
          name: preset.label.split(" – ")[0],
        };
      }
    }
    
    // Parse custom brand tokens for colors
    if (brandStyle === "custom" && customBrandTokens) {
      const colorMatches = customBrandTokens.match(/#[0-9A-Fa-f]{6}/g);
      if (colorMatches && colorMatches.length >= 3) {
        return {
          colors: {
            primary: colorMatches[0],
            secondary: colorMatches[1],
            accent: colorMatches[2],
          },
          font: undefined,
          name: "Custom Brand",
        };
      }
    }
    
    return null;
  }, [selectedSavedBrandId, savedBrands, brandStyle, customBrandTokens]);

  // Handle colors extracted from uploaded image
  const handleColorsExtracted = (colors: string[], font?: string) => {
    if (colors.length > 0) {
      const tokenParts = [`Primary: ${colors[0]}`];
      if (colors[1]) tokenParts.push(`Secondary: ${colors[1]}`);
      if (colors[2]) tokenParts.push(`Accent: ${colors[2]}`);
      if (font) tokenParts.push(`Font: ${font}`);
      
      setCustomBrandTokens(tokenParts.join(", "));
      setBrandStyle("custom");
      setSelectedSavedBrandId(null);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // File upload handlers
  const handleFileUpload = useCallback(async (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown',
    ];
    
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.md'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      toast.error("Please upload a PDF, Word document, or text file");
      return;
    }
    
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File must be under 20MB");
      return;
    }
    
    setUploadedFile(file);
    setIsParsingFile(true);
    
    try {
      // For text files, read directly
      if (file.type === 'text/plain' || file.type === 'text/markdown' || fileExtension === '.txt' || fileExtension === '.md') {
        const text = await file.text();
        setSourceContent(prev => prev ? prev + "\n\n--- Uploaded from " + file.name + " ---\n\n" + text : text);
        toast.success(`Loaded content from ${file.name}`);
      } else {
        // For PDF/Word, we need to use the backend to parse
        const formData = new FormData();
        formData.append('file', file);
        
        // Convert file to base64 for the edge function
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = (reader.result as string).split(',')[1];
          
          try {
            const { data, error } = await supabase.functions.invoke("parse-document", {
              body: {
                fileBase64: base64,
                fileName: file.name,
                fileType: file.type || fileExtension,
              },
            });
            
            if (error) throw error;
            
            if (data?.text) {
              setSourceContent(prev => prev ? prev + "\n\n--- Uploaded from " + file.name + " ---\n\n" + data.text : data.text);
              toast.success(`Extracted ${data.text.length.toLocaleString()} characters from ${file.name}`);
            } else {
              throw new Error("No text extracted from document");
            }
          } catch (err) {
            console.error("Error parsing document:", err);
            toast.error("Failed to parse document. Try pasting the content directly.");
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Error reading file:", error);
      toast.error("Failed to read file");
    } finally {
      setIsParsingFile(false);
    }
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const clearUploadedFile = () => {
    setUploadedFile(null);
  };

  const handleSelectBrand = (value: string) => {
    if (value.startsWith("saved-")) {
      const brandId = value.replace("saved-", "");
      setSelectedSavedBrandId(brandId);
      setBrandStyle("");
    } else {
      setSelectedSavedBrandId(null);
      setBrandStyle(value);
    }
  };

  const getSelectedBrandValue = () => {
    if (selectedSavedBrandId) return `saved-${selectedSavedBrandId}`;
    return brandStyle;
  };

  const handleSaveBrand = async () => {
    if (!newBrandName.trim()) {
      toast.error("Please enter a brand name");
      return;
    }
    
    // Parse custom tokens to extract colors
    const colors: string[] = [];
    const colorMatches = customBrandTokens.match(/#[0-9A-Fa-f]{6}/g);
    if (colorMatches) {
      colors.push(...colorMatches);
    }
    
    // Extract font info
    const fontMatch = customBrandTokens.match(/Font[:\s]+([^,\n]+)/i);
    const fonts = fontMatch ? fontMatch[1].trim() : "";
    
    await saveBrand({
      name: newBrandName,
      description: newBrandDescription || customBrandTokens,
      colors,
      fonts,
    });
    
    toast.success(`Brand "${newBrandName}" saved to library`);
    setSaveBrandDialogOpen(false);
    setNewBrandName("");
    setNewBrandDescription("");
  };

  const handleGenerate = async () => {
    if (!sourceContent.trim()) {
      toast.error("Please provide source content to generate the explainer");
      return;
    }

    if (!audience.trim()) {
      toast.error("Please specify your target audience");
      return;
    }

    setIsGenerating(true);

    try {
      let brandTokens = "";
      let brandStyleLabel = "";
      
      if (selectedSavedBrandId) {
        const savedBrand = savedBrands.find(b => b.id === selectedSavedBrandId);
        if (savedBrand) {
          brandStyleLabel = savedBrand.name;
          const colorStr = savedBrand.colors?.length 
            ? `Colors: ${savedBrand.colors.join(", ")}` 
            : "";
          const fontStr = savedBrand.fonts ? `Font: ${savedBrand.fonts}` : "";
          const descStr = savedBrand.description ? `Style: ${savedBrand.description}` : "";
          brandTokens = [colorStr, fontStr, descStr].filter(Boolean).join(". ");
        }
      } else if (brandStyle === "custom") {
        brandTokens = customBrandTokens;
        brandStyleLabel = "Custom";
      } else {
        const selectedBrand = BRAND_STYLES.find(b => b.value === brandStyle);
        if (selectedBrand?.colors) {
          brandStyleLabel = selectedBrand.label;
          brandTokens = `Primary: ${selectedBrand.colors.primary}, Secondary: ${selectedBrand.colors.secondary}, Accent: ${selectedBrand.colors.accent}${selectedBrand.font ? `, Font: ${selectedBrand.font}` : ""}`;
        }
      }

      const { data, error } = await supabase.functions.invoke("generate-explainer", {
        body: {
          sourceContent,
          references,
          audience,
          useCase: USE_CASES.find(u => u.value === useCase)?.label || useCase,
          desiredAction,
          brandStyle: brandStyleLabel || "None specified",
          brandTokens,
          tone: TONES.find(t => t.value === tone)?.label || tone,
        },
      });

      if (error) throw error;

      setResult(data.explainer);
      toast.success("1-Page Explainer generated!");
    } catch (error) {
      console.error("Error generating explainer:", error);
      toast.error("Failed to generate explainer. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const downloadAsMarkdown = () => {
    if (!result) return;

    let markdown = `# ${result.title}\n\n`;
    markdown += `*${result.subtitle}*\n\n`;
    markdown += `**Audience:** ${result.audience}\n\n`;
    markdown += `---\n\n`;

    result.sections.forEach(section => {
      markdown += `## ${section.heading}\n\n`;
      markdown += `${section.body}\n\n`;
      if (section.bullets.length > 0) {
        section.bullets.forEach(bullet => {
          markdown += `- ${bullet}\n`;
        });
        markdown += `\n`;
      }
    });

    if (result.callout_box.title) {
      markdown += `> ### ${result.callout_box.title}\n`;
      markdown += `> ${result.callout_box.body}\n`;
      result.callout_box.bullets.forEach(bullet => {
        markdown += `> - ${bullet}\n`;
      });
      markdown += `\n`;
    }

    markdown += `---\n\n`;
    markdown += `## ${result.cta.heading}\n\n`;
    markdown += `${result.cta.body}\n\n`;
    markdown += `**[${result.cta.button_text}](${result.cta.suggested_link_anchor})**\n`;

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.title.toLowerCase().replace(/\s+/g, "-")}-explainer.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded as Markdown");
  };

  const downloadAsHTML = () => {
    if (!result) return;

    // Get colors from saved brand, preset, result's brand_tokens_used, or defaults
    let colors = { primary: "#1a365d", secondary: "#3B82F6", accent: "#F59E0B" };
    let fontFamily = "'Segoe UI', system-ui, sans-serif";
    
    // Priority 1: Check saved brand from library
    if (selectedSavedBrandId) {
      const savedBrand = savedBrands.find(b => b.id === selectedSavedBrandId);
      if (savedBrand?.colors && savedBrand.colors.length >= 3) {
        colors = {
          primary: savedBrand.colors[0],
          secondary: savedBrand.colors[1],
          accent: savedBrand.colors[2],
        };
        if (savedBrand.fonts) fontFamily = savedBrand.fonts;
      }
    }
    // Priority 2: Check preset brand style
    else if (brandStyle && brandStyle !== "custom") {
      const selectedBrand = BRAND_STYLES.find(b => b.value === brandStyle);
      if (selectedBrand?.colors) {
        colors = selectedBrand.colors;
        if (selectedBrand.font) fontFamily = selectedBrand.font;
      }
    }
    // Priority 3: Check AI-generated brand_tokens_used from result
    else if (result.brand_tokens_used) {
      if (result.brand_tokens_used.primary_color) colors.primary = result.brand_tokens_used.primary_color;
      if (result.brand_tokens_used.secondary_color) colors.secondary = result.brand_tokens_used.secondary_color;
      if (result.brand_tokens_used.accent_color) colors.accent = result.brand_tokens_used.accent_color;
      if (result.brand_tokens_used.font_style) fontFamily = result.brand_tokens_used.font_style;
    }
    // Priority 4: Parse custom brand tokens
    else if (brandStyle === "custom" && customBrandTokens) {
      const colorMatches = customBrandTokens.match(/#[0-9A-Fa-f]{6}/g);
      if (colorMatches && colorMatches.length >= 3) {
        colors = {
          primary: colorMatches[0],
          secondary: colorMatches[1],
          accent: colorMatches[2],
        };
      }
      const fontMatch = customBrandTokens.match(/Font[:\s]+([^,\n]+)/i);
      if (fontMatch) fontFamily = fontMatch[1].trim();
    }
    
    const primaryFont = fontFamily.split('/')[0].trim();
    const googleFontName = primaryFont.replace(/'/g, '').trim();
    const googleFontUrl = `https://fonts.googleapis.com/css2?family=${googleFontName.replace(/\s+/g, '+')}:wght@400;600;700&display=swap`;

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${result.title}</title>
    <link rel="stylesheet" href="${googleFontUrl}">
    <style>
        :root {
            --primary: ${colors.primary};
            --secondary: ${colors.secondary};
            --accent: ${colors.accent};
            --font-family: ${fontFamily};
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: var(--font-family); font-size: 11pt; line-height: 1.5; color: #1f2937; background: #fff; }
        .page { max-width: 8.5in; margin: 0 auto; padding: 0.5in; }
        .header { background: var(--primary); color: white; padding: 1.5rem 2rem; margin: -0.5in -0.5in 1.5rem; }
        .header h1 { font-size: 1.75rem; margin-bottom: 0.25rem; font-weight: 700; }
        .header .tagline { color: rgba(255,255,255,0.85); font-size: 0.95rem; }
        .section { margin-bottom: 1.25rem; }
        .section h2 { font-size: 1rem; font-weight: 600; color: var(--primary); border-bottom: 2px solid var(--accent); padding-bottom: 0.25rem; margin-bottom: 0.5rem; }
        .section p { margin-bottom: 0.5rem; }
        .section ul { margin-left: 1.25rem; }
        .section li { margin-bottom: 0.25rem; }
        .callout { background: #f8fafc; border-left: 4px solid var(--accent); padding: 1rem; margin: 1rem 0; }
        .callout h3 { font-size: 0.95rem; color: var(--primary); margin-bottom: 0.5rem; }
        .cta { background: #f1f5f9; border-top: 3px solid var(--primary); padding: 1rem 1.5rem; margin-top: 1.5rem; }
        .cta h3 { color: var(--primary); margin-bottom: 0.25rem; }
        .cta-button { display: inline-block; background: var(--accent); color: white; padding: 0.5rem 1.5rem; border-radius: 4px; text-decoration: none; font-weight: 600; margin-top: 0.5rem; }
        @media print { .page { max-width: none; padding: 0; } }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <h1>${result.title}</h1>
            <p class="tagline">${result.subtitle}</p>
        </div>
        
        ${result.sections.map(section => `
        <div class="section">
            <h2>${section.heading}</h2>
            <p>${section.body}</p>
            ${section.bullets.length > 0 ? `<ul>${section.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
        </div>
        `).join('')}
        
        ${result.callout_box.title ? `
        <div class="callout">
            <h3>${result.callout_box.title}</h3>
            <p>${result.callout_box.body}</p>
            ${result.callout_box.bullets.length > 0 ? `<ul>${result.callout_box.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
        </div>
        ` : ''}
        
        <div class="cta">
            <h3>${result.cta.heading}</h3>
            <p>${result.cta.body}</p>
            <a href="${result.cta.suggested_link_anchor}" class="cta-button">${result.cta.button_text}</a>
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.title.toLowerCase().replace(/\s+/g, "-")}-explainer.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded as HTML");
  };

  const downloadAsPDF = () => {
    if (!result) return;

    // Get colors from saved brand, preset, result's brand_tokens_used, or defaults
    let colors = { primary: "#1a365d", secondary: "#3B82F6", accent: "#F59E0B" };
    let fontFamily = "'Segoe UI', system-ui, sans-serif";
    
    if (selectedSavedBrandId) {
      const savedBrand = savedBrands.find(b => b.id === selectedSavedBrandId);
      if (savedBrand?.colors && savedBrand.colors.length >= 3) {
        colors = {
          primary: savedBrand.colors[0],
          secondary: savedBrand.colors[1],
          accent: savedBrand.colors[2],
        };
        if (savedBrand.fonts) fontFamily = savedBrand.fonts;
      }
    } else if (brandStyle && brandStyle !== "custom") {
      const selectedBrand = BRAND_STYLES.find(b => b.value === brandStyle);
      if (selectedBrand?.colors) {
        colors = selectedBrand.colors;
        if (selectedBrand.font) fontFamily = selectedBrand.font;
      }
    } else if (result.brand_tokens_used) {
      if (result.brand_tokens_used.primary_color) colors.primary = result.brand_tokens_used.primary_color;
      if (result.brand_tokens_used.secondary_color) colors.secondary = result.brand_tokens_used.secondary_color;
      if (result.brand_tokens_used.accent_color) colors.accent = result.brand_tokens_used.accent_color;
      if (result.brand_tokens_used.font_style) fontFamily = result.brand_tokens_used.font_style;
    }

    const primaryFont = fontFamily.split('/')[0].trim();
    const googleFontName = primaryFont.replace(/'/g, '').trim();
    const googleFontUrl = `https://fonts.googleapis.com/css2?family=${googleFontName.replace(/\s+/g, '+')}:wght@400;600;700&display=swap`;

    // Create a print-optimized HTML document
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Please allow pop-ups to download PDF");
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${result.title}</title>
    <link rel="stylesheet" href="${googleFontUrl}">
    <style>
        @page { size: letter; margin: 0.5in; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: ${fontFamily}; font-size: 10pt; line-height: 1.4; color: #1f2937; background: #fff; }
        .page { max-width: 100%; }
        .header { background: ${colors.primary}; color: white; padding: 1rem 1.5rem; margin-bottom: 1rem; }
        .header h1 { font-size: 1.5rem; margin-bottom: 0.15rem; font-weight: 700; }
        .header .tagline { color: rgba(255,255,255,0.85); font-size: 0.85rem; }
        .section { margin-bottom: 0.75rem; }
        .section h2 { font-size: 0.9rem; font-weight: 600; color: ${colors.primary}; border-bottom: 2px solid ${colors.accent}; padding-bottom: 0.15rem; margin-bottom: 0.35rem; }
        .section p { margin-bottom: 0.35rem; font-size: 0.85rem; }
        .section ul { margin-left: 1rem; font-size: 0.85rem; }
        .section li { margin-bottom: 0.15rem; }
        .callout { background: #f8fafc; border-left: 3px solid ${colors.accent}; padding: 0.75rem; margin: 0.75rem 0; }
        .callout h3 { font-size: 0.85rem; color: ${colors.primary}; margin-bottom: 0.25rem; }
        .callout p, .callout li { font-size: 0.8rem; }
        .cta { background: #f1f5f9; border-top: 2px solid ${colors.primary}; padding: 0.75rem 1rem; margin-top: 1rem; }
        .cta h3 { color: ${colors.primary}; margin-bottom: 0.15rem; font-size: 0.9rem; }
        .cta p { font-size: 0.8rem; }
        .cta-button { display: inline-block; background: ${colors.accent}; color: white; padding: 0.35rem 1rem; border-radius: 3px; text-decoration: none; font-weight: 600; margin-top: 0.35rem; font-size: 0.8rem; }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <h1>${result.title}</h1>
            <p class="tagline">${result.subtitle}</p>
        </div>
        
        ${result.sections.map(section => `
        <div class="section">
            <h2>${section.heading}</h2>
            <p>${section.body}</p>
            ${section.bullets.length > 0 ? `<ul>${section.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
        </div>
        `).join('')}
        
        ${result.callout_box.title ? `
        <div class="callout">
            <h3>${result.callout_box.title}</h3>
            <p>${result.callout_box.body}</p>
            ${result.callout_box.bullets.length > 0 ? `<ul>${result.callout_box.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
        </div>
        ` : ''}
        
        <div class="cta">
            <h3>${result.cta.heading}</h3>
            <p>${result.cta.body}</p>
            <a href="${result.cta.suggested_link_anchor}" class="cta-button">${result.cta.button_text}</a>
        </div>
    </div>
    <script>
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 500);
        };
    </script>
</body>
</html>`);
    printWindow.document.close();
    toast.success("Print dialog opened - save as PDF");
  };

  const getPlainText = () => {
    if (!result) return "";
    
    let text = `${result.title}\n${result.subtitle}\n\n`;
    text += `Audience: ${result.audience}\n\n`;
    
    result.sections.forEach(section => {
      text += `${section.heading}\n`;
      text += `${section.body}\n`;
      section.bullets.forEach(bullet => {
        text += `• ${bullet}\n`;
      });
      text += `\n`;
    });

    if (result.callout_box.title) {
      text += `[${result.callout_box.title}]\n`;
      text += `${result.callout_box.body}\n`;
      result.callout_box.bullets.forEach(bullet => {
        text += `• ${bullet}\n`;
      });
      text += `\n`;
    }

    text += `${result.cta.heading}\n`;
    text += `${result.cta.body}\n`;
    text += `→ ${result.cta.button_text}`;
    
    return text;
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">1-Page Explainer</h2>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Give us the long version—Techy Memo turns it into a sharp, branded one-pager your audience can actually read.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
            Investor One-Pagers
          </span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Internal Strategy
          </span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Clinical Overviews
          </span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            Patient Summaries
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="space-y-4">
          {/* Step 1: Source Material */}
          <Collapsible open={expandedSections.source} onOpenChange={() => toggleSection("source")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">1</span>
                      Source Material
                    </span>
                    {expandedSections.source ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-0">
                  {/* File Upload Zone */}
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer",
                      isDraggingFile
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/30"
                    )}
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                    onDragLeave={() => setIsDraggingFile(false)}
                    onDrop={handleFileDrop}
                    onClick={() => document.getElementById('file-upload-input')?.click()}
                  >
                    <input
                      id="file-upload-input"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.md"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    {isParsingFile ? (
                      <div className="flex items-center justify-center gap-2 py-2">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Extracting text...</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-center">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <Upload className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          Drop a PDF or Word doc here
                        </p>
                        <p className="text-xs text-muted-foreground">
                          or click to browse • PDF, DOCX, DOC, TXT supported
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Show uploaded file */}
                  {uploadedFile && (
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                      <File className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground flex-1 truncate">{uploadedFile.name}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); clearUploadedFile(); }}
                        className="p-1 hover:bg-muted rounded"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  )}

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-card px-2 text-muted-foreground">or paste directly</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="source">Paste your document, notes, or transcript</Label>
                    <Textarea
                      id="source"
                      placeholder="Paste up to ~10,000 characters. This can be a paper, meeting notes, voice memo transcript, or rough draft."
                      value={sourceContent}
                      onChange={(e) => setSourceContent(e.target.value)}
                      className="min-h-[180px] resize-y"
                    />
                    <p className="text-xs text-muted-foreground">{sourceContent.length.toLocaleString()} characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="references">Key links or references (optional)</Label>
                    <Textarea
                      id="references"
                      placeholder="Add links, citations, or references you want preserved."
                      value={references}
                      onChange={(e) => setReferences(e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Step 2: Audience & Purpose */}
          <Collapsible open={expandedSections.audience} onOpenChange={() => toggleSection("audience")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">2</span>
                      Audience & Purpose
                    </span>
                    {expandedSections.audience ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-0">
                  <div className="space-y-2">
                    <Label htmlFor="audience">Primary audience</Label>
                    <Input
                      id="audience"
                      placeholder="e.g., hospital CFO, seed investor, orthopedic surgeons, parents of toddlers"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="useCase">Use case</Label>
                    <Select value={useCase} onValueChange={setUseCase}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select use case" />
                      </SelectTrigger>
                      <SelectContent>
                        {USE_CASES.map((uc) => (
                          <SelectItem key={uc.value} value={uc.value}>
                            {uc.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="action">What do you want them to do after reading?</Label>
                    <Input
                      id="action"
                      placeholder="Schedule a call, approve pilot, sign LOI, share with team, etc."
                      value={desiredAction}
                      onChange={(e) => setDesiredAction(e.target.value)}
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Step 3: Brand & Tone */}
          <Collapsible open={expandedSections.brand} onOpenChange={() => toggleSection("brand")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">3</span>
                      Brand & Tone
                    </span>
                    {expandedSections.brand ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-0">
                  <div className="space-y-2">
                    <Label>Brand style</Label>
                    <Select value={getSelectedBrandValue()} onValueChange={handleSelectBrand}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand style" />
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        {savedBrands.length > 0 && (
                          <SelectGroup>
                            <SelectLabel className="text-xs text-muted-foreground flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Your Saved Brands
                            </SelectLabel>
                            {savedBrands.map(brand => (
                              <SelectItem key={brand.id} value={`saved-${brand.id}`}>
                                <span className="flex items-center gap-2">
                                  {brand.colors && brand.colors.length > 0 && (
                                    <span className="flex gap-0.5">
                                      {brand.colors.slice(0, 3).map((color, i) => (
                                        <span
                                          key={i}
                                          className="w-3 h-3 rounded-full border border-border"
                                          style={{ backgroundColor: color }}
                                        />
                                      ))}
                                    </span>
                                  )}
                                  {brand.name}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        )}
                        <SelectGroup>
                          <SelectLabel className="text-xs font-semibold text-primary/70 uppercase tracking-wide py-2">Healthcare & Clinical</SelectLabel>
                          {BRAND_STYLES.filter(s => ["techy-surgeon", "clinical-trust", "medical-modern"].includes(s.value)).map(style => (
                            <SelectItem key={style.value} value={style.value}>
                              <span className="flex items-center gap-2">
                                {style.colors && (
                                  <span className="flex gap-0.5">
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.primary }} />
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.secondary }} />
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.accent }} />
                                  </span>
                                )}
                                <span className="truncate">{style.label.split(" – ")[0]} – <span className="text-muted-foreground">{style.label.split(" – ")[1]}</span></span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel className="text-xs font-semibold text-primary/70 uppercase tracking-wide py-2">Tech & SaaS</SelectLabel>
                          {BRAND_STYLES.filter(s => ["revelai", "minimal-saas", "startup-bold", "enterprise-pro"].includes(s.value)).map(style => (
                            <SelectItem key={style.value} value={style.value}>
                              <span className="flex items-center gap-2">
                                {style.colors && (
                                  <span className="flex gap-0.5">
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.primary }} />
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.secondary }} />
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.accent }} />
                                  </span>
                                )}
                                <span className="truncate">{style.label.split(" – ")[0]} – <span className="text-muted-foreground">{style.label.split(" – ")[1]}</span></span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel className="text-xs font-semibold text-primary/70 uppercase tracking-wide py-2">Finance & Consulting</SelectLabel>
                          {BRAND_STYLES.filter(s => ["finance-classic", "consulting-elite"].includes(s.value)).map(style => (
                            <SelectItem key={style.value} value={style.value}>
                              <span className="flex items-center gap-2">
                                {style.colors && (
                                  <span className="flex gap-0.5">
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.primary }} />
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.secondary }} />
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.accent }} />
                                  </span>
                                )}
                                <span className="truncate">{style.label.split(" – ")[0]} – <span className="text-muted-foreground">{style.label.split(" – ")[1]}</span></span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel className="text-xs font-semibold text-primary/70 uppercase tracking-wide py-2">Creative & Marketing</SelectLabel>
                          {BRAND_STYLES.filter(s => ["creative-agency", "lifestyle-brand", "eco-friendly"].includes(s.value)).map(style => (
                            <SelectItem key={style.value} value={style.value}>
                              <span className="flex items-center gap-2">
                                {style.colors && (
                                  <span className="flex gap-0.5">
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.primary }} />
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.secondary }} />
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.accent }} />
                                  </span>
                                )}
                                <span className="truncate">{style.label.split(" – ")[0]} – <span className="text-muted-foreground">{style.label.split(" – ")[1]}</span></span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel className="text-xs font-semibold text-primary/70 uppercase tracking-wide py-2">Education & Research</SelectLabel>
                          {BRAND_STYLES.filter(s => ["academic", "edtech-fresh", "academic-journal", "research-poster", "grant-proposal", "scientific-modern", "clinical-research"].includes(s.value)).map(style => (
                            <SelectItem key={style.value} value={style.value}>
                              <span className="flex items-center gap-2">
                                {style.colors && (
                                  <span className="flex gap-0.5">
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.primary }} />
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.secondary }} />
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.accent }} />
                                  </span>
                                )}
                                <span className="truncate">{style.label.split(" – ")[0]} – <span className="text-muted-foreground">{style.label.split(" – ")[1]}</span></span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel className="text-xs font-semibold text-primary/70 uppercase tracking-wide py-2">Government & Non-profit</SelectLabel>
                          {BRAND_STYLES.filter(s => ["gov-official", "nonprofit"].includes(s.value)).map(style => (
                            <SelectItem key={style.value} value={style.value}>
                              <span className="flex items-center gap-2">
                                {style.colors && (
                                  <span className="flex gap-0.5">
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.primary }} />
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.secondary }} />
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.accent }} />
                                  </span>
                                )}
                                <span className="truncate">{style.label.split(" – ")[0]} – <span className="text-muted-foreground">{style.label.split(" – ")[1]}</span></span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel className="text-xs font-semibold text-primary/70 uppercase tracking-wide py-2">Dark Themes</SelectLabel>
                          {BRAND_STYLES.filter(s => ["dark-executive", "midnight-tech"].includes(s.value)).map(style => (
                            <SelectItem key={style.value} value={style.value}>
                              <span className="flex items-center gap-2">
                                {style.colors && (
                                  <span className="flex gap-0.5">
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.primary }} />
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.secondary }} />
                                    <span className="w-3 h-3 rounded-full border border-border/50" style={{ backgroundColor: style.colors.accent }} />
                                  </span>
                                )}
                                <span className="truncate">{style.label.split(" – ")[0]} – <span className="text-muted-foreground">{style.label.split(" – ")[1]}</span></span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel className="text-xs font-semibold text-primary/70 uppercase tracking-wide py-2">Custom</SelectLabel>
                          <SelectItem value="custom">
                            <span className="flex items-center gap-2">
                              <Palette className="w-4 h-4 text-muted-foreground" />
                              <span>Custom – <span className="text-muted-foreground">define your own</span></span>
                            </span>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  {brandStyle === "custom" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="customBrand">Brand tokens</Label>
                        <Dialog open={saveBrandDialogOpen} onOpenChange={setSaveBrandDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs"
                              disabled={!customBrandTokens.trim()}
                            >
                              <Save className="w-3 h-3 mr-1" />
                              Save as Brand
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Save as New Brand</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="brandName">Brand Name</Label>
                                <Input
                                  id="brandName"
                                  placeholder="e.g., My Company Brand"
                                  value={newBrandName}
                                  onChange={(e) => setNewBrandName(e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="brandDesc">Description (optional)</Label>
                                <Textarea
                                  id="brandDesc"
                                  placeholder="Brief description of this brand style"
                                  value={newBrandDescription}
                                  onChange={(e) => setNewBrandDescription(e.target.value)}
                                  className="min-h-[60px]"
                                />
                              </div>
                              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                                <p className="font-medium mb-1">Tokens to save:</p>
                                <p className="truncate">{customBrandTokens}</p>
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button onClick={handleSaveBrand}>
                                <Save className="w-4 h-4 mr-2" />
                                Save Brand
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <Textarea
                        id="customBrand"
                        placeholder="Primary color: #0B2545 Secondary: #3B82F6 Accent: #F59E0B Font vibe: clinical editorial / SF Pro"
                        value={customBrandTokens}
                        onChange={(e) => setCustomBrandTokens(e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  )}
                  
                  {/* Brand Preview Panel */}
                  <BrandPreviewPanel
                    colors={currentBrandPreview?.colors || null}
                    font={currentBrandPreview?.font}
                    brandName={currentBrandPreview?.name}
                    onColorsExtracted={handleColorsExtracted}
                  />
                  
                  <div className="space-y-2">
                    <Label>Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {TONES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !sourceContent.trim() || !audience.trim()}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate 1-Page Explainer
              </>
            )}
          </Button>
        </div>

        {/* Preview/Results */}
        <div className="space-y-4">
          <Card className="min-h-[500px]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Generated Explainer
                </CardTitle>
                {result && (
                  <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "preview" | "json")}>
                    <TabsList className="h-8">
                      <TabsTrigger value="preview" className="text-xs px-2">
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </TabsTrigger>
                      <TabsTrigger value="json" className="text-xs px-2">
                        <Code className="w-3 h-3 mr-1" />
                        JSON
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm">Your generated explainer will appear here</p>
                  <p className="text-xs mt-1">Fill in the form and click Generate</p>
                </div>
              ) : viewMode === "preview" ? (
                <div className="space-y-4 text-sm">
                  {/* Title Block */}
                  <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                    <h3 className="text-lg font-bold text-foreground">{result.title}</h3>
                    <p className="text-muted-foreground mt-1">{result.subtitle}</p>
                    <p className="text-xs text-muted-foreground mt-2">Audience: {result.audience}</p>
                  </div>

                  {/* Sections */}
                  {result.sections.map((section) => (
                    <div key={section.id} className="space-y-1">
                      <h4 className="font-semibold text-foreground border-b border-border pb-1">{section.heading}</h4>
                      <p className="text-muted-foreground">{section.body}</p>
                      {section.bullets.length > 0 && (
                        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground ml-2">
                          {section.bullets.map((bullet, i) => (
                            <li key={i}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                  {/* Callout */}
                  {result.callout_box.title && (
                    <div className="bg-accent/10 border-l-4 border-accent p-3 rounded-r-lg">
                      <h5 className="font-semibold text-foreground">{result.callout_box.title}</h5>
                      <p className="text-muted-foreground text-xs mt-1">{result.callout_box.body}</p>
                      {result.callout_box.bullets.length > 0 && (
                        <ul className="list-disc list-inside text-xs text-muted-foreground mt-1">
                          {result.callout_box.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="bg-muted/50 p-4 rounded-lg border-t-2 border-primary">
                    <h5 className="font-semibold text-foreground">{result.cta.heading}</h5>
                    <p className="text-muted-foreground text-sm mt-1">{result.cta.body}</p>
                    <div className="mt-2">
                      <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-medium">
                        {result.cta.button_text}
                      </span>
                    </div>
                  </div>

                  {/* Design Notes */}
                  {result.visual_layout.design_notes && (
                    <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                      <strong>Layout hints:</strong> {result.visual_layout.design_notes}
                    </div>
                  )}
                </div>
              ) : (
                <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-auto max-h-[450px]">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>

          {/* Export Actions */}
          {result && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(getPlainText(), "text")}
                className="flex-1 min-w-0"
              >
                {copiedField === "text" ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                Copy Text
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(JSON.stringify(result, null, 2), "json")}
                className="flex-1 min-w-0"
              >
                {copiedField === "json" ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                Copy JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadAsMarkdown}
                className="flex-1 min-w-0"
              >
                <Download className="w-3 h-3 mr-1" />
                Markdown
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadAsHTML}
                className="flex-1 min-w-0"
              >
                <Download className="w-3 h-3 mr-1" />
                HTML
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={downloadAsPDF}
                className="flex-1 min-w-0"
              >
                <FileDown className="w-3 h-3 mr-1" />
                Save as PDF
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
