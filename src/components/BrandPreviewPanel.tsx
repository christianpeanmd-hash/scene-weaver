import { useState, useCallback } from "react";
import { Upload, Loader2, Palette, ImageIcon, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
}

interface BrandPreviewPanelProps {
  colors: BrandColors | null;
  font?: string;
  brandName?: string;
  onColorsExtracted?: (colors: string[], font?: string) => void;
}

export function BrandPreviewPanel({ 
  colors, 
  font, 
  brandName,
  onColorsExtracted 
}: BrandPreviewPanelProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setUploadedImage(base64);
      await extractColorsFromImage(base64);
    };
    reader.readAsDataURL(file);
  }, []);

  const extractColorsFromImage = async (imageBase64: string) => {
    setIsExtracting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("generate-image-prompt", {
        body: {
          mode: "extract-colors",
          imageBase64,
        },
      });

      if (error) throw error;

      if (data.colors && Array.isArray(data.colors)) {
        onColorsExtracted?.(data.colors, data.font);
        toast.success("Colors extracted from image!");
      } else {
        throw new Error("No colors returned");
      }
    } catch (error) {
      console.error("Error extracting colors:", error);
      toast.error("Failed to extract colors. Try again or enter manually.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  }, [handleImageUpload]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) handleImageUpload(file);
        break;
      }
    }
  }, [handleImageUpload]);

  const clearImage = () => {
    setUploadedImage(null);
  };

  if (!colors && !onColorsExtracted) return null;

  // Determine if we should use light or dark text based on primary color luminance
  const getLuminance = (hex: string) => {
    const rgb = hex.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
    return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  };
  
  const primaryLuminance = colors ? getLuminance(colors.primary) : 0.5;
  const headerTextColor = primaryLuminance > 0.5 ? '#1f2937' : '#ffffff';

  return (
    <div className="space-y-3">
      {/* Mini One-Pager Document Preview */}
      {colors && (
        <div className="space-y-2">
          <Label className="text-xs flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Style Preview
          </Label>
          <div className="rounded-lg border border-border overflow-hidden shadow-sm bg-white">
            {/* Mini Document */}
            <div className="scale-100 origin-top">
              {/* Header */}
              <div 
                className="px-3 py-2"
                style={{ backgroundColor: colors.primary, color: headerTextColor }}
              >
                <div className="text-[10px] font-bold leading-tight" style={{ fontFamily: font }}>
                  {brandName || "One-Pager Title"}
                </div>
                <div className="text-[8px] opacity-80">Subtitle goes here</div>
              </div>
              
              {/* Content Area */}
              <div className="px-3 py-2 space-y-2">
                {/* Section 1 */}
                <div>
                  <div 
                    className="text-[8px] font-semibold mb-0.5 pb-0.5"
                    style={{ 
                      color: colors.primary, 
                      borderBottom: `1px solid ${colors.accent}`,
                      fontFamily: font 
                    }}
                  >
                    Key Section Heading
                  </div>
                  <div className="text-[7px] text-gray-600 leading-relaxed">
                    Sample body text demonstrating how your content will appear with this brand style applied.
                  </div>
                  <div className="mt-1 space-y-0.5">
                    <div className="flex items-start gap-1 text-[7px] text-gray-600">
                      <span style={{ color: colors.secondary }}>•</span>
                      <span>Bullet point example</span>
                    </div>
                    <div className="flex items-start gap-1 text-[7px] text-gray-600">
                      <span style={{ color: colors.secondary }}>•</span>
                      <span>Another key insight</span>
                    </div>
                  </div>
                </div>
                
                {/* Callout Box */}
                <div 
                  className="px-2 py-1.5 rounded text-[7px]"
                  style={{ 
                    backgroundColor: `${colors.accent}15`,
                    borderLeft: `2px solid ${colors.accent}` 
                  }}
                >
                  <div className="font-semibold mb-0.5" style={{ color: colors.primary }}>
                    Callout Box
                  </div>
                  <div className="text-gray-600">Important highlight or key metric.</div>
                </div>
                
                {/* CTA */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  <div className="text-[7px] text-gray-500">Ready to learn more?</div>
                  <div 
                    className="px-2 py-0.5 rounded text-[7px] font-medium text-white"
                    style={{ backgroundColor: colors.accent }}
                  >
                    Get Started
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Color Palette Strip */}
          <div className="flex items-center gap-2 px-1">
            <div className="flex items-center gap-1">
              <div 
                className="w-4 h-4 rounded border border-border/50 shadow-sm"
                style={{ backgroundColor: colors.primary }}
                title={`Primary: ${colors.primary}`}
              />
              <div 
                className="w-4 h-4 rounded border border-border/50 shadow-sm"
                style={{ backgroundColor: colors.secondary }}
                title={`Secondary: ${colors.secondary}`}
              />
              <div 
                className="w-4 h-4 rounded border border-border/50 shadow-sm"
                style={{ backgroundColor: colors.accent }}
                title={`Accent: ${colors.accent}`}
              />
            </div>
            {font && (
              <span className="text-[10px] text-muted-foreground truncate">
                {font.split('/')[0].trim()}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Image Upload for Color Extraction */}
      {onColorsExtracted && (
        <div className="space-y-2">
          <Label className="text-xs flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            Import colors from logo/image
          </Label>
          
          {uploadedImage ? (
            <div className="relative rounded-lg border border-border p-2 bg-muted/30">
              <button 
                onClick={clearImage}
                className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="flex items-center gap-3">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded" 
                  className="w-12 h-12 object-contain rounded"
                />
                <div className="flex-1">
                  {isExtracting ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Extracting colors...
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={() => extractColorsFromImage(uploadedImage)}
                    >
                      Re-extract colors
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onPaste={handlePaste}
              tabIndex={0}
            >
              {isExtracting ? (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Extracting colors...
                </div>
              ) : (
                <>
                  <Upload className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground mb-1">
                    Drop logo or paste image
                  </p>
                  <label className="cursor-pointer">
                    <span className="text-xs text-primary hover:underline">
                      or click to browse
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                  </label>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
