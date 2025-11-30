import { useState, useCallback } from "react";
import { FileText, Sparkles, Upload, Copy, Check, X, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AIToolLinks } from "./AIToolLinks";
import { InfographicStyleSelector } from "./InfographicStyleSelector";
import { BrandSelector } from "./BrandSelector";
import { INFOGRAPHIC_STYLES, InfographicStyle } from "@/data/infographic-styles";
import { Brand } from "@/hooks/useBrandLibrary";
import { supabase } from "@/integrations/supabase/client";

export function InfographicPromptBuilder() {
  const [uploadedDocument, setUploadedDocument] = useState<{ name: string; content: string } | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<InfographicStyle | null>(null);
  const [topicDescription, setTopicDescription] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [customBrandText, setCustomBrandText] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDocumentUpload = useCallback(async (file: File) => {
    const validTypes = [
      'application/pdf',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/markdown',
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
      toast.error("Please upload a PDF, Word doc, or text file");
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
  }, []);

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

  const handleGenerate = async () => {
    if (!selectedStyle) {
      toast.error("Please select an infographic style");
      return;
    }

    if (!topicDescription.trim() && !uploadedDocument) {
      toast.error("Please describe your topic or upload a document");
      return;
    }

    setIsGenerating(true);
    try {
      const brandContext = selectedBrand 
        ? `Brand: ${selectedBrand.name}. ${selectedBrand.description}${selectedBrand.colors?.length ? ` Colors: ${selectedBrand.colors.join(', ')}.` : ''}${selectedBrand.fonts ? ` Typography: ${selectedBrand.fonts}.` : ''}`
        : customBrandText.trim() || undefined;

      const { data, error } = await supabase.functions.invoke('generate-image-prompt', {
        body: {
          type: 'infographic',
          styleId: selectedStyle.id,
          styleName: selectedStyle.name,
          stylePromptTemplate: selectedStyle.promptTemplate,
          topic: topicDescription,
          documentContent: uploadedDocument?.content,
          brandContext,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setGeneratedPrompt(data.prompt);
      toast.success("Infographic prompt generated!");
    } catch (error) {
      console.error("Error generating prompt:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate prompt");
    } finally {
      setIsGenerating(false);
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

  return (
    <div className="pb-8 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Upload & Style */}
          <div className="space-y-5">
            {/* Document Upload */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-border/50">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Upload className="w-4 h-4 text-amber-500" />
                  Source Document
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
                      ? "bg-amber-50 border-2 border-dashed border-amber-300" 
                      : "bg-slate-50"
                  }`}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-amber-500" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Drop a PDF, Word doc, or text file
                    </p>
                    <label className="cursor-pointer">
                      <span className="px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium text-foreground hover:bg-slate-50 transition-colors">
                        Browse Files
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.md"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-muted-foreground mt-3">
                      Or describe your topic manually below
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50">
                  <div className="relative flex items-center gap-3 p-3 bg-white rounded-lg border border-border">
                    <FileText className="w-8 h-8 text-amber-500" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{uploadedDocument.name}</p>
                      <p className="text-xs text-muted-foreground">Document uploaded</p>
                    </div>
                    <button
                      onClick={clearDocument}
                      className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
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
            />

            {/* Brand Selector */}
            <BrandSelector
              selectedBrand={selectedBrand}
              onSelectBrand={setSelectedBrand}
              customBrandText={customBrandText}
              onCustomBrandChange={setCustomBrandText}
            />

            {/* Generate Button */}
            <Button
              variant="hero"
              size="xl"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              disabled={(!uploadedDocument && !topicDescription.trim()) || !selectedStyle || isGenerating}
              onClick={handleGenerate}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin-slow" />
                  Generating Prompt...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Infographic Prompt
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Result */}
          <div className="space-y-5">
            {/* Generated Prompt */}
            <Card className="h-full flex flex-col">
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Generated Prompt
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
              
              <div className="flex-1 p-4 bg-slate-50">
                {generatedPrompt ? (
                  <div className="space-y-4">
                    <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed bg-white p-4 rounded-lg border border-border">
                      {generatedPrompt}
                    </pre>
                    <AIToolLinks type="infographic" />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your infographic prompt will appear here
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
  );
}
