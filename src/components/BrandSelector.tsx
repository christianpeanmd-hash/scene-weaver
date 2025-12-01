import { useState, useRef, useEffect } from "react";
import { ChevronDown, Plus, Sparkles, X, Upload, Loader2, FileText, Image, Palette } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBrandLibrary, Brand } from "@/hooks/useBrandLibrary";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Preset brand styles with colors and fonts
export const BRAND_STYLE_PRESETS = [
  // Healthcare & Clinical
  { id: "techy-surgeon", name: "Techy Surgeon", category: "Healthcare", colors: ["#0B2545", "#3B82F6", "#F59E0B"], font: "SF Pro / Inter" },
  { id: "clinical-trust", name: "Clinical Trust", category: "Healthcare", colors: ["#1E3A5F", "#4A90A4", "#7BC67E"], font: "Merriweather / Open Sans" },
  { id: "medical-modern", name: "Medical Modern", category: "Healthcare", colors: ["#0077B6", "#00B4D8", "#90E0EF"], font: "Nunito / Lato" },
  
  // Tech & SaaS
  { id: "revelai", name: "RevelAi", category: "Tech", colors: ["#6366F1", "#8B5CF6", "#EC4899"], font: "Plus Jakarta Sans" },
  { id: "minimal-saas", name: "Minimal SaaS", category: "Tech", colors: ["#1F2937", "#6B7280", "#10B981"], font: "Inter / System" },
  { id: "startup-bold", name: "Startup Bold", category: "Tech", colors: ["#7C3AED", "#A78BFA", "#FBBF24"], font: "Outfit / DM Sans" },
  { id: "enterprise-pro", name: "Enterprise Pro", category: "Tech", colors: ["#1E40AF", "#3B82F6", "#F97316"], font: "IBM Plex Sans" },
  
  // Finance & Consulting
  { id: "finance-classic", name: "Finance Classic", category: "Finance", colors: ["#1A2744", "#334155", "#D4AF37"], font: "Playfair Display / Roboto" },
  { id: "consulting-elite", name: "Consulting Elite", category: "Finance", colors: ["#0F172A", "#475569", "#22C55E"], font: "Georgia / Helvetica Neue" },
  
  // Creative & Marketing
  { id: "creative-agency", name: "Creative Agency", category: "Creative", colors: ["#18181B", "#EC4899", "#8B5CF6"], font: "Space Grotesk / Manrope" },
  { id: "lifestyle-brand", name: "Lifestyle Brand", category: "Creative", colors: ["#78350F", "#D97706", "#FDE68A"], font: "Libre Baskerville / Source Sans" },
  { id: "eco-friendly", name: "Eco Friendly", category: "Creative", colors: ["#14532D", "#22C55E", "#A7F3D0"], font: "Poppins / Quicksand" },
  
  // Education & Research
  { id: "academic", name: "Academic", category: "Research", colors: ["#7C2D12", "#B45309", "#1E3A8A"], font: "Crimson Text / Lora" },
  { id: "edtech-fresh", name: "EdTech Fresh", category: "Research", colors: ["#4338CA", "#6366F1", "#06B6D4"], font: "Lexend / Inter" },
  { id: "academic-journal", name: "Academic Journal", category: "Research", colors: ["#1F2937", "#4B5563", "#0369A1"], font: "Times New Roman / Helvetica" },
  { id: "scientific-modern", name: "Scientific Modern", category: "Research", colors: ["#18181B", "#52525B", "#2563EB"], font: "Helvetica Neue / Georgia" },
  
  // Medical Journals
  { id: "jama-style", name: "JAMA Style", category: "Medical", colors: ["#1A2744", "#8B0000", "#FFFFFF"], font: "Minion Pro / Arial" },
  { id: "nejm-style", name: "NEJM Style", category: "Medical", colors: ["#C41E3A", "#333333", "#FFFFFF"], font: "Georgia / Helvetica" },
  { id: "lancet-style", name: "Lancet Style", category: "Medical", colors: ["#B22222", "#1C1C1C", "#FFFFFF"], font: "Times New Roman / Arial" },
  
  // Dark themes
  { id: "dark-executive", name: "Dark Executive", category: "Dark", colors: ["#18181B", "#27272A", "#FAFAFA"], font: "SF Pro Display / Inter" },
  { id: "midnight-tech", name: "Midnight Tech", category: "Dark", colors: ["#0F172A", "#1E293B", "#38BDF8"], font: "JetBrains Mono / Inter" },
];

