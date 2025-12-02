import { useState, useCallback, useEffect } from "react";
import { Play, Upload, Copy, Check, X, Wand2, Clipboard, Sparkles, Image, Film, Crown, Download, Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AIToolLinks } from "./AIToolLinks";
import { FavoritePhotosPicker } from "./FavoritePhotosPicker";
import { FreeLimitModal } from "./FreeLimitModal";
import { GeneratedImagesGallery } from "./GeneratedImagesGallery";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useVideoGeneration } from "@/hooks/useVideoGeneration";
import { useSubscription } from "@/hooks/useSubscription";
import { useUsageLimit } from "@/hooks/useUsageLimit";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Motion style presets organized by category
const MOTION_CATEGORIES = [
  {
    name: "Subtle",
    icon: "🌊",
    presets: [
      { id: "subtle", name: "Gentle Movement", description: "Barely perceptible ambient motion", prompt: "very subtle, gentle movement, minimal motion, ambient feel" },
      { id: "breathing", name: "Breathing", description: "Soft rise and fall motion", prompt: "subtle breathing motion, gentle chest rise and fall, peaceful ambient movement" },
      { id: "ambient", name: "Ambient Drift", description: "Slow floating particles", prompt: "ambient particle drift, dust motes floating in light, gentle atmospheric movement" },
    ]
  },
  {
    name: "Portrait",
    icon: "👤",
    presets: [
      { id: "portrait", name: "Natural Movement", description: "Head turns and blinks", prompt: "subtle head turn, gentle eye movement, natural blink, soft breathing motion" },
      { id: "smile", name: "Smile Animation", description: "Expression change to smile", prompt: "gradual smile forming, eyes lighting up, warm expression transition" },
      { id: "talking", name: "Talking Head", description: "Lip movement animation", prompt: "natural lip movement, subtle head nods, expressive facial animation, conversational gestures" },
    ]
  },
  {
    name: "Cinematic",
    icon: "🎬",
    presets: [
      { id: "cinematic", name: "Dramatic Pan", description: "Slow sweeping camera", prompt: "slow cinematic pan, dramatic lighting shift, professional film quality" },
      { id: "dolly", name: "Dolly Zoom", description: "Vertigo effect push", prompt: "dolly zoom effect, background expanding, dramatic perspective shift, Hitchcock vertigo" },
      { id: "reveal", name: "Dramatic Reveal", description: "Slow unveiling motion", prompt: "dramatic slow reveal, tension building camera move, cinematic unveiling" },
    ]
  },
  {
    name: "Dynamic",
    icon: "⚡",
    presets: [
      { id: "dynamic", name: "Action Motion", description: "Energetic movement", prompt: "dynamic movement, energetic action, noticeable motion" },
      { id: "explosion", name: "Burst Effect", description: "Outward energy burst", prompt: "explosive outward motion, particle burst effect, dynamic energy release" },
      { id: "speed", name: "Speed Lines", description: "Fast motion blur", prompt: "speed lines effect, motion blur, rapid movement, anime-style velocity" },
    ]
  },
  {
    name: "Camera",
    icon: "📷",
    presets: [
      { id: "zoom", name: "Zoom In", description: "Gradual focus zoom", prompt: "slow zoom in, focus pull, depth of field shift" },
      { id: "zoom-out", name: "Zoom Out", description: "Pull back reveal", prompt: "slow zoom out, scene reveal, expanding view, establishing shot feel" },
      { id: "orbit", name: "Orbit Around", description: "360° rotation", prompt: "slow orbit around subject, 360 degree rotation, turntable effect" },
    ]
  },
  {
    name: "Depth",
    icon: "🎭",
    presets: [
      { id: "parallax", name: "Parallax 3D", description: "Layered depth effect", prompt: "subtle parallax movement, 3D depth effect, layers moving at different speeds" },
      { id: "cinemagraph", name: "Cinemagraph", description: "One element moves", prompt: "cinemagraph style, single isolated movement, static background with one moving element" },
      { id: "depth-shift", name: "Focus Shift", description: "Rack focus change", prompt: "rack focus shift, foreground to background focus pull, cinematic depth change" },
    ]
  },
  {
    name: "Nature",
    icon: "🌿",
    presets: [
      { id: "wind", name: "Wind Effect", description: "Hair and fabric flowing", prompt: "gentle wind blowing hair, fabric flowing, leaves rustling, natural breeze" },
      { id: "water", name: "Water Ripple", description: "Liquid surface motion", prompt: "water surface ripples, gentle waves, reflection distortion, liquid movement" },
      { id: "fire", name: "Fire Flicker", description: "Flame dancing light", prompt: "flickering firelight, dancing flame shadows, warm light variation, crackling fire effect" },
    ]
  },
  {
    name: "Magical",
    icon: "✨",
    presets: [
      { id: "sparkle", name: "Sparkle Effect", description: "Glittering particles", prompt: "magical sparkle particles, glittering light effects, fairy dust animation" },
      { id: "glow", name: "Pulsing Glow", description: "Rhythmic light pulse", prompt: "pulsing ethereal glow, rhythmic light breathing, magical aura animation" },
      { id: "morph", name: "Dream Morph", description: "Surreal transformation", prompt: "dreamlike morphing, surreal shape shifting, fluid transformation, otherworldly change" },
    ]
  },
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
  const [videoDuration, setVideoDuration] = useState<5 | 10>(5);
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [showStyleOptions, setShowStyleOptions] = useState(false);
  const [showOutputSettings, setShowOutputSettings] = useState(false);
  
  const { tier } = useSubscription();
  const videoGen = useVideoGeneration();
  const { showLimitModal, setShowLimitModal, handleRateLimitError } = useUsageLimit();
  const isPremium = tier === 'pro' || tier === 'studio' || tier === 'creator';

  const handleGenerateVideo = async () => {
    if (!uploadedImage || !generatedPrompt) {
      toast.error("Please generate a motion prompt first");
      return;
    }

    try {
      await videoGen.generateVideo({
        prompt: generatedPrompt,
        imageBase64: uploadedImage,
        duration: videoDuration,
        aspectRatio: videoAspectRatio,
      });
    } catch (error) {
      // Error already handled by hook
    }
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
    for (const category of MOTION_CATEGORIES) {
      const preset = category.presets.find(p => p.id === selectedPreset);
      if (preset) return preset.prompt;
    }
    return "";
  };

  const getSelectedPresetName = () => {
    for (const category of MOTION_CATEGORIES) {
      const preset = category.presets.find(p => p.id === selectedPreset);
      if (preset) return preset.name;
    }
    return null;
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
      if (error instanceof Error && (error.message.includes("limit") || error.message.includes("RATE_LIMIT"))) {
        handleRateLimitError();
      } else {
        toast.error(error instanceof Error ? error.message : "Failed to generate motion prompt");
      }
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

  const handleDownloadVideo = () => {
    if (videoGen.videoUrl) {
      const a = document.createElement('a');
      a.href = videoGen.videoUrl;
      a.download = `animated-video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Video download started!");
    }
  };

  return (
    <>
      <div className="pb-8 md:pb-12">
        <div className="max-w-2xl mx-auto px-4 md:px-6 space-y-4">
          
          {/* Generated Video Result - TOP */}
          {videoGen.videoUrl && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-3 border-b border-border/50 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Film className="w-4 h-4 text-purple-500" />
                  Generated Video
                </span>
                <Button variant="ghost" size="sm" onClick={handleDownloadVideo}>
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
              <div className="p-4">
                <video
                  src={videoGen.videoUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Generated Prompt Result */}
          {generatedPrompt && !videoGen.videoUrl && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-3 border-b border-border/50 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  Generated Motion Prompt
                </span>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <div className="p-4">
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{generatedPrompt}</p>
              </div>
              <div className="p-4 pt-0">
                <AIToolLinks type="video" />
              </div>
            </div>
          )}

          {/* Video Generation Progress */}
          {videoGen.isGenerating && (
            <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Generating video...
                </span>
              </div>
              <Progress value={videoGen.progress} className="h-2" />
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                {videoGen.status || "Processing..."}
              </p>
            </div>
          )}

          {/* Upload Area - Inline compact */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "relative rounded-2xl border-2 border-dashed transition-all",
              isDragging
                ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30"
                : uploadedImage
                ? "border-border bg-card"
                : "border-border hover:border-blue-300 bg-muted/30"
            )}
          >
            {!uploadedImage ? (
              <label className="flex items-center gap-4 p-4 cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <Film className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Drop an image to animate</p>
                  <p className="text-xs text-muted-foreground mt-0.5">or click to browse • Ctrl+V to paste</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="p-3 flex items-center gap-3">
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute -top-1.5 -right-1.5 p-1 bg-rose-500 hover:bg-rose-600 rounded-full transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Image ready to animate</p>
                  <p className="text-xs text-muted-foreground">Select a motion style below</p>
                </div>
              </div>
            )}
          </div>

          {/* Favorite Photos */}
          <FavoritePhotosPicker
            currentImage={uploadedImage}
            onSelectPhoto={(img) => {
              setUploadedImage(img);
              setGeneratedPrompt("");
              toast.success("Photo selected!");
            }}
          />

          {/* Motion Description Input */}
          <div className="space-y-2">
            <textarea
              value={motionDescription}
              onChange={(e) => setMotionDescription(e.target.value)}
              placeholder="Describe the motion you want... e.g., 'The person slowly turns their head and smiles' or 'Clouds drift across the sky'"
              rows={2}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none text-sm"
            />
          </div>

          {/* Motion Style Selection - Collapsible */}
          <Collapsible open={showStyleOptions} onOpenChange={setShowStyleOptions}>
            <CollapsibleTrigger className="w-full flex items-center justify-between p-3 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-foreground">Motion Style</span>
                {selectedPreset && (
                  <span className="text-xs text-muted-foreground">• {getSelectedPresetName()}</span>
                )}
              </div>
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", showStyleOptions && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="bg-card border border-border rounded-xl p-4 space-y-4">
                {MOTION_CATEGORIES.map((category) => (
                  <div key={category.name}>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                      <span>{category.icon}</span> {category.name}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {category.presets.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => setSelectedPreset(selectedPreset === preset.id ? null : preset.id)}
                          className={cn(
                            "p-2 rounded-lg border text-left transition-all",
                            selectedPreset === preset.id
                              ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30"
                              : "border-border hover:border-blue-300 hover:bg-muted/50"
                          )}
                        >
                          <span className={cn(
                            "text-xs font-medium block",
                            selectedPreset === preset.id ? "text-blue-700 dark:text-blue-300" : "text-foreground"
                          )}>
                            {preset.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground line-clamp-1">
                            {preset.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Custom style input */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Custom Style Notes</p>
                  <input
                    type="text"
                    value={customMotion}
                    onChange={(e) => setCustomMotion(e.target.value)}
                    placeholder="e.g., cinematic quality, smooth motion, realistic lighting"
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Video Output Settings - Collapsible (Premium) */}
          {isPremium && (
            <Collapsible open={showOutputSettings} onOpenChange={setShowOutputSettings}>
              <CollapsibleTrigger className="w-full flex items-center justify-between p-3 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-foreground">Output Settings</span>
                  <span className="text-xs text-muted-foreground">• {videoDuration}s • {videoAspectRatio}</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", showOutputSettings && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-2 block">Duration</label>
                      <div className="flex gap-2">
                        {[5, 10].map((dur) => (
                          <button
                            key={dur}
                            onClick={() => setVideoDuration(dur as 5 | 10)}
                            className={cn(
                              "flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all",
                              videoDuration === dur
                                ? "bg-purple-100 dark:bg-purple-950/50 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                                : "bg-background border-border hover:border-purple-300"
                            )}
                          >
                            {dur}s
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-2 block">Aspect Ratio</label>
                      <div className="flex gap-2">
                        {(['16:9', '9:16', '1:1'] as const).map((ratio) => (
                          <button
                            key={ratio}
                            onClick={() => setVideoAspectRatio(ratio)}
                            className={cn(
                              "flex-1 py-2 px-2 rounded-lg border text-xs font-medium transition-all",
                              videoAspectRatio === ratio
                                ? "bg-purple-100 dark:bg-purple-950/50 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                                : "bg-background border-border hover:border-purple-300"
                            )}
                          >
                            {ratio}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Generate Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              disabled={!uploadedImage || isGenerating || videoGen.isGenerating}
              onClick={handleGenerate}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Generate Prompt
                </>
              )}
            </Button>
            
            {isPremium && (
              <Button
                variant="hero"
                size="lg"
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                disabled={!uploadedImage || !generatedPrompt || isGenerating || videoGen.isGenerating}
                onClick={handleGenerateVideo}
              >
                {videoGen.isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Video...
                  </>
                ) : (
                  <>
                    <Film className="w-4 h-4" />
                    Generate Video
                  </>
                )}
              </Button>
            )}
          </div>

          {!isPremium && (
            <p className="text-xs text-center text-muted-foreground">
              <Crown className="w-3 h-3 inline mr-1" />
              Upgrade to generate videos directly
            </p>
          )}
        </div>
      </div>

      <FreeLimitModal 
        open={showLimitModal} 
        onOpenChange={setShowLimitModal} 
      />
    </>
  );
}
