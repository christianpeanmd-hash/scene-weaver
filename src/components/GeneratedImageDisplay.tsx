import { useState } from "react";
import { Download, Loader2, Sparkles, Pencil, Send, RotateCcw, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface GeneratedImageDisplayProps {
  prompt: string;
  type: "image" | "infographic";
}

interface ImageVersion {
  imageUrl: string;
  editPrompt?: string;
  timestamp: number;
}

export function GeneratedImageDisplay({ prompt, type }: GeneratedImageDisplayProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState("");
  const [showEditInput, setShowEditInput] = useState(false);
  const [imageHistory, setImageHistory] = useState<ImageVersion[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error("No prompt available to generate image");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-image', {
        body: { prompt },
      });

      if (error) throw error;
      if (data?.error) {
        if (data.errorCode === 'RATE_LIMIT') {
          toast.error("Rate limit reached. Please wait a moment and try again.");
        } else if (data.errorCode === 'CREDITS_EXHAUSTED') {
          toast.error("AI credits exhausted. Please add credits to continue.");
        } else {
          throw new Error(data.error);
        }
        return;
      }

      setGeneratedImage(data.imageUrl);
      setImageHistory([{ imageUrl: data.imageUrl, timestamp: Date.now() }]);
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditImage = async () => {
    if (!editPrompt.trim()) {
      toast.error("Please enter an edit instruction");
      return;
    }
    if (!generatedImage) {
      toast.error("No image to edit");
      return;
    }

    setIsEditing(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-image', {
        body: {
          prompt: editPrompt,
          editMode: true,
          sourceImageBase64: generatedImage,
        },
      });

      if (error) throw error;
      if (data?.error) {
        if (data.errorCode === 'RATE_LIMIT') {
          toast.error("Rate limit reached. Please wait a moment and try again.");
        } else if (data.errorCode === 'CREDITS_EXHAUSTED') {
          toast.error("AI credits exhausted. Please add credits to continue.");
        } else {
          throw new Error(data.error);
        }
        return;
      }

      // Save current version to history before updating
      setImageHistory(prev => [...prev, { imageUrl: data.imageUrl, editPrompt, timestamp: Date.now() }]);
      setGeneratedImage(data.imageUrl);
      setEditPrompt("");
      setShowEditInput(false);
      toast.success("Image edited successfully!");
    } catch (error) {
      console.error("Error editing image:", error);
      toast.error(error instanceof Error ? error.message : "Failed to edit image");
    } finally {
      setIsEditing(false);
    }
  };

  const handleRevertToVersion = (version: ImageVersion) => {
    setGeneratedImage(version.imageUrl);
    setShowHistory(false);
    toast.success("Reverted to previous version");
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      if (generatedImage.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `memoable-${type}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `memoable-${type}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      toast.success("Image downloaded!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image");
    }
  };

  return (
    <Card className="p-4 space-y-4 border-dashed border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Generate with AI</span>
          <span className="text-xs text-muted-foreground">(NanoBananaPro)</span>
        </div>
      </div>

      {!generatedImage ? (
        <Button
          onClick={handleGenerateImage}
          disabled={isGenerating || !prompt}
          className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Generating Image...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Image Directly
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden bg-muted">
            <img
              src={generatedImage}
              alt="Generated"
              className="w-full h-auto max-h-80 object-contain"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Editing image...</span>
                </div>
              </div>
            )}
          </div>

          {/* Edit Input */}
          {showEditInput && (
            <div className="flex gap-2 animate-fade-in">
              <input
                type="text"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="Describe your edit... (e.g., 'make it warmer', 'add a sunset')"
                className="flex-1 px-3 py-2 text-sm bg-card border border-border rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                onKeyDown={(e) => e.key === 'Enter' && handleEditImage()}
                disabled={isEditing}
              />
              <Button
                size="icon"
                onClick={handleEditImage}
                disabled={isEditing || !editPrompt.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditInput(!showEditInput)}
              className={cn("flex-1", showEditInput && "border-primary text-primary")}
            >
              <Pencil className="w-4 h-4 mr-2" />
              {showEditInput ? "Cancel Edit" : "Edit Image"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          <div className="flex gap-2">
            {imageHistory.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="flex-1 text-muted-foreground"
              >
                <History className="w-4 h-4 mr-2" />
                History ({imageHistory.length})
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setGeneratedImage(null);
                setImageHistory([]);
                setShowEditInput(false);
                setEditPrompt("");
              }}
              className="flex-1 text-muted-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          </div>

          {/* Image History */}
          {showHistory && imageHistory.length > 1 && (
            <div className="border-t border-border pt-3 space-y-2 animate-fade-in">
              <p className="text-xs font-medium text-muted-foreground">Version History</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {imageHistory.map((version, index) => (
                  <button
                    key={version.timestamp}
                    onClick={() => handleRevertToVersion(version)}
                    className={cn(
                      "flex-shrink-0 relative rounded-md overflow-hidden border-2 transition-colors",
                      version.imageUrl === generatedImage
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <img
                      src={version.imageUrl}
                      alt={`Version ${index + 1}`}
                      className="w-16 h-16 object-cover"
                    />
                    <span className="absolute bottom-0 left-0 right-0 bg-background/80 text-[10px] text-center py-0.5">
                      {index === 0 ? "Original" : `Edit ${index}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Powered by Gemini Flash Image (Nano Banana Pro)
      </p>
    </Card>
  );
}