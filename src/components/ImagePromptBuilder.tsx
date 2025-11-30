import { useState, useCallback, useEffect } from "react";
import { Image, Sparkles, Upload, Copy, Check, X, Wand2, Clipboard, ImagePlus, Palette, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StyleSelector } from "./StyleSelector";
import { BrandSelector } from "./BrandSelector";
import { AIToolLinks } from "./AIToolLinks";
import { GeneratedImageDisplay } from "./GeneratedImageDisplay";
import { FavoritePhotosPicker } from "./FavoritePhotosPicker";
import { IllustrationStyle, ILLUSTRATION_STYLES } from "@/data/illustration-styles";
import { Brand } from "@/hooks/useBrandLibrary";
import { generateImagePrompt } from "@/lib/image-prompt-generator";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

// Popular styles for quick apply
const QUICK_STYLES = [
  "watercolor-minimalism",
  "pop-art",
  "line-drawing-xkcd",
  "3d-claymation",
  "vintage-engraving",
  "futuristic-neon",
];

interface ImagePromptBuilderProps {
  onSwitchToVideo: () => void;
}

export function ImagePromptBuilder({ onSwitchToVideo }: ImagePromptBuilderProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<IllustrationStyle | null>(null);
  const [customStyleText, setCustomStyleText] = useState("");
  const [subjectDescription, setSubjectDescription] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [customBrandText, setCustomBrandText] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isApplyingStyle, setIsApplyingStyle] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setGeneratedPrompt("");
      setGeneratedImageUrl(null);
      toast.success("Image uploaded!");
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle paste from clipboard
  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          handleImageUpload(file);
        }
        break;
      }
    }
  }, [handleImageUpload]);

  // Listen for paste events
  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  }, [handleImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  }, [handleImageUpload]);

  const getBrandContext = () => {
    return selectedBrand 
      ? `Brand: ${selectedBrand.name}. ${selectedBrand.description}${selectedBrand.colors?.length ? ` Colors: ${selectedBrand.colors.join(', ')}.` : ''}${selectedBrand.fonts ? ` Typography: ${selectedBrand.fonts}.` : ''}`
      : customBrandText.trim() || undefined;
  };

  const handleGenerate = async () => {
    if (!selectedStyle && !customStyleText.trim()) {
      toast.error("Please select a style or describe your own");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = await generateImagePrompt({
        style: selectedStyle,
        customStyle: customStyleText.trim() || undefined,
        imageBase64: uploadedImage,
        subjectDescription,
        brandContext: getBrandContext(),
      });
      setGeneratedPrompt(prompt);
      toast.success("Prompt generated!");
    } catch (error) {
      console.error("Error generating prompt:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate prompt");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImageDirectly = async () => {
    if (!selectedStyle && !customStyleText.trim()) {
      toast.error("Please select a style or describe your own");
      return;
    }

    setIsGeneratingImage(true);
    setGeneratedImageUrl(null);
    
    try {
      // First generate the prompt
      const prompt = await generateImagePrompt({
        style: selectedStyle,
        customStyle: customStyleText.trim() || undefined,
        imageBase64: uploadedImage,
        subjectDescription,
        brandContext: getBrandContext(),
      });
      setGeneratedPrompt(prompt);
      
      // Then generate the image using the prompt
      const { data, error } = await supabase.functions.invoke("generate-ai-image", {
        body: { prompt, type: "image" },
      });

      if (error) throw error;
      if (data?.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        toast.success("Image generated!");
      } else {
        throw new Error("No image returned");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate image");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleApplyStyleToImage = async () => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }
    if (!selectedStyle && !customStyleText.trim()) {
      toast.error("Please select a style");
      return;
    }

    setIsApplyingStyle(true);
    setGeneratedImageUrl(null);
    
    try {
      // Build the style instruction
      const styleInstruction = selectedStyle 
        ? `Transform this photo into the "${selectedStyle.name}" style: ${selectedStyle.look}. ${selectedStyle.useCase ? `This style is best for: ${selectedStyle.useCase}.` : ''}`
        : `Transform this photo using this style: ${customStyleText}`;
      
      const brandContext = getBrandContext();
      const fullPrompt = brandContext 
        ? `${styleInstruction} ${brandContext}` 
        : styleInstruction;
      
      setGeneratedPrompt(fullPrompt);
      
      // Use edit mode to restyle the actual image
      const { data, error } = await supabase.functions.invoke("generate-ai-image", {
        body: { 
          prompt: fullPrompt, 
          editMode: true,
          sourceImageBase64: uploadedImage,
        },
      });

      if (error) throw error;
      if (data?.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        toast.success("Style applied!");
      } else {
        throw new Error("No image returned");
      }
    } catch (error) {
      console.error("Error applying style:", error);
      toast.error(error instanceof Error ? error.message : "Failed to apply style");
    } finally {
      setIsApplyingStyle(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const clearImage = () => {
    setUploadedImage(null);
    setGeneratedPrompt("");
    setGeneratedImageUrl(null);
  };

  const handleQuickApply = async (styleId: string) => {
    const style = ILLUSTRATION_STYLES.find(s => s.id === styleId);
    if (!style) return;
    
    setSelectedStyle(style);
    
    // Immediately trigger apply
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsApplyingStyle(true);
    setGeneratedImageUrl(null);
    
    try {
      const styleInstruction = `Transform this photo into the "${style.name}" style: ${style.look}. ${style.useCase ? `This style is best for: ${style.useCase}.` : ''}`;
      const brandContext = getBrandContext();
      const fullPrompt = brandContext ? `${styleInstruction} ${brandContext}` : styleInstruction;
      
      setGeneratedPrompt(fullPrompt);
      
      const { data, error } = await supabase.functions.invoke("generate-ai-image", {
        body: { 
          prompt: fullPrompt, 
          editMode: true,
          sourceImageBase64: uploadedImage,
        },
      });

      if (error) throw error;
      if (data?.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        toast.success(`${style.name} style applied!`);
      } else {
        throw new Error("No image returned");
      }
    } catch (error) {
      console.error("Error applying style:", error);
      toast.error(error instanceof Error ? error.message : "Failed to apply style");
    } finally {
      setIsApplyingStyle(false);
    }
  };

  return (
    <div className="pb-8 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Upload & Style */}
          <div className="space-y-5">
            {/* Image Upload */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-border/50">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Upload className="w-4 h-4 text-primary" />
                  Your Photo
                  <span className="text-muted-foreground text-xs font-normal">optional</span>
                </label>
              </div>
              
              {!uploadedImage ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`p-6 transition-all ${
                    isDragging 
                      ? "bg-purple-50 dark:bg-purple-950/20 border-2 border-dashed border-purple-300" 
                      : "bg-muted/50"
                  }`}
                >
                  <div className="text-center">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                      <Image className="w-7 h-7 text-purple-500" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Drag & drop, paste from clipboard, or
                    </p>
                    <label className="cursor-pointer">
                      <span className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
                        Browse Files
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                    </label>
                    <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
                      <Clipboard className="w-3 h-3" />
                      <span>Ctrl/Cmd+V to paste</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-muted/30">
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Quick Apply Styles - only show when image is uploaded */}
              {uploadedImage && (
                <div className="p-3 border-t border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-medium text-muted-foreground">Quick Apply</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_STYLES.map((styleId) => {
                      const style = ILLUSTRATION_STYLES.find(s => s.id === styleId);
                      if (!style) return null;
                      return (
                        <button
                          key={styleId}
                          onClick={() => handleQuickApply(styleId)}
                          disabled={isApplyingStyle || isGenerating || isGeneratingImage}
                          className={cn(
                            "px-2.5 py-1 text-xs rounded-full border transition-all",
                            selectedStyle?.id === styleId
                              ? "bg-purple-100 dark:bg-purple-900/30 border-purple-400 text-purple-700 dark:text-purple-300"
                              : "bg-card border-border hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 text-foreground"
                          )}
                        >
                          {style.name.split(' ')[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Favorite Photos */}
              <div className="p-3 border-t border-border/50">
                <FavoritePhotosPicker
                  currentImage={uploadedImage}
                  onSelectPhoto={(img) => {
                    setUploadedImage(img);
                    toast.success("Photo selected!");
                  }}
                />
              </div>
            </Card>

            {/* Subject Description */}
            <Card className="p-5">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                Subject Description
                {!uploadedImage && <span className="text-rose-500 text-xs">required</span>}
              </label>
              <textarea
                value={subjectDescription}
                onChange={(e) => setSubjectDescription(e.target.value)}
                placeholder={uploadedImage 
                  ? "Add details... e.g., professional headshot, warm smile, blue suit" 
                  : "Describe what you want... e.g., a thoughtful doctor looking at a tablet"
                }
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
            </Card>

            {/* Style Selector */}
            <StyleSelector
              selectedStyle={selectedStyle}
              onSelectStyle={setSelectedStyle}
              customStyleText={customStyleText}
              onCustomStyleChange={setCustomStyleText}
            />

            {/* Brand Selector */}
            <BrandSelector
              selectedBrand={selectedBrand}
              onSelectBrand={setSelectedBrand}
              customBrandText={customBrandText}
              onCustomBrandChange={setCustomBrandText}
            />

            {/* Generate Buttons */}
            <div className="space-y-3">
              {/* Primary action: Apply style to uploaded photo */}
              {uploadedImage && (
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  disabled={(!selectedStyle && !customStyleText.trim()) || isGenerating || isGeneratingImage || isApplyingStyle}
                  onClick={handleApplyStyleToImage}
                >
                  {isApplyingStyle ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Applying Style...
                    </>
                  ) : (
                    <>
                      <Palette className="w-4 h-4" />
                      Apply Style to Image
                    </>
                  )}
                </Button>
              )}
              
              {/* Secondary actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={(!uploadedImage && !subjectDescription.trim()) || (!selectedStyle && !customStyleText.trim()) || isGenerating || isGeneratingImage || isApplyingStyle}
                  onClick={handleGenerate}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      Generate Prompt
                    </>
                  )}
                </Button>
                
                <Button
                  variant={uploadedImage ? "outline" : "hero"}
                  size="lg"
                  className={cn(
                    "w-full",
                    !uploadedImage && "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  )}
                  disabled={(!uploadedImage && !subjectDescription.trim()) || (!selectedStyle && !customStyleText.trim()) || isGenerating || isGeneratingImage || isApplyingStyle}
                  onClick={handleGenerateImageDirectly}
                >
                  {isGeneratingImage ? (
                    <>
                      <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <ImagePlus className="w-4 h-4" />
                      Generate Image
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                {uploadedImage 
                  ? "Apply style directly, or get a prompt / generate new image"
                  : "Get a prompt to use elsewhere, or generate an image directly"
                }
              </p>
            </div>
          </div>

          {/* Right Column - Result */}
          <div className="space-y-5">
            {/* Generated Prompt / Image */}
            <Card className="h-full flex flex-col">
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Generated Prompt / Image
                </label>
                {generatedPrompt && (
                  <Button variant="ghost" size="icon-sm" onClick={handleCopy}>
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
              
              <div className="flex-1 p-4 bg-muted/30">
                {generatedPrompt || generatedImageUrl ? (
                  <div className="space-y-4">
                    {/* Show generated image if we created one directly */}
                    {generatedImageUrl && (
                      <div className="rounded-lg overflow-hidden border border-border">
                        <img
                          src={generatedImageUrl}
                          alt="Generated"
                          className="w-full h-auto"
                        />
                      </div>
                    )}
                    
                    {generatedPrompt && (
                      <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed bg-card p-4 rounded-lg border border-border max-h-48 overflow-y-auto">
                        {generatedPrompt}
                      </pre>
                    )}
                    
                    {/* Generate Image Directly (only show if we don't already have one) */}
                    {!generatedImageUrl && generatedPrompt && (
                      <GeneratedImageDisplay prompt={generatedPrompt} type="image" />
                    )}
                    
                    {/* Or Use External Tools */}
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2">
                        {generatedImageUrl ? "Use your prompt in other tools:" : "Or copy prompt to use in:"}
                      </p>
                      <AIToolLinks type="image" />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your generated prompt or image will appear here
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        Select a style and click Generate
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Style Preview */}
            {selectedStyle && (
              <Card className="p-4 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                    <Image className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{selectedStyle.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{selectedStyle.look}</p>
                    <p className="text-xs text-purple-600 mt-2">Best for: {selectedStyle.useCase}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
