import { useState, useMemo, useCallback } from "react";
import { FileText, Sparkles, Copy, Download, ChevronDown, ChevronUp, Check, Loader2, Eye, Code, Star, Save, Palette, Upload, File, X, FileDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  { value: "techy-surgeon", label: "Techy Surgeon – editorial, clinical, modern", colors: { primary: "#0B2545", secondary: "#3B82F6", accent: "#F59E0B" }, font: "SF Pro / Inter" },
  { value: "clinical-trust", label: "Clinical Trust – calming, professional healthcare", colors: { primary: "#1E3A5F", secondary: "#4A90A4", accent: "#7BC67E" }, font: "Merriweather / Open Sans" },
  { value: "medical-modern", label: "Medical Modern – bright, approachable care", colors: { primary: "#0077B6", secondary: "#00B4D8", accent: "#90E0EF" }, font: "Nunito / Lato" },
  { value: "revelai", label: "RevelAi – gradient, health tech SaaS", colors: { primary: "#6366F1", secondary: "#8B5CF6", accent: "#EC4899" }, font: "Plus Jakarta Sans" },
  { value: "minimal-saas", label: "Minimal SaaS – neutral, clean, deck-friendly", colors: { primary: "#1F2937", secondary: "#6B7280", accent: "#10B981" }, font: "Inter / System" },
  { value: "startup-bold", label: "Startup Bold – energetic, venture-ready", colors: { primary: "#7C3AED", secondary: "#A78BFA", accent: "#FBBF24" }, font: "Outfit / DM Sans" },
  { value: "enterprise-pro", label: "Enterprise Pro – corporate, trustworthy", colors: { primary: "#1E40AF", secondary: "#3B82F6", accent: "#F97316" }, font: "IBM Plex Sans" },
  { value: "finance-classic", label: "Finance Classic – navy, gold, prestigious", colors: { primary: "#1A2744", secondary: "#334155", accent: "#D4AF37" }, font: "Playfair Display / Roboto" },
  { value: "consulting-elite", label: "Consulting Elite – BCG/McKinsey style", colors: { primary: "#0F172A", secondary: "#475569", accent: "#22C55E" }, font: "Georgia / Helvetica Neue" },
  { value: "creative-agency", label: "Creative Agency – bold, artistic, standout", colors: { primary: "#18181B", secondary: "#EC4899", accent: "#8B5CF6" }, font: "Space Grotesk / Manrope" },
  { value: "academic", label: "Academic – scholarly, authoritative, classic", colors: { primary: "#7C2D12", secondary: "#B45309", accent: "#1E3A8A" }, font: "Crimson Text / Lora" },
  { value: "custom", label: "Custom" },
];

const TONES = [
  { value: "executive", label: "Concise & executive" },
  { value: "clinical", label: "Clinical / academic" },
  { value: "accessible", label: "Warm & accessible" },
  { value: "marketing", label: "Marketing-forward" },
];

