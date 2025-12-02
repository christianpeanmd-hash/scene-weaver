import { useState, useCallback, useEffect } from "react";
import { Image, Sparkles, Upload, Copy, Check, X, Wand2, Clipboard, ImagePlus, Zap, Download, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { StyleSelector } from "./StyleSelector";
import { BrandSelector, getBrandContextFromPreset } from "./BrandSelector";
import { AIToolLinks } from "./AIToolLinks";
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
  const [sceneDescription, setSceneDescription] = useState("");
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
  const [showStyleOptions, setShowStyleOptions] = useState(false);
  const [showBrandOptions, setShowBrandOptions] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  
  const { showLimitModal, setShowLimitModal, handleRateLimitError } = useUsageLimit();
  const { images: galleryImages, isLoading: galleryLoading, addImage: addToGallery, deleteImage: deleteFromGallery } = useGeneratedImagesGallery();

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

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

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

  const buildCreativePrompt = (style: IllustrationStyle | null, customStyle: string | undefined) => {
    const styleName = style?.name || "custom style";
    const styleLook = style?.look || customStyle || "";
    const brandContext = getBrandContext();
    
    let prompt = "";
    
    if (uploadedImage) {
      if (sceneDescription.trim()) {
        prompt = `Using the person from this photo as your subject reference, create: ${sceneDescription.trim()}. 

Render in ${styleName} style: ${styleLook}

Keep the person recognizable but feel free to change their pose, expression, clothing, and setting to match the described scene. The goal is a creative, styled image of this person in the new scenario.`;
      } else {
        prompt = `Transform this person into a ${styleName} artwork. 

Style: ${styleLook}

Create an artistic, visually striking image. You can adjust the pose, setting, and background to best showcase the style while keeping the person recognizable.`;
      }
    } else {
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
      setShowPrompt(true);
      toast.success("Prompt generated!");
    } catch (error) {
      console.error("Error generating prompt:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate prompt");
    } finally {
      setIsGenerating(false);
    }
  };

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

  const handleCopyImage = async () => {
    if (!generatedImageUrl) return;
    try {
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      toast.success("Image copied to clipboard!");
    } catch {
      toast.error("Failed to copy image");
    }
  };

  const handleDownloadImage = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement("a");
    link.href = generatedImageUrl;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  const clearImage = () => {
    setUploadedImage(null);
    setGeneratedPrompt("");
    setGeneratedImageUrl(null);
  };

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
        <div className="max-w-2xl mx-auto px-4">
          {/* Generated Output - Front and Center */}
          {generatedImageUrl && (
            <Card className="mb-6 overflow-hidden">
              <div className="relative group">
                <img
                  src={generatedImageUrl}
                  alt="Generated"
                  className="w-full rounded-t-lg"
                />
                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleCopyImage}
                    className="bg-white/90 hover:bg-white"
                  >
                    <Copy className="w-4 h-4 mr-1.5" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleDownloadImage}
                    className="bg-white/90 hover:bg-white"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setGeneratedImageUrl(null)}
                    className="bg-white/90 hover:bg-white text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Prompt preview */}
              {generatedPrompt && (
                <Collapsible open={showPrompt} onOpenChange={setShowPrompt}>
                  <CollapsibleTrigger className="w-full p-3 flex items-center justify-between text-sm text-muted-foreground hover:bg-muted/50 transition-colors border-t border-border/50">
                    <span>View prompt</span>
                    {showPrompt ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-3 pt-0 space-y-2">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{generatedPrompt}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={handleCopy}>
                          {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                          {copied ? "Copied" : "Copy prompt"}
                        </Button>
                        <AIToolLinks type="image" />
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </Card>
          )}

          {/* Generating State */}
          {isGeneratingImage && !generatedImageUrl && (
            <Card className="mb-6 p-12 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-3 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground">Creating your image...</p>
            </Card>
          )}

          {/* Input Section */}
          <Card className="overflow-hidden">
            {/* Inline Upload Zone + Saved Photos */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                "p-4 border-b border-border/50 transition-all",
                isDragging && "bg-primary/5 ring-2 ring-primary/20 ring-inset"
              )}
            >
              {uploadedImage ? (
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <img
                      src={uploadedImage}
                      alt="Your photo"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute -top-1.5 -right-1.5 p-1 bg-background border border-border rounded-full hover:bg-muted transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground mb-2">Photo ready</p>
                    {/* Quick styles */}
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_STYLES.slice(0, 4).map((styleId) => {
                        const style = ILLUSTRATION_STYLES.find(s => s.id === styleId);
                        if (!style) return null;
                        const isApplying = applyingStyleId === styleId;
                        return (
                          <button
                            key={styleId}
                            onClick={() => handleQuickApply(styleId)}
                            disabled={isGenerating || isGeneratingImage}
                            className={cn(
                              "px-2 py-1 text-xs rounded-full border transition-all flex items-center gap-1",
                              isApplying
                                ? "bg-primary/20 border-primary text-primary"
                                : "bg-muted/50 border-border hover:border-primary/50 text-foreground"
                            )}
                          >
                            {isApplying && <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />}
                            {style.name.split(' ')[0]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 hover:bg-muted rounded-lg cursor-pointer transition-colors border border-dashed border-border hover:border-primary/50">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Upload photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-muted-foreground">or paste (⌘V)</span>
                  <FavoritePhotosPicker
                    currentImage={uploadedImage}
                    onSelectPhoto={(img) => {
                      setUploadedImage(img);
                      toast.success("Photo selected!");
                    }}
                  />
                </div>
              )}
            </div>

            {/* Description Input */}
            <div className="p-4 border-b border-border/50">
              <textarea
                value={sceneDescription}
                onChange={(e) => setSceneDescription(e.target.value)}
                placeholder={uploadedImage 
                  ? "Describe the scene... e.g., 'as a superhero flying over a city' or leave blank to just stylize"
                  : "Describe what you want to create..."
                }
                rows={2}
                className="w-full bg-transparent text-foreground placeholder-muted-foreground focus:outline-none resize-none text-sm"
              />
            </div>

            {/* Style Selection - Compact */}
            <Collapsible open={showStyleOptions} onOpenChange={setShowStyleOptions}>
              <CollapsibleTrigger className="w-full p-3 flex items-center justify-between text-sm hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="font-medium">
                    {selectedStyle ? selectedStyle.name : customStyleText ? "Custom style" : "Select style"}
                  </span>
                </div>
                {showStyleOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-0 border-t border-border/50">
                  <StyleSelector
                    selectedStyle={selectedStyle}
                    onSelectStyle={setSelectedStyle}
                    customStyleText={customStyleText}
                    onCustomStyleChange={setCustomStyleText}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Brand Selection - Compact */}
            <Collapsible open={showBrandOptions} onOpenChange={setShowBrandOptions}>
              <CollapsibleTrigger className="w-full p-3 flex items-center justify-between text-sm hover:bg-muted/30 transition-colors border-t border-border/50">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-primary" />
                  <span className="font-medium">
                    {selectedBrand?.name || selectedBrandPresetId || customBrandText ? "Brand selected" : "Brand (optional)"}
                  </span>
                </div>
                {showBrandOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-0 border-t border-border/50">
                  <BrandSelector
                    selectedBrand={selectedBrand}
                    onSelectBrand={setSelectedBrand}
                    customBrandText={customBrandText}
                    onCustomBrandChange={setCustomBrandText}
                    selectedPresetId={selectedBrandPresetId}
                    onSelectPreset={setSelectedBrandPresetId}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Generate Button */}
            <div className="p-4 flex gap-2 border-t border-border/50 bg-muted/30">
              <Button
                className="flex-1"
                size="lg"
                disabled={!canGenerate || isGenerating || isGeneratingImage}
                onClick={() => handleGenerateImage()}
              >
                {isGeneratingImage ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                disabled={!canGenerate || isGenerating || isGeneratingImage}
                onClick={handleGenerate}
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </Card>

          {/* Gallery - Below the main interface */}
          <div className="mt-6">
            <GeneratedImagesGallery
              images={galleryImages}
              isLoading={galleryLoading}
              onDelete={deleteFromGallery}
              onSelect={(url) => {
                setGeneratedImageUrl(url);
                toast.success("Image loaded from gallery!");
              }}
            />
          </div>
        </div>
      </div>

      <FreeLimitModal
        open={showLimitModal}
        onOpenChange={setShowLimitModal}
      />
    </>
  );
}
