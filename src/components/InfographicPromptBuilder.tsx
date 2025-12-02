import { useState, useCallback, useEffect } from "react";
import { FileText, Sparkles, Upload, Copy, Check, X, Wand2, Image, Clipboard, ImagePlus, ChevronDown, ChevronUp, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AIToolLinks } from "./AIToolLinks";
import { InfographicStyleSelector } from "./InfographicStyleSelector";
import { BrandSelector, getBrandContextFromPreset } from "./BrandSelector";
import { FreeLimitModal } from "./FreeLimitModal";
import { INFOGRAPHIC_STYLES, InfographicStyle } from "@/data/infographic-styles";
import { Brand } from "@/hooks/useBrandLibrary";
import { supabase } from "@/integrations/supabase/client";
import { useUsageLimit } from "@/hooks/useUsageLimit";
import { cn } from "@/lib/utils";

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
  const [showStyleOptions, setShowStyleOptions] = useState(false);
  const [showBrandOptions, setShowBrandOptions] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  
  const { showLimitModal, setShowLimitModal, handleRateLimitError } = useUsageLimit();

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

    if (file.type === 'text/plain' || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      const text = await file.text();
      setUploadedDocument({ name: file.name, content: text });
      toast.success("Document uploaded!");
    } else {
      setUploadedDocument({ name: file.name, content: `[Content from: ${file.name}]` });
      toast.success("Document uploaded! Describe what it contains in the topic field.");
    }
  }, [handleImageUpload]);

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
      toast.error("Please select an infographic style");
      return null;
    }

    if (!topicDescription.trim() && !uploadedDocument) {
      toast.error("Please describe your topic or upload a document");
      return null;
    }

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
        setShowPrompt(true);
        toast.success("Prompt generated!");
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
    toast.success("Copied!");
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
      toast.success("Image copied!");
    } catch {
      toast.error("Failed to copy image");
    }
  };

  const handleDownloadImage = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement("a");
    link.href = generatedImageUrl;
    link.download = `infographic-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloaded!");
  };

  const clearDocument = () => {
    setUploadedDocument(null);
    setGeneratedPrompt("");
  };

  const clearImage = () => {
    setUploadedImage(null);
  };

  const canGenerate = (selectedStyle || customStyleText.trim()) && (topicDescription.trim() || uploadedDocument);

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
                  alt="Generated infographic"
                  className="w-full rounded-t-lg"
                />
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
                </div>
              </div>
              
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
              <p className="text-muted-foreground">Creating your infographic...</p>
            </Card>
          )}

          {/* Input Section */}
          <Card className="overflow-hidden">
            {/* Inline Upload Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                "p-4 border-b border-border/50 transition-all",
                isDragging && "bg-primary/5 ring-2 ring-primary/20 ring-inset"
              )}
            >
              {uploadedDocument || uploadedImage ? (
                <div className="flex items-center gap-3">
                  {uploadedImage && (
                    <div className="relative flex-shrink-0">
                      <img
                        src={uploadedImage}
                        alt="Reference"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <button
                        onClick={clearImage}
                        className="absolute -top-1.5 -right-1.5 p-1 bg-background border border-border rounded-full hover:bg-muted transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {uploadedDocument && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg flex-1 min-w-0">
                      <FileText className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{uploadedDocument.name}</span>
                      <button
                        onClick={clearDocument}
                        className="p-1 hover:bg-muted rounded-full transition-colors ml-auto"
                      >
                        <X className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 hover:bg-muted rounded-lg cursor-pointer transition-colors border border-dashed border-border hover:border-primary/50">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Upload PDF, Word, or image</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.md,image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-muted-foreground">or paste (⌘V)</span>
                </div>
              )}
            </div>

            {/* Topic Input */}
            <div className="p-4 border-b border-border/50">
              <textarea
                value={topicDescription}
                onChange={(e) => setTopicDescription(e.target.value)}
                placeholder={uploadedDocument 
                  ? "What should the infographic focus on? e.g., 'key findings' or 'the main process flow'"
                  : "What should the infographic explain? e.g., 'How transformer LLMs work' or '5 steps to better sleep'"
                }
                rows={2}
                className="w-full bg-transparent text-foreground placeholder-muted-foreground focus:outline-none resize-none text-sm"
              />
            </div>

            {/* Style Selection - Compact */}
            <Collapsible open={showStyleOptions} onOpenChange={setShowStyleOptions}>
              <CollapsibleTrigger className="w-full p-3 flex items-center justify-between text-sm hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="font-medium">
                    {selectedStyle ? selectedStyle.name : customStyleText ? "Custom style" : "Select style"}
                  </span>
                </div>
                {showStyleOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-0 border-t border-border/50">
                  <InfographicStyleSelector
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
                  <Image className="w-4 h-4 text-amber-500" />
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

            {/* Generate Buttons */}
            <div className="p-4 flex gap-2 border-t border-border/50 bg-muted/30">
              <Button
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                size="lg"
                disabled={!canGenerate || isGenerating || isGeneratingImage}
                onClick={handleGenerateImageDirectly}
              >
                {isGeneratingImage ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Generate Infographic
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
        </div>
      </div>

      <FreeLimitModal
        open={showLimitModal}
        onOpenChange={setShowLimitModal}
      />
    </>
  );
}
