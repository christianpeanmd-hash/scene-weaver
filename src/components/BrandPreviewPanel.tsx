import { useState, useCallback } from "react";
import { Upload, Loader2, Palette, ImageIcon, X } from "lucide-react";
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

  return (
    <div className="space-y-3">
      {/* Live Preview */}
      {colors && (
        <div className="rounded-lg border border-border overflow-hidden">
          <div 
            className="p-4 text-white"
            style={{ backgroundColor: colors.primary }}
          >
            <div className="text-sm font-semibold mb-1" style={{ fontFamily: font }}>
              {brandName || "Brand Preview"}
            </div>
            <div className="text-xs opacity-80">Header / Primary color</div>
          </div>
          <div className="p-3 bg-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-5 h-5 rounded border border-border"
                    style={{ backgroundColor: colors.primary }}
                    title="Primary"
                  />
                  <span className="text-xs text-muted-foreground">Primary</span>
                  <code className="text-[10px] bg-muted px-1 rounded">{colors.primary}</code>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-5 h-5 rounded border border-border"
                    style={{ backgroundColor: colors.secondary }}
                    title="Secondary"
                  />
                  <span className="text-xs text-muted-foreground">Secondary</span>
                  <code className="text-[10px] bg-muted px-1 rounded">{colors.secondary}</code>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-5 h-5 rounded border border-border"
                    style={{ backgroundColor: colors.accent }}
                    title="Accent"
                  />
                  <span className="text-xs text-muted-foreground">Accent</span>
                  <code className="text-[10px] bg-muted px-1 rounded">{colors.accent}</code>
                </div>
              </div>
              <div 
                className="px-3 py-1.5 rounded text-xs font-medium text-white"
                style={{ backgroundColor: colors.accent }}
              >
                CTA Button
              </div>
            </div>
            {font && (
              <div className="text-xs text-muted-foreground border-t border-border pt-2">
                <Palette className="w-3 h-3 inline mr-1" />
                Font: {font}
              </div>
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