export function OnePageExplainerBuilder() {
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
  const [logoUrl, setLogoUrl] = useState("");
  const [footerText, setFooterText] = useState("");
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ExplainerResult | null>(null);
  const [showSourceSection, setShowSourceSection] = useState(true);
  const [showAudienceSection, setShowAudienceSection] = useState(false);
  const [showBrandSection, setShowBrandSection] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "json">("preview");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const currentBrandPreview = useMemo(() => {
    if (selectedSavedBrandId) {
      const savedBrand = savedBrands.find(b => b.id === selectedSavedBrandId);
      if (savedBrand?.colors && savedBrand.colors.length >= 3) {
        return {
          colors: { primary: savedBrand.colors[0], secondary: savedBrand.colors[1], accent: savedBrand.colors[2] },
          font: savedBrand.fonts || undefined,
          name: savedBrand.name,
        };
      }
    }
    if (brandStyle && brandStyle !== "custom") {
      const preset = BRAND_STYLES.find(b => b.value === brandStyle);
      if (preset?.colors) {
        return { colors: preset.colors, font: preset.font, name: preset.label.split(" – ")[0] };
      }
    }
    return null;
  }, [selectedSavedBrandId, savedBrands, brandStyle]);

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

  const handleFileUpload = useCallback(async (file: File) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown'];
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
      if (file.type === 'text/plain' || file.type === 'text/markdown' || fileExtension === '.txt' || fileExtension === '.md') {
        const text = await file.text();
        setSourceContent(prev => prev ? prev + "\n\n--- From " + file.name + " ---\n\n" + text : text);
        toast.success(`Loaded from ${file.name}`);
      } else {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = (reader.result as string).split(',')[1];
          try {
            const { data, error } = await supabase.functions.invoke("parse-document", {
              body: { fileBase64: base64, fileName: file.name, fileType: file.type || fileExtension },
            });
            if (error) throw error;
            if (data?.text) {
              setSourceContent(prev => prev ? prev + "\n\n--- From " + file.name + " ---\n\n" + data.text : data.text);
              toast.success(`Extracted ${data.text.length.toLocaleString()} chars from ${file.name}`);
            } else {
              throw new Error("No text extracted");
            }
          } catch (err) {
            console.error("Error parsing document:", err);
            toast.error("Failed to parse document. Try pasting the content.");
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
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const handleSelectBrand = (value: string) => {
    if (value.startsWith("saved-")) {
      setSelectedSavedBrandId(value.replace("saved-", ""));
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

  const handleGenerate = async () => {
    if (!sourceContent.trim()) {
      toast.error("Please provide source content");
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
          const colorStr = savedBrand.colors?.length ? `Colors: ${savedBrand.colors.join(", ")}` : "";
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
      toast.error("Failed to generate explainer");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getPlainText = () => {
    if (!result) return "";
    let text = `${result.title}\n${result.subtitle}\n\n`;
    result.sections.forEach(s => {
      text += `${s.heading}\n${s.body}\n`;
      s.bullets.forEach(b => text += `• ${b}\n`);
      text += "\n";
    });
    if (result.callout_box.title) {
      text += `${result.callout_box.title}\n${result.callout_box.body}\n`;
      result.callout_box.bullets.forEach(b => text += `• ${b}\n`);
      text += "\n";
    }
    text += `${result.cta.heading}\n${result.cta.body}\n[${result.cta.button_text}]`;
    return text;
  };

  const downloadAsPDF = () => {
    if (!result) return;
    let colors = { primary: "#1a365d", secondary: "#3B82F6", accent: "#F59E0B" };
    let fontFamily = "'Segoe UI', system-ui, sans-serif";
    
    if (selectedSavedBrandId) {
      const savedBrand = savedBrands.find(b => b.id === selectedSavedBrandId);
      if (savedBrand?.colors && savedBrand.colors.length >= 3) {
        colors = { primary: savedBrand.colors[0], secondary: savedBrand.colors[1], accent: savedBrand.colors[2] };
        if (savedBrand.fonts) fontFamily = savedBrand.fonts;
      }
    } else if (brandStyle && brandStyle !== "custom") {
      const selectedBrand = BRAND_STYLES.find(b => b.value === brandStyle);
      if (selectedBrand?.colors) {
        colors = selectedBrand.colors;
        if (selectedBrand.font) fontFamily = selectedBrand.font;
      }
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Please allow pop-ups to download PDF");
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html><head><title>${result.title}</title>
<style>
@page { size: letter; margin: 0.5in; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: ${fontFamily}; font-size: 10pt; line-height: 1.4; color: #1f2937; }
.header { background: ${colors.primary}; color: white; padding: 1rem 1.5rem; margin-bottom: 1rem; }
.header h1 { font-size: 1.5rem; font-weight: 700; }
.header .tagline { opacity: 0.85; font-size: 0.85rem; }
.section { margin-bottom: 0.75rem; }
.section h2 { font-size: 0.9rem; font-weight: 600; color: ${colors.primary}; border-bottom: 2px solid ${colors.accent}; padding-bottom: 0.15rem; margin-bottom: 0.35rem; }
.section p { font-size: 0.85rem; margin-bottom: 0.35rem; }
.section ul { margin-left: 1rem; font-size: 0.85rem; }
.callout { background: #f8fafc; border-left: 3px solid ${colors.accent}; padding: 0.75rem; margin: 0.75rem 0; }
.callout h3 { font-size: 0.85rem; color: ${colors.primary}; margin-bottom: 0.25rem; }
.cta { background: #f1f5f9; border-top: 2px solid ${colors.primary}; padding: 0.75rem 1rem; margin-top: 1rem; }
.cta h3 { color: ${colors.primary}; font-size: 0.9rem; }
.cta-button { display: inline-block; background: ${colors.accent}; color: white; padding: 0.35rem 1rem; border-radius: 3px; font-weight: 600; margin-top: 0.35rem; font-size: 0.8rem; }
.footer { margin-top: 1.5rem; padding-top: 0.75rem; border-top: 1px solid #e5e7eb; text-align: center; font-size: 0.7rem; color: #6b7280; }
</style></head><body>
<div class="header">
${logoUrl ? `<img src="${logoUrl}" style="max-height:40px;margin-bottom:0.5rem"/>` : ''}
<h1>${result.title}</h1>
<p class="tagline">${result.subtitle}</p>
</div>
${result.sections.map(s => `<div class="section"><h2>${s.heading}</h2><p>${s.body}</p>${s.bullets.length ? `<ul>${s.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}</div>`).join('')}
${result.callout_box.title ? `<div class="callout"><h3>${result.callout_box.title}</h3><p>${result.callout_box.body}</p></div>` : ''}
<div class="cta"><h3>${result.cta.heading}</h3><p>${result.cta.body}</p><span class="cta-button">${result.cta.button_text}</span></div>
${footerText ? `<div class="footer">${footerText}</div>` : ''}
</body></html>`);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
    toast.success("PDF ready - use your browser's print dialog");
  };

  const canGenerate = sourceContent.trim() && audience.trim();

  // Preview colors
  const previewColors = useMemo(() => {
    if (selectedSavedBrandId) {
      const savedBrand = savedBrands.find(b => b.id === selectedSavedBrandId);
      if (savedBrand?.colors && savedBrand.colors.length >= 3) {
        return { primary: savedBrand.colors[0], secondary: savedBrand.colors[1], accent: savedBrand.colors[2] };
      }
    }
    if (brandStyle && brandStyle !== "custom") {
      const selected = BRAND_STYLES.find(b => b.value === brandStyle);
      if (selected?.colors) return selected.colors;
    }
    if (result?.brand_tokens_used) {
      return {
        primary: result.brand_tokens_used.primary_color || "#1a365d",
        secondary: result.brand_tokens_used.secondary_color || "#3B82F6",
        accent: result.brand_tokens_used.accent_color || "#F59E0B",
      };
    }
    return { primary: "#1a365d", secondary: "#3B82F6", accent: "#F59E0B" };
  }, [selectedSavedBrandId, savedBrands, brandStyle, result]);

  return (
    <div className="pb-8 md:pb-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Generated Output - Front and Center */}
        {result && (
          <Card className="mb-6 overflow-hidden">
            <div className="p-4 rounded-t-lg text-white" style={{ backgroundColor: previewColors.primary }}>
              <h3 className="text-lg font-bold">{result.title}</h3>
              <p className="mt-1 opacity-90 text-sm">{result.subtitle}</p>
            </div>
            
            <div className="p-4 space-y-4 text-sm">
              {result.sections.map((section) => (
                <div key={section.id}>
                  <h4 className="font-semibold pb-1 border-b-2" style={{ color: previewColors.primary, borderColor: previewColors.accent }}>
                    {section.heading}
                  </h4>
                  <p className="text-muted-foreground mt-1">{section.body}</p>
                  {section.bullets.length > 0 && (
                    <ul className="list-disc list-inside text-muted-foreground ml-2 mt-1">
                      {section.bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}
                    </ul>
                  )}
                </div>
              ))}
              
              {result.callout_box.title && (
                <div className="p-3 rounded-r-lg" style={{ backgroundColor: `${previewColors.accent}15`, borderLeft: `4px solid ${previewColors.accent}` }}>
                  <h5 className="font-semibold" style={{ color: previewColors.primary }}>{result.callout_box.title}</h5>
                  <p className="text-muted-foreground text-xs mt-1">{result.callout_box.body}</p>
                </div>
              )}
              
              <div className="p-3 rounded-lg bg-muted/30" style={{ borderTop: `3px solid ${previewColors.primary}` }}>
                <h5 className="font-semibold" style={{ color: previewColors.primary }}>{result.cta.heading}</h5>
                <p className="text-muted-foreground text-sm mt-1">{result.cta.body}</p>
                <span className="inline-block px-3 py-1 rounded text-xs font-medium text-white mt-2" style={{ backgroundColor: previewColors.accent }}>
                  {result.cta.button_text}
                </span>
              </div>
            </div>
            
            {/* Export Actions */}
            <div className="p-3 border-t border-border/50 bg-muted/30 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => copyToClipboard(getPlainText(), "text")}>
                {copiedField === "text" ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                Copy
              </Button>
              <Button size="sm" className="flex-1" onClick={downloadAsPDF}>
                <FileDown className="w-3.5 h-3.5 mr-1.5" />
                Save PDF
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm"><MoreHorizontal className="w-4 h-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => copyToClipboard(JSON.stringify(result, null, 2), "json")}>
                    <Copy className="w-3 h-3 mr-2" />Copy JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        )}

        {/* Generating State */}
        {isGenerating && !result && (
          <Card className="mb-6 p-12 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Generating your explainer...</p>
          </Card>
        )}

        {/* Input Section */}
        <Card className="overflow-hidden">
          {/* Inline Upload Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
            onDragLeave={() => setIsDraggingFile(false)}
            onDrop={handleFileDrop}
            className={cn(
              "p-4 border-b border-border/50 transition-all",
              isDraggingFile && "bg-primary/5 ring-2 ring-primary/20 ring-inset"
            )}
          >
            {uploadedFile ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
                <File className="w-5 h-5 text-teal-500 flex-shrink-0" />
                <span className="text-sm font-medium truncate flex-1">{uploadedFile.name}</span>
                <button onClick={() => setUploadedFile(null)} className="p-1 hover:bg-muted rounded-full">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 hover:bg-muted rounded-lg transition-colors border border-dashed border-border hover:border-primary/50">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Upload PDF or Word doc</span>
                </div>
                <span className="text-xs text-muted-foreground">or paste content below</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.md"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Source Content */}
          <div className="p-4 border-b border-border/50">
            <Textarea
              value={sourceContent}
              onChange={(e) => setSourceContent(e.target.value)}
              placeholder="Paste your document, notes, transcript, or any source material here..."
              className="min-h-[100px] resize-y border-0 p-0 focus-visible:ring-0 shadow-none"
            />
            <p className="text-xs text-muted-foreground mt-2">{sourceContent.length.toLocaleString()} characters</p>
          </div>

          {/* Audience - Required */}
          <div className="p-4 border-b border-border/50">
            <Label className="text-xs text-muted-foreground mb-2 block">Who is this for?</Label>
            <Input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g., hospital CFO, seed investor, orthopedic surgeons"
              className="border-0 p-0 h-auto focus-visible:ring-0 shadow-none text-sm"
            />
          </div>

          {/* Audience & Purpose - Collapsible */}
          <Collapsible open={showAudienceSection} onOpenChange={setShowAudienceSection}>
            <CollapsibleTrigger className="w-full p-3 flex items-center justify-between text-sm hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-500" />
                <span className="font-medium">
                  {useCase || desiredAction ? "Purpose configured" : "Use case & action (optional)"}
                </span>
              </div>
              {showAudienceSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 pt-0 space-y-3 border-t border-border/50">
                <div>
                  <Label className="text-xs text-muted-foreground">Use case</Label>
                  <Select value={useCase} onValueChange={setUseCase}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select use case" /></SelectTrigger>
                    <SelectContent>
                      {USE_CASES.map((uc) => <SelectItem key={uc.value} value={uc.value}>{uc.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">What should they do after reading?</Label>
                  <Input
                    value={desiredAction}
                    onChange={(e) => setDesiredAction(e.target.value)}
                    placeholder="Schedule a call, approve pilot, sign LOI..."
                    className="mt-1"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Brand & Tone - Collapsible */}
          <Collapsible open={showBrandSection} onOpenChange={setShowBrandSection}>
            <CollapsibleTrigger className="w-full p-3 flex items-center justify-between text-sm hover:bg-muted/30 transition-colors border-t border-border/50">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-teal-500" />
                <span className="font-medium">
                  {brandStyle || selectedSavedBrandId || tone ? "Brand & tone configured" : "Brand & tone (optional)"}
                </span>
              </div>
              {showBrandSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 pt-0 space-y-3 border-t border-border/50">
                <div>
                  <Label className="text-xs text-muted-foreground">Brand style</Label>
                  <Select value={getSelectedBrandValue()} onValueChange={handleSelectBrand}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select brand style" /></SelectTrigger>
                    <SelectContent className="max-h-60">
                      {savedBrands.length > 0 && (
                        <SelectGroup>
                          <SelectLabel className="text-xs flex items-center gap-1"><Star className="w-3 h-3" />Your Brands</SelectLabel>
                          {savedBrands.map(brand => (
                            <SelectItem key={brand.id} value={`saved-${brand.id}`}>
                              <span className="flex items-center gap-2">
                                {brand.colors && brand.colors.length > 0 && (
                                  <span className="flex gap-0.5">
                                    {brand.colors.slice(0, 3).map((color, i) => (
                                      <span key={i} className="w-2.5 h-2.5 rounded-full border border-border/50" style={{ backgroundColor: color }} />
                                    ))}
                                  </span>
                                )}
                                {brand.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}
                      {BRAND_STYLES.map(style => (
                        <SelectItem key={style.value} value={style.value}>
                          <span className="flex items-center gap-2">
                            {style.colors && (
                              <span className="flex gap-0.5">
                                <span className="w-2.5 h-2.5 rounded-full border border-border/50" style={{ backgroundColor: style.colors.primary }} />
                                <span className="w-2.5 h-2.5 rounded-full border border-border/50" style={{ backgroundColor: style.colors.accent }} />
                              </span>
                            )}
                            {style.label.split(" – ")[0]}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select tone" /></SelectTrigger>
                    <SelectContent>
                      {TONES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {currentBrandPreview && (
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <span className="flex gap-1">
                      <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: currentBrandPreview.colors.primary }} />
                      <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: currentBrandPreview.colors.secondary }} />
                      <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: currentBrandPreview.colors.accent }} />
                    </span>
                    <span className="text-xs text-muted-foreground">{currentBrandPreview.name}</span>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Generate Button */}
          <div className="p-4 flex gap-2 border-t border-border/50 bg-muted/30">
            <Button
              className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
              size="lg"
              disabled={!canGenerate || isGenerating}
              onClick={handleGenerate}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Explainer
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
