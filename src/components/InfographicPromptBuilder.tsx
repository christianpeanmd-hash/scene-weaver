import { useState, useCallback, useEffect } from "react";
import { FileText, Sparkles, Upload, Copy, Check, X, Wand2, Image, Clipboard, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AIToolLinks } from "./AIToolLinks";
import { InfographicStyleSelector } from "./InfographicStyleSelector";
import { BrandSelector, BRAND_STYLE_PRESETS, getBrandContextFromPreset } from "./BrandSelector";
import { GeneratedImageDisplay } from "./GeneratedImageDisplay";
import { FreeLimitModal } from "./FreeLimitModal";
import { INFOGRAPHIC_STYLES, InfographicStyle } from "@/data/infographic-styles";
import { Brand } from "@/hooks/useBrandLibrary";
import { supabase } from "@/integrations/supabase/client";
import { useUsageLimit } from "@/hooks/useUsageLimit";

export function InfographicPromptBuilder() {
  const [uploadedDocument, setUploadedDocument] = useState<{ name: string; content: string } | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<InfographicStyle | null>(null);
  const [customStyleText, setCustomStyleText] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [customBrandText, setCustomBrandText] = useState("");
  const [selectedBrandPresetId, setSelectedBrandPresetId] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const { showLimitModal, setShowLimitModal, handleRateLimitError } = useUsageLimit();

  // Handle image upload
  const handleImageUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      return false;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      toast.success("Image uploaded!");
    };
    reader.readAsDataURL(file);
    return true;
  }, []);

  const handleDocumentUpload = useCallback(async (file: File) => {
    // Check if it's an image first
    if (file.type.startsWith("image/")) {
      handleImageUpload(file);
      return;
    }

    const validTypes = [
      'application/pdf',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/markdown',
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
      toast.error("Please upload a PDF, Word doc, text file, or image");
      return;
    }

    // For now, we'll extract text from text files directly
    if (file.type === 'text/plain' || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      const text = await file.text();
      setUploadedDocument({ name: file.name, content: text });
      toast.success("Document uploaded!");
    } else {
      // For PDFs/docs, store the file name and a placeholder
      setUploadedDocument({ name: file.name, content: `[Content from: ${file.name}]` });
      toast.success("Document uploaded! Describe what it contains in the topic field.");
    }
  }, [handleImageUpload]);

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
    if (file) handleDocumentUpload(file);
  }, [handleDocumentUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleDocumentUpload(file);
  }, [handleDocumentUpload]);

  const generatePrompt = async (): Promise<string | null> => {
    if (!selectedStyle && !customStyleText.trim()) {
      toast.error("Please select an infographic style or describe a custom style");
      return null;
    }

    if (!topicDescription.trim() && !uploadedDocument) {
      toast.error("Please describe your topic or upload a document");
      return null;
    }

    // Get brand context from preset, saved brand, or custom text
    const brandContext = getBrandContextFromPreset(selectedBrandPresetId)
      || (selectedBrand 
        ? `Brand: ${selectedBrand.name}. ${selectedBrand.description}${selectedBrand.colors?.length ? ` Colors: ${selectedBrand.colors.join(', ')}.` : ''}${selectedBrand.fonts ? ` Typography: ${selectedBrand.fonts}.` : ''}`
        : customBrandText.trim() || undefined);

    const { data, error } = await supabase.functions.invoke('generate-image-prompt', {
      body: {
        type: 'infographic',
        styleId: selectedStyle?.id || 'custom',
        styleName: selectedStyle?.name || 'Custom Style',
        stylePromptTemplate: selectedStyle?.promptTemplate || customStyleText,
        customStyleDescription: customStyleText || undefined,
        topic: topicDescription,
        documentContent: uploadedDocument?.content,
        brandContext,
      },
    });

    if (error) throw error;
    if (data?.error) throw new Error(data.error);

    return data.prompt;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedImageUrl(null);
    try {
      const prompt = await generatePrompt();
      if (prompt) {
        setGeneratedPrompt(prompt);
        toast.success("Infographic prompt generated!");
      }
    } catch (error) {
      console.error("Error generating prompt:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate prompt");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImageDirectly = async () => {
    setIsGeneratingImage(true);
    setGeneratedImageUrl(null);
    try {
      // First generate the prompt if we don't have one
      let prompt = generatedPrompt;
      if (!prompt) {
        prompt = await generatePrompt() || "";
        if (prompt) {
          setGeneratedPrompt(prompt);
        }
      }
      
      if (!prompt) {
        setIsGeneratingImage(false);
        return;
      }

      // Now generate the image
      const { data, error } = await supabase.functions.invoke("generate-ai-image", {
        body: { prompt, type: "infographic" },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        toast.success("Infographic generated!");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate image");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const clearDocument = () => {
    setUploadedDocument(null);
    setGeneratedPrompt("");
  };

  const clearImage = () => {
    setUploadedImage(null);
  };

  return (
    <>
    <div className="pb-8 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Upload & Style */}
          <div className="space-y-5">
            {/* Image Upload (for reference images) */}
            {uploadedImage ? (
              <Card className="overflow-hidden">
                <div className="p-4 border-b border-border/50">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Image className="w-4 h-4 text-amber-500" />
                    Reference Image
                  </label>
                </div>
                <div className="p-4 bg-muted/30">
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Reference"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </Card>
            ) : null}

            {/* Document Upload */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-border/50">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Upload className="w-4 h-4 text-amber-500" />
                  Source Document or Image
                  <span className="text-muted-foreground text-xs font-normal">optional</span>
                </label>
              </div>
              
              {!uploadedDocument ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`p-8 transition-all ${
                    isDragging 
                      ? "bg-amber-50 dark:bg-amber-950/20 border-2 border-dashed border-amber-300" 
                      : "bg-muted/30"
                  }`}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-amber-500" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Drop a document, image, or paste from clipboard
                    </p>
                    <label className="cursor-pointer">
                      <span className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
                        Browse Files
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.md,image/*"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                    </label>
                    <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
                      <Clipboard className="w-3 h-3" />
                      <span>Ctrl/Cmd+V to paste screenshots</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-muted/30">
                  <div className="relative flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                    <FileText className="w-8 h-8 text-amber-500" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{uploadedDocument.name}</p>
                      <p className="text-xs text-muted-foreground">Document uploaded</p>
                    </div>
                    <button
                      onClick={clearDocument}
                      className="p-1.5 hover:bg-muted rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              )}
            </Card>

            {/* Topic Description */}
            <Card className="p-5">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Topic / Focus
                {!uploadedDocument && <span className="text-rose-500 text-xs">required</span>}
              </label>
              <textarea
                value={topicDescription}
                onChange={(e) => setTopicDescription(e.target.value)}
                placeholder={uploadedDocument 
                  ? "Refine the focus... e.g., key takeaways, specific section, main argument" 
                  : "What should the infographic explain? e.g., How transformer LLMs work, The water cycle, 5 steps to better sleep"
                }
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all resize-none"
              />
            </Card>

            {/* Style Selector */}
            <InfographicStyleSelector
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
              selectedPresetId={selectedBrandPresetId}
              onSelectPreset={setSelectedBrandPresetId}
            />

            {/* Generate Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="hero"
                size="xl"
                className="flex-1 min-w-0 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                disabled={(!uploadedDocument && !topicDescription.trim()) || (!selectedStyle && !customStyleText.trim()) || isGenerating || isGeneratingImage}
                onClick={handleGenerate}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin-slow" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Prompt
                  </>
                )}
              </Button>
              <Button
                variant="hero"
                size="xl"
                className="flex-1 min-w-0 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                disabled={(!uploadedDocument && !topicDescription.trim()) || (!selectedStyle && !customStyleText.trim()) || isGenerating || isGeneratingImage}
                onClick={handleGenerateImageDirectly}
              >
                {isGeneratingImage ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin-slow" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImagePlus className="w-5 h-5" />
                    Generate Image
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Column - Result */}
          <div className="space-y-5">
            {/* Generated Prompt/Image */}
            <Card className="h-full flex flex-col">
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Sparkles className="w-4 h-4 text-amber-500" />
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
                {generatedImageUrl ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={generatedImageUrl}
                        alt="Generated infographic"
                        className="w-full rounded-lg border border-border"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                        onClick={() => setGeneratedImageUrl(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {generatedPrompt && (
                      <details className="text-sm">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                          View prompt used
                        </summary>
                        <pre className="mt-2 text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed bg-card p-3 rounded-lg border border-border max-h-32 overflow-y-auto">
                          {generatedPrompt}
                        </pre>
                      </details>
                    )}
                    
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2">Use prompt in other tools:</p>
                      <AIToolLinks type="infographic" />
                    </div>
                  </div>
                ) : generatedPrompt ? (
                  <div className="space-y-4">
                    <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed bg-card p-4 rounded-lg border border-border max-h-48 overflow-y-auto">
                      {generatedPrompt}
                    </pre>
                    
                    {/* Generate Image Directly */}
                    <GeneratedImageDisplay prompt={generatedPrompt} type="infographic" />
                    
                    {/* Or Use External Tools */}
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2">Or copy prompt to use in:</p>
                      <AIToolLinks type="infographic" />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your infographic prompt or image will appear here
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        Select a style and click Generate
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Style Info */}
            {selectedStyle && (
              <Card className="p-4 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{selectedStyle.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{selectedStyle.description}</p>
                    <p className="text-xs text-amber-600 mt-2">Best for: {selectedStyle.useCase}</p>
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
