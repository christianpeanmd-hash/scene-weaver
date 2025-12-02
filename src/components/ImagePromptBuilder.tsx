import { useState, useCallback, useEffect } from "react";
import { Image, Sparkles, Upload, Copy, Check, X, Wand2, Clipboard, ImagePlus, Zap, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StyleSelector } from "./StyleSelector";
import { BrandSelector, getBrandContextFromPreset } from "./BrandSelector";
import { AIToolLinks } from "./AIToolLinks";
import { GeneratedImageDisplay } from "./GeneratedImageDisplay";
import { FavoritePhotosPicker } from "./FavoritePhotosPicker";
import { GeneratedImagesGallery } from "./GeneratedImagesGallery";
import { FreeLimitModal } from "./FreeLimitModal";
import { IllustrationStyle, ILLUSTRATION_STYLES } from "@/data/illustration-styles";
import { Brand } from "@/hooks/useBrandLibrary";
import { generateImagePrompt } from "@/lib/image-prompt-generator";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useUsageLimit } from "@/hooks/useUsageLimit";
import { useGeneratedImagesGallery } from "@/hooks/useGeneratedImagesGallery";

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
  const [sceneDescription, setSceneDescription] = useState(""); // What user wants to see
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [customBrandText, setCustomBrandText] = useState("");
  const [selectedBrandPresetId, setSelectedBrandPresetId] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [applyingStyleId, setApplyingStyleId] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pendingQuickApplyStyle, setPendingQuickApplyStyle] = useState<string | null>(null);
  
  const { showLimitModal, setShowLimitModal, handleRateLimitError } = useUsageLimit();
  const { images: galleryImages, isLoading: galleryLoading, addImage: addToGallery, deleteImage: deleteFromGallery } = useGeneratedImagesGallery();

  // Helper to check if an error is a rate limit error
  const isRateLimitError = (error: unknown): boolean => {
    if (error instanceof Error) {
      return error.message.includes("RATE_LIMIT") || error.message.includes("Daily limit");
    }
    return false;
  };

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
      toast.success("Photo uploaded!");
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

  // Check for quick apply from Library page on mount
  useEffect(() => {
    const quickApplyImage = sessionStorage.getItem("quickApplyImage");
    const quickApplyStyle = sessionStorage.getItem("quickApplyStyle");
    const editPrompt = sessionStorage.getItem("editPrompt");
    
    if (quickApplyImage) {
      setUploadedImage(quickApplyImage);
      sessionStorage.removeItem("quickApplyImage");
      
      if (quickApplyStyle) {
        sessionStorage.removeItem("quickApplyStyle");
        setPendingQuickApplyStyle(quickApplyStyle);
      }
    }
    
    // Load prompt for editing
    if (editPrompt) {
      setCustomStyleText(editPrompt);
      setGeneratedPrompt(editPrompt);
      sessionStorage.removeItem("editPrompt");
      toast.info("Prompt loaded - modify and regenerate!");
    }
  }, []);

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
    return getBrandContextFromPreset(selectedBrandPresetId)
      || (selectedBrand 
        ? `Brand: ${selectedBrand.name}. ${selectedBrand.description}${selectedBrand.colors?.length ? ` Colors: ${selectedBrand.colors.join(', ')}.` : ''}${selectedBrand.fonts ? ` Typography: ${selectedBrand.fonts}.` : ''}`
        : customBrandText.trim() || undefined);
  };

  // Build a creative prompt that uses the photo as reference but allows creative freedom
  const buildCreativePrompt = (style: IllustrationStyle | null, customStyle: string | undefined) => {
    const styleName = style?.name || "custom style";
    const styleLook = style?.look || customStyle || "";
    const brandContext = getBrandContext();
    
    let prompt = "";
    
    if (uploadedImage) {
      // Photo uploaded - use person as reference but allow creative scene
      if (sceneDescription.trim()) {
        // User described what they want - create that scene with the person
        prompt = `Using the person from this photo as your subject reference, create: ${sceneDescription.trim()}. 

Render in ${styleName} style: ${styleLook}

Keep the person recognizable but feel free to change their pose, expression, clothing, and setting to match the described scene. The goal is a creative, styled image of this person in the new scenario.`;
      } else {
        // No scene description - stylize the person in an interesting way
        prompt = `Transform this person into a ${styleName} artwork. 

Style: ${styleLook}

Create an artistic, visually striking image. You can adjust the pose, setting, and background to best showcase the style while keeping the person recognizable.`;
      }
    } else {
      // No photo - pure generation from description
      prompt = `Create an image: ${sceneDescription.trim() || "a compelling visual"}

Render in ${styleName} style: ${styleLook}`;
    }
    
    if (brandContext) {
      prompt += `\n\nBrand context: ${brandContext}`;
    }
    
    return prompt;
  };

  const handleGenerate = async () => {
    if (!selectedStyle && !customStyleText.trim()) {
      toast.error("Please select a style");
      return;
    }
    if (!uploadedImage && !sceneDescription.trim()) {
      toast.error("Upload a photo or describe what you want");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = await generateImagePrompt({
        style: selectedStyle,
        customStyle: customStyleText.trim() || undefined,
        imageBase64: uploadedImage,
        subjectDescription: sceneDescription,
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

  // Main image generation function - simpler, more creative
  const handleGenerateImage = async (styleOverride?: IllustrationStyle) => {
    const styleToUse = styleOverride || selectedStyle;
    const customToUse = styleOverride ? undefined : customStyleText.trim();
    
    if (!styleToUse && !customToUse) {
      toast.error("Please select a style");
      return;
    }
    if (!uploadedImage && !sceneDescription.trim()) {
      toast.error("Upload a photo or describe what you want");
      return;
    }

    setIsGeneratingImage(true);
    setGeneratedImageUrl(null);
    if (styleOverride) setApplyingStyleId(styleOverride.id);
    
    try {
      const prompt = buildCreativePrompt(styleToUse, customToUse);
      setGeneratedPrompt(prompt);
      
      // Generate the image
      const { data, error } = await supabase.functions.invoke("generate-ai-image", {
        body: { 
          prompt, 
          editMode: !!uploadedImage,
          sourceImageBase64: uploadedImage,
        },
      });

      if (error) throw error;
      if (data?.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        // Auto-save to gallery
        const thumbnail = uploadedImage?.substring(0, 500);
        addToGallery(data.imageUrl, prompt, styleToUse?.name || customToUse || "Custom", thumbnail);
        toast.success("Image created!");
      } else {
        throw new Error("No image returned");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      if (isRateLimitError(error)) {
        handleRateLimitError();
      } else {
        toast.error(error instanceof Error ? error.message : "Failed to generate image");
      }
    } finally {
      setIsGeneratingImage(false);
      setApplyingStyleId(null);
    }
  };

  const handleQuickApply = async (styleId: string) => {
    const style = ILLUSTRATION_STYLES.find(s => s.id === styleId);
    if (!style) return;
    
    if (!uploadedImage) {
      toast.error("Please upload a photo first");
      return;
    }

    setSelectedStyle(style);
    handleGenerateImage(style);
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

  // Trigger pending quick apply from Library navigation
  useEffect(() => {
    if (pendingQuickApplyStyle && uploadedImage) {
      handleQuickApply(pendingQuickApplyStyle);
      setPendingQuickApplyStyle(null);
    }
  }, [pendingQuickApplyStyle, uploadedImage]);

  const canGenerate = (selectedStyle || customStyleText.trim()) && (uploadedImage || sceneDescription.trim());

  return (
    <>
    <div className="pb-8 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Simple Flow */}
          <div className="space-y-5">
            {/* Step 1: Photo Upload */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-border/50">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Upload className="w-4 h-4 text-primary" />
                  1. Your Photo
                  <span className="text-muted-foreground text-xs font-normal">optional</span>
                </label>
              </div>
              
              {/* Favorite Photos - shown first for quick access */}
              <div className="p-3 bg-gradient-to-r from-rose-50/50 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/20 border-b border-border/50">
                <FavoritePhotosPicker
                  currentImage={uploadedImage}
                  onSelectPhoto={(img) => {
                    setUploadedImage(img);
                    toast.success("Photo selected!");
                  }}
                />
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
                      Drag & drop, paste, or
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
                    <span className="text-xs font-medium text-muted-foreground">One-tap styles</span>
                    {applyingStyleId && (
                      <span className="text-[10px] text-purple-500 animate-pulse">creating...</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_STYLES.map((styleId) => {
                      const style = ILLUSTRATION_STYLES.find(s => s.id === styleId);
                      if (!style) return null;
                      const isThisApplying = applyingStyleId === styleId;
                      return (
                        <button
                          key={styleId}
                          onClick={() => handleQuickApply(styleId)}
                          disabled={isGenerating || isGeneratingImage}
                          className={cn(
                            "px-2.5 py-1 text-xs rounded-full border transition-all flex items-center gap-1",
                            isThisApplying
                              ? "bg-purple-200 dark:bg-purple-800/50 border-purple-500 text-purple-800 dark:text-purple-200"
                              : selectedStyle?.id === styleId
                                ? "bg-purple-100 dark:bg-purple-900/30 border-purple-400 text-purple-700 dark:text-purple-300"
                                : "bg-card border-border hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 text-foreground"
                          )}
                        >
                          {isThisApplying && (
                            <div className="w-3 h-3 border-2 border-purple-400 border-t-purple-700 rounded-full animate-spin" />
                          )}
                          {style.name.split(' ')[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Generated Images Gallery */}
              <GeneratedImagesGallery
                images={galleryImages}
                isLoading={galleryLoading}
                onDelete={deleteFromGallery}
                onSelect={(url) => {
                  setGeneratedImageUrl(url);
                  toast.success("Image loaded from gallery!");
                }}
              />
            </Card>

            {/* Step 2: Describe what you want */}
            <Card className="p-5">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                2. Describe what you want
                {!uploadedImage && <span className="text-rose-500 text-xs">required</span>}
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                {uploadedImage 
                  ? "Describe a scene, scenario, or look for this person"
                  : "Describe the image you want to create"
                }
              </p>
              <textarea
                value={sceneDescription}
                onChange={(e) => setSceneDescription(e.target.value)}
                placeholder={uploadedImage 
                  ? "e.g., as a superhero flying over a city, professional headshot in a modern office, portrait in a cozy coffee shop..."
                  : "e.g., a wise owl wearing glasses reading a book, a sunset over mountains..."
                }
                rows={3}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
            </Card>

            {/* Step 3: Pick a Style */}
            <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className="text-sm font-medium text-foreground">3. Pick a Style</span>
              </div>
              <StyleSelector
                selectedStyle={selectedStyle}
                onSelectStyle={setSelectedStyle}
                customStyleText={customStyleText}
                onCustomStyleChange={setCustomStyleText}
              />
            </div>

            {/* Optional: Brand */}
            <BrandSelector
              selectedBrand={selectedBrand}
              onSelectBrand={setSelectedBrand}
              customBrandText={customBrandText}
              onCustomBrandChange={setCustomBrandText}
              selectedPresetId={selectedBrandPresetId}
              onSelectPreset={setSelectedBrandPresetId}
            />

            {/* Generate Button - Primary CTA */}
            <div className="space-y-3">
              <Button
                variant="hero"
                size="lg"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                disabled={!canGenerate || isGenerating || isGeneratingImage}
                onClick={() => handleGenerateImage()}
              >
                {isGeneratingImage ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating Image...
                  </>
                ) : (
                  <>
                    <ImagePlus className="w-4 h-4" />
                    Generate Image
                  </>
                )}
              </Button>
              
              {/* Secondary: Generate Prompt Only */}
              <Button
                variant="outline"
                size="sm"
                className="w-full text-muted-foreground"
                disabled={!canGenerate || isGenerating || isGeneratingImage}
                onClick={handleGenerate}
              >
                {isGenerating ? (
                  <>
                    <div className="w-3 h-3 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3 h-3" />
                    Just get the prompt
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Column - Result */}
          <div className="space-y-5">
            {/* Generated Image / Prompt */}
            <Card className="h-full flex flex-col">
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Result
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
                    {/* Show generated image */}
                    {generatedImageUrl && (
                      <div className="rounded-lg overflow-hidden border border-border relative group">
                        <img
                          src={generatedImageUrl}
                          alt="Generated"
                          className="w-full h-auto"
                        />
                        {/* Image action buttons overlay */}
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="secondary"
                            size="icon-sm"
                            className="bg-background/90 backdrop-blur-sm shadow-md"
                            onClick={async () => {
                              try {
                                const response = await fetch(generatedImageUrl);
                                const blob = await response.blob();
                                await navigator.clipboard.write([
                                  new ClipboardItem({ [blob.type]: blob })
                                ]);
                                toast.success("Image copied to clipboard!");
                              } catch (err) {
                                // Fallback: copy URL if image copy fails
                                await navigator.clipboard.writeText(generatedImageUrl);
                                toast.success("Image URL copied!");
                              }
                            }}
                            title="Copy image"
                          >
                            <Clipboard className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="icon-sm"
                            className="bg-background/90 backdrop-blur-sm shadow-md"
                            onClick={async () => {
                              try {
                                const response = await fetch(generatedImageUrl);
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `generated-image-${Date.now()}.png`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                window.URL.revokeObjectURL(url);
                                toast.success("Image downloaded!");
                              } catch (err) {
                                toast.error("Failed to download image");
                              }
                            }}
                            title="Download image"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Show prompt (collapsible when image exists) */}
                    {generatedPrompt && (
                      <details className={generatedImageUrl ? "text-sm" : ""} open={!generatedImageUrl}>
                        <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground mb-2">
                          {generatedImageUrl ? "View prompt" : "Generated Prompt"}
                        </summary>
                        <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed bg-card p-4 rounded-lg border border-border max-h-48 overflow-y-auto">
                          {generatedPrompt}
                        </pre>
                      </details>
                    )}
                    
                    {/* Generate Image from prompt if we only have prompt */}
                    {!generatedImageUrl && generatedPrompt && (
                      <GeneratedImageDisplay prompt={generatedPrompt} type="image" />
                    )}
                    
                    {/* External tools */}
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2">
                        Use prompt in other tools:
                      </p>
                      <AIToolLinks type="image" />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center py-12">
                    <div>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                        <ImagePlus className="w-8 h-8 text-purple-400" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        Your image will appear here
                      </p>
                      <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                        {uploadedImage 
                          ? "Pick a style and hit Generate, or describe a scene first"
                          : "Upload a photo or describe what you want, then pick a style"
                        }
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
    <FreeLimitModal open={showLimitModal} onOpenChange={setShowLimitModal} />
    </>
  );
}
