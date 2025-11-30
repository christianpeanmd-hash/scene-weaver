import { useState, useCallback } from "react";
import { Image, Sparkles, Upload, Copy, Check, X, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StyleSelector } from "./StyleSelector";
import { ILLUSTRATION_STYLES, IllustrationStyle } from "@/data/illustration-styles";
import { generateImagePrompt } from "@/lib/image-prompt-generator";

interface ImagePromptBuilderProps {
  onSwitchToVideo: () => void;
}

export function ImagePromptBuilder({ onSwitchToVideo }: ImagePromptBuilderProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<IllustrationStyle | null>(null);
  const [subjectDescription, setSubjectDescription] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
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
      toast.success("Image uploaded!");
    };
    reader.readAsDataURL(file);
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

  const handleGenerate = async () => {
    if (!selectedStyle) {
      toast.error("Please select a style first");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = await generateImagePrompt({
        style: selectedStyle,
        imageBase64: uploadedImage,
        subjectDescription,
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

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const clearImage = () => {
    setUploadedImage(null);
    setGeneratedPrompt("");
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
                  className={`p-8 transition-all ${
                    isDragging 
                      ? "bg-purple-50 border-2 border-dashed border-purple-300" 
                      : "bg-slate-50"
                  }`}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <Image className="w-8 h-8 text-purple-500" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Drag & drop a photo here, or
                    </p>
                    <label className="cursor-pointer">
                      <span className="px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium text-foreground hover:bg-slate-50 transition-colors">
                        Browse Files
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-muted-foreground mt-3">
                      Or skip this to describe your subject manually
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50">
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full h-48 object-cover rounded-lg"
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
            />

            {/* Generate Button */}
            <Button
              variant="hero"
              size="xl"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              disabled={(!uploadedImage && !subjectDescription.trim()) || !selectedStyle || isGenerating}
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
                  Generate Image Prompt
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
                  <Sparkles className="w-4 h-4 text-purple-500" />
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
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium mb-1">Use this prompt with:</p>
                      <div className="flex flex-wrap gap-2">
                        {["Midjourney", "DALL-E", "Stable Diffusion", "Firefly", "Ideogram"].map((tool) => (
                          <span key={tool} className="px-2 py-1 bg-white border border-border rounded text-xs">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your generated prompt will appear here
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