interface BrandSelectorProps {
  selectedBrand: Brand | null;
  onSelectBrand: (brand: Brand | null) => void;
  customBrandText?: string;
  onCustomBrandChange?: (text: string) => void;
  selectedPresetId?: string | null;
  onSelectPreset?: (presetId: string | null) => void;
}

export function BrandSelector({
  selectedBrand,
  onSelectBrand,
  customBrandText = "",
  onCustomBrandChange,
  selectedPresetId,
  onSelectPreset,
}: BrandSelectorProps) {
  const { brands, saveBrand } = useBrandLibrary();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandDescription, setNewBrandDescription] = useState("");
  const [newBrandColors, setNewBrandColors] = useState("");
  const [newBrandFonts, setNewBrandFonts] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [localPresetId, setLocalPresetId] = useState<string | null>(null);
  
  // Use either controlled or local state for preset
  const activePresetId = selectedPresetId !== undefined ? selectedPresetId : localPresetId;
  const setActivePresetId = onSelectPreset || setLocalPresetId;
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Handle paste events for clipboard images
  useEffect(() => {
    if (!isCreating) return;
    
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            processImageFile(file);
          }
          break;
        }
      }
    };
    
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [isCreating]);

  const processImageFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setUploadedImage(base64);
      await analyzeUpload(base64);
    };
    reader.readAsDataURL(file);
  };

  const processDocumentFile = async (file: File) => {
    const text = await file.text();
    await analyzeUpload(undefined, text);
  };

  const analyzeUpload = async (imageBase64?: string, documentContent?: string) => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image-prompt', {
        body: {
          type: 'brand-from-upload',
          imageBase64,
          documentContent,
        },
      });

      if (error) throw error;
      
      if (data?.brand) {
        const { name, description, colors, fonts } = data.brand;
        setNewBrandName(name || '');
        setNewBrandDescription(description || '');
        setNewBrandColors(Array.isArray(colors) ? colors.join(', ') : '');
        setNewBrandFonts(fonts || '');
        toast.success('Brand details extracted! Review and save.');
      }
    } catch (err) {
      console.error('Brand analysis error:', err);
      toast.error('Failed to analyze brand. Please fill in details manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processDocumentFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      processImageFile(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               file.type === 'text/plain' ||
               file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      processDocumentFile(file);
    } else {
      toast.error('Please upload an image or text document');
    }
  };

  const handleSaveBrand = async () => {
    if (!newBrandName.trim()) {
      toast.error("Please enter a brand name");
      return;
    }
    if (!newBrandDescription.trim()) {
      toast.error("Please enter a brand description");
      return;
    }

    const brand = await saveBrand({
      name: newBrandName.trim(),
      description: newBrandDescription.trim(),
      colors: newBrandColors.trim()
        ? newBrandColors.split(",").map((c) => c.trim())
        : undefined,
      fonts: newBrandFonts.trim() || undefined,
    });

    if (brand) {
      onSelectBrand(brand);
      toast.success("Brand saved to library!");
    }
    resetForm();
  };

  const resetForm = () => {
    setIsCreating(false);
    setNewBrandName("");
    setNewBrandDescription("");
    setNewBrandColors("");
    setNewBrandFonts("");
    setUploadedImage(null);
  };

  const handleSelectBrand = (brand: Brand) => {
    onSelectBrand(brand);
    if (onCustomBrandChange) {
      onCustomBrandChange("");
    }
    setIsExpanded(false);
  };

  const handleCustomChange = (text: string) => {
    onCustomBrandChange?.(text);
    if (text) {
      onSelectBrand(null);
    }
  };

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-foreground">Brand / Theme</span>
          <span className="text-muted-foreground text-xs">optional</span>
        </div>
        <div className="flex items-center gap-2">
          {(selectedBrand || customBrandText || activePresetId) && (
            <span className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              {activePresetId && (
                <div className="flex gap-0.5">
                  {BRAND_STYLE_PRESETS.find(p => p.id === activePresetId)?.colors.slice(0, 3).map((color, i) => (
                    <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  ))}
                </div>
              )}
              {selectedBrand?.name || BRAND_STYLE_PRESETS.find(p => p.id === activePresetId)?.name || "Custom"}
            </span>
          )}
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-border/50 bg-muted/20 animate-fade-in">
          {/* Preset Brand Styles */}
          <div className="p-3 border-b border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-3.5 h-3.5 text-amber-500" />
              <p className="text-xs font-medium text-muted-foreground">Brand Styles</p>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {BRAND_STYLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setActivePresetId(activePresetId === preset.id ? null : preset.id);
                    onSelectBrand(null);
                    onCustomBrandChange?.("");
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all",
                    activePresetId === preset.id
                      ? "bg-amber-500 text-white ring-2 ring-amber-300"
                      : "bg-card border border-border hover:border-amber-300"
                  )}
                >
                  <div className="flex gap-0.5">
                    {preset.colors.slice(0, 3).map((color, i) => (
                      <div
                        key={i}
                        className="w-2.5 h-2.5 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="truncate max-w-[80px]">{preset.name}</span>
                </button>
              ))}
            </div>
            {activePresetId && (
              <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-md">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  {BRAND_STYLE_PRESETS.find(p => p.id === activePresetId)?.name} • {BRAND_STYLE_PRESETS.find(p => p.id === activePresetId)?.font}
                </p>
              </div>
            )}
          </div>

          {/* Saved Brands */}
          {brands.length > 0 && (
            <div className="p-3 border-b border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-2">My Saved Brands</p>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => {
                      handleSelectBrand(brand);
                      setActivePresetId(null);
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                      selectedBrand?.id === brand.id
                        ? "bg-amber-500 text-white"
                        : "bg-card border border-border hover:border-amber-300"
                    )}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Description */}
          <div className="p-3 border-b border-border/50">
            <p className="text-xs font-medium text-muted-foreground mb-2">Quick Brand Description</p>
            <textarea
              value={customBrandText}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="Describe your brand... e.g., 'Professional tech company with blue and white colors, modern minimal aesthetic'"
              rows={2}
              className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all resize-none"
            />
          </div>

          {/* Create New Brand */}
          {!isCreating ? (
            <div className="p-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreating(true)}
                className="w-full gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Brand Kit
              </Button>
            </div>
          ) : (
            <div className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-foreground">New Brand Kit</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={resetForm}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={cn(
                  "border-2 border-dashed border-border rounded-lg p-4 text-center transition-colors",
                  "hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-950/20",
                  isAnalyzing && "opacity-50 pointer-events-none"
                )}
              >
                {isAnalyzing ? (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                    <p className="text-xs text-muted-foreground">Analyzing brand...</p>
                  </div>
                ) : uploadedImage ? (
                  <div className="relative">
                    <img src={uploadedImage} alt="Brand preview" className="max-h-24 mx-auto rounded" />
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center gap-3 mb-2">
                      <Image className="w-5 h-5 text-muted-foreground" />
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Drop brand screenshot, logo, or doc here
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      or <span className="text-amber-600 font-medium">paste from clipboard</span>
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs gap-1"
                      >
                        <Image className="w-3 h-3" />
                        Image
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => docInputRef.current?.click()}
                        className="text-xs gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        Document
                      </Button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <input
                      ref={docInputRef}
                      type="file"
                      accept=".txt,.md,.doc,.docx"
                      className="hidden"
                      onChange={handleDocUpload}
                    />
                  </>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-muted/20 px-2 text-muted-foreground">or fill manually</span>
                </div>
              </div>

              <input
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Brand name"
                className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
              />

              <textarea
                value={newBrandDescription}
                onChange={(e) => setNewBrandDescription(e.target.value)}
                placeholder="Brand description and visual style..."
                rows={2}
                className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 resize-none"
              />

              <input
                value={newBrandColors}
                onChange={(e) => setNewBrandColors(e.target.value)}
                placeholder="Brand colors (comma separated, e.g., #1a73e8, #ea4335)"
                className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
              />

              <input
                value={newBrandFonts}
                onChange={(e) => setNewBrandFonts(e.target.value)}
                placeholder="Font preferences (e.g., Montserrat, clean sans-serif)"
                className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
              />

              <Button
                onClick={handleSaveBrand}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                size="sm"
                disabled={isAnalyzing}
              >
                Save Brand to Library
              </Button>
            </div>
          )}

          {/* Clear Selection */}
          {(selectedBrand || customBrandText || activePresetId) && (
            <div className="p-3 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onSelectBrand(null);
                  onCustomBrandChange?.("");
                  setActivePresetId(null);
                }}
                className="w-full text-muted-foreground"
              >
                Clear brand selection
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// Helper to get brand context string from preset ID
export function getBrandContextFromPreset(presetId: string | null): string | undefined {
  if (!presetId) return undefined;
  const preset = BRAND_STYLE_PRESETS.find(p => p.id === presetId);
  if (!preset) return undefined;
  return `Brand Style: ${preset.name}. Colors: ${preset.colors.join(', ')}. Typography: ${preset.font}.`;
}