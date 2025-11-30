import { useState } from "react";
import { Images, Trash2, Download, Eye, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeneratedImage } from "@/hooks/useGeneratedImagesGallery";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface GeneratedImagesGalleryProps {
  images: GeneratedImage[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<boolean>;
  onSelect?: (imageUrl: string) => void;
}

export function GeneratedImagesGallery({ 
  images, 
  isLoading, 
  onDelete,
  onSelect 
}: GeneratedImagesGalleryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.image_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `generated-${image.style_name || "image"}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const success = await onDelete(id);
    if (success) {
      toast.success("Image removed from gallery");
      if (selectedImage?.id === id) {
        setSelectedImage(null);
      }
    }
  };

  if (images.length === 0 && !isLoading) {
    return (
      <div className="p-3 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Images className="w-3.5 h-3.5" />
          <span>Generated images will appear here</span>
        </div>
      </div>
    );
  }

  const displayImages = isExpanded ? images : images.slice(0, 4);

  return (
    <div className="border-t border-border/50">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-foreground">
          <Images className="w-3.5 h-3.5 text-purple-500" />
          <span>Recent Generations ({images.length})</span>
        </div>
        {images.length > 4 && (
          isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="p-3 flex gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-16 h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="px-3 pb-3">
          <div className="flex flex-wrap gap-2">
            {displayImages.map((image) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="relative group rounded-lg overflow-hidden border-2 border-transparent hover:border-purple-400 transition-all"
              >
                <img
                  src={image.image_url}
                  alt={image.style_name || "Generated"}
                  className="w-16 h-16 object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {image.style_name && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1">
                    <span className="text-[8px] text-white font-medium truncate block">
                      {image.style_name}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
          
          {!isExpanded && images.length > 4 && (
            <button
              onClick={() => setIsExpanded(true)}
              className="mt-2 text-xs text-purple-500 hover:text-purple-600 font-medium"
            >
              Show {images.length - 4} more...
            </button>
          )}
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-3 border-b border-border flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedImage.style_name || "Generated Image"}
              </span>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.style_name || "Generated"}
                className="w-full max-h-[60vh] object-contain rounded-lg"
              />
              
              {selectedImage.prompt && (
                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Prompt:</p>
                  <p className="text-sm text-foreground line-clamp-3">{selectedImage.prompt}</p>
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-border flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleDownload(selectedImage)}
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              {onSelect && (
                <Button
                  variant="soft"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    onSelect(selectedImage.image_url);
                    setSelectedImage(null);
                    toast.success("Image selected!");
                  }}
                >
                  Use This Image
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => handleDelete(e, selectedImage.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
