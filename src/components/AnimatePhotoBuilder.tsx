import { useState, useCallback, useEffect } from "react";
import { Play, Upload, Copy, Check, X, Wand2, Clipboard, Sparkles, Image, ArrowRight, Zap, Film } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AIToolLinks } from "./AIToolLinks";
import { FavoritePhotosPicker } from "./FavoritePhotosPicker";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

// Motion style presets
const MOTION_PRESETS = [
  { id: "subtle", name: "Subtle Movement", icon: "🌊", description: "Gentle, barely perceptible motion", prompt: "very subtle, gentle movement, minimal motion, ambient feel" },
  { id: "portrait", name: "Portrait Animation", icon: "👤", description: "Natural head/face movements", prompt: "subtle head turn, gentle eye movement, natural blink, soft breathing motion" },
  { id: "cinematic", name: "Cinematic", icon: "🎬", description: "Slow dramatic camera movement", prompt: "slow cinematic pan, dramatic lighting shift, professional film quality" },
  { id: "dynamic", name: "Dynamic Action", icon: "⚡", description: "More pronounced movement", prompt: "dynamic movement, energetic action, noticeable motion" },
  { id: "zoom", name: "Zoom Effect", icon: "🔍", description: "Gradual zoom in/out", prompt: "slow zoom in, focus pull, depth of field shift" },
  { id: "parallax", name: "Parallax/3D", icon: "🎭", description: "Depth and parallax effect", prompt: "subtle parallax movement, 3D depth effect, layers moving at different speeds" },
];

interface AnimatePhotoBuilderProps {
  onSwitchToVideo?: () => void;
}

export function AnimatePhotoBuilder({ onSwitchToVideo }: AnimatePhotoBuilderProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customMotion, setCustomMotion] = useState("");
  const [motionDescription, setMotionDescription] = useState("");
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
      setGeneratedPrompt("");
      toast.success("Image uploaded!");
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
        if (file) handleImageUpload(file);
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

  const clearImage = () => {
    setUploadedImage(null);
    setGeneratedPrompt("");
  };

  const getPresetPrompt = () => {
    const preset = MOTION_PRESETS.find(p => p.id === selectedPreset);
    return preset?.prompt || "";
  };

  const handleGenerate = async () => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-motion-prompt", {
        body: {
          imageBase64: uploadedImage,
          motionPreset: getPresetPrompt(),
          customMotion: customMotion.trim(),
          motionDescription: motionDescription.trim(),
        },
      });

      if (error) throw error;
      if (data?.prompt) {
        setGeneratedPrompt(data.prompt);
        toast.success("Motion prompt generated!");
      } else {
        throw new Error("No prompt returned");
      }
    } catch (error) {
      console.error("Error generating motion prompt:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate motion prompt");
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

  return (
    <div className="pb-8 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Upload & Settings */}
          <div className="space-y-5">
            {/* Image Upload */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-border/50">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Image className="w-4 h-4 text-blue-500" />
                  Your Photo to Animate
                  <span className="text-rose-500 text-xs">required</span>
                </label>
              </div>
              
              {!uploadedImage ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`p-6 transition-all ${
                    isDragging 
                      ? "bg-blue-50 dark:bg-blue-950/20 border-2 border-dashed border-blue-300" 
                      : "bg-muted/50"
                  }`}
                >
                  <div className="text-center">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                      <Film className="w-7 h-7 text-blue-500" />
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
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      Ready to animate
                    </div>
                  </div>
                </div>
              )}
              
              {/* Favorite Photos */}
              <div className="p-3 border-t border-border/50">
                <FavoritePhotosPicker
                  currentImage={uploadedImage}
                  onSelectPhoto={(img) => {
                    setUploadedImage(img);
                    setGeneratedPrompt("");
                    toast.success("Photo selected!");
                  }}
                />
              </div>
            </Card>

            {/* Motion Style Presets */}
            <Card className="p-5">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                <Zap className="w-4 h-4 text-blue-500" />
                Motion Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {MOTION_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPreset(selectedPreset === preset.id ? null : preset.id)}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all",
                      selectedPreset === preset.id
                        ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30"
                        : "border-border hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{preset.icon}</span>
                      <span className={cn(
                        "text-sm font-medium",
                        selectedPreset === preset.id ? "text-blue-700 dark:text-blue-300" : "text-foreground"
                      )}>
                        {preset.name}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-7">
                      {preset.description}
                    </p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Motion Description */}
            <Card className="p-5">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                <Play className="w-4 h-4 text-blue-500" />
                Describe the Motion
                <span className="text-muted-foreground text-xs font-normal">optional</span>
              </label>
              <textarea
                value={motionDescription}
                onChange={(e) => setMotionDescription(e.target.value)}
                placeholder="Describe what should move... e.g., 'The person slowly turns their head to the right and smiles' or 'Clouds drift across the sky while leaves rustle'"
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Be specific about what moves and how - Sora/Veo work best with clear motion descriptions
              </p>
            </Card>

            {/* Additional Style Notes */}
            <Card className="p-5">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Style & Quality Notes
                <span className="text-muted-foreground text-xs font-normal">optional</span>
              </label>
              <input
                type="text"
                value={customMotion}
                onChange={(e) => setCustomMotion(e.target.value)}
                placeholder="e.g., cinematic quality, smooth motion, realistic lighting"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </Card>

            {/* Generate Button */}
            <Button
              variant="hero"
              size="xl"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              disabled={!uploadedImage || isGenerating}
              onClick={handleGenerate}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Generating Motion Prompt...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Animation Prompt
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
                  <Play className="w-4 h-4 text-blue-500" />
                  Motion Prompt for Your Image
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
                {generatedPrompt ? (
                  <div className="space-y-4">
                    <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed bg-card p-4 rounded-lg border border-border max-h-64 overflow-y-auto">
                      {generatedPrompt}
                    </pre>
                    
                    {/* Instructions */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" />
                        How to use this prompt:
                      </p>
                      <ol className="text-xs text-blue-600 dark:text-blue-400 space-y-1 list-decimal list-inside">
                        <li>Open Sora, Veo, or your preferred image-to-video tool</li>
                        <li>Upload your image (the same one you used here)</li>
                        <li>Paste this motion prompt in the description field</li>
                        <li>Generate your animated video!</li>
                      </ol>
                    </div>
                    
                    {/* Tool Links */}
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2">Copy prompt and use in:</p>
                      <AIToolLinks type="video" />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                        <Play className="w-8 h-8 text-blue-400" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your animation prompt will appear here
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        Upload a photo and describe the motion
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Tips Card */}
            <Card className="p-4 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900 dark:to-blue-950/20">
              <h3 className="font-medium text-foreground flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Tips for Best Results
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Use high-quality, well-lit photos for best animation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Simple backgrounds animate more reliably than busy scenes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Keep motion subtle for realistic results - less is often more</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>For portraits, focus on natural movements like head turns or smiles</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
