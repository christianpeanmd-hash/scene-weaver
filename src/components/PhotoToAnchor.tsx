import { useState, useCallback } from "react";
import { Camera, Upload, X, Wand2, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateCharacterFromPhoto, generateEnvironmentFromPhoto } from "@/lib/image-prompt-generator";
import { cn } from "@/lib/utils";

interface PhotoToAnchorProps {
  type: "character" | "environment";
  onGenerated: (anchor: any) => void;
}

export function PhotoToAnchor({ type, onGenerated }: PhotoToAnchorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  }, [handleImageUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  }, [handleImageUpload]);

  const handleGenerate = async () => {
    if (!uploadedImage) return;

    setIsGenerating(true);
    try {
      if (type === "character") {
        const character = await generateCharacterFromPhoto(uploadedImage);
        onGenerated(character);
        toast.success(`Generated "${character.name}" from photo!`);
      } else {
        const environment = await generateEnvironmentFromPhoto(uploadedImage);
        onGenerated(environment);
        toast.success(`Generated "${environment.name}" from photo!`);
      }
      setUploadedImage(null);
      setIsOpen(false);
    } catch (error) {
      console.error("Error generating anchor:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate from photo");
    } finally {
      setIsGenerating(false);
    }
  };

  const Icon = type === "character" ? User : MapPin;
  const color = type === "character" ? "teal" : "emerald";

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 text-sm font-medium transition-colors",
          type === "character" 
            ? "text-teal-600 hover:text-teal-700" 
            : "text-emerald-600 hover:text-emerald-700"
        )}
      >
        <Camera className="w-4 h-4" />
        Generate from photo
      </button>

      {isOpen && (
        <div className={cn(
          "p-4 rounded-xl animate-fade-in space-y-3",
          type === "character" ? "bg-teal-50/50" : "bg-emerald-50/50"
        )}>
          {!uploadedImage ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              className={cn(
                "p-6 border-2 border-dashed rounded-lg transition-all text-center",
                isDragging 
                  ? type === "character" ? "border-teal-400 bg-teal-100/50" : "border-emerald-400 bg-emerald-100/50"
                  : "border-slate-300 bg-white hover:border-slate-400"
              )}
            >
              <div className={cn(
                "w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center",
                type === "character" ? "bg-teal-100" : "bg-emerald-100"
              )}>
                <Upload className={cn(
                  "w-6 h-6",
                  type === "character" ? "text-teal-600" : "text-emerald-600"
                )} />
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Drop a photo of {type === "character" ? "a person" : "a location"}
              </p>
              <label className="cursor-pointer">
                <span className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  type === "character" 
                    ? "bg-teal-100 text-teal-700 hover:bg-teal-200" 
                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                )}>
                  Browse
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => setUploadedImage(null)}
                  className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
              <Button
                variant="soft"
                size="sm"
                className="w-full"
                disabled={isGenerating}
                onClick={handleGenerate}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    Analyzing photo...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate {type === "character" ? "Character" : "Environment"} Anchor
                  </>
                )}
              </Button>
            </div>
          )}
          
          <button
            onClick={() => { setIsOpen(false); setUploadedImage(null); }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
