import { useState } from "react";
import { Download, Loader2, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface GeneratedImageDisplayProps {
  prompt: string;
  type: "image" | "infographic";
}

export function GeneratedImageDisplay({ prompt, type }: GeneratedImageDisplayProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

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
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      // For base64 images
      if (generatedImage.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `memoable-${type}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For URL images
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
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGeneratedImage(null)}
              className="flex-1"
            >
              Generate New
            </Button>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Powered by Gemini Flash Image (Nano Banana Pro)
      </p>
    </Card>
  );
}
