import { useState } from "react";
import { Heart, Plus, X, Check, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavoritePhotos, FavoritePhoto } from "@/hooks/useFavoritePhotos";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FavoritePhotosPickerProps {
  currentImage: string | null;
  onSelectPhoto: (imageBase64: string) => void;
}

export function FavoritePhotosPicker({ currentImage, onSelectPhoto }: FavoritePhotosPickerProps) {
  const { photos, addPhoto, removePhoto, canAddMore, maxPhotos } = useFavoritePhotos();
  const [isAddingName, setIsAddingName] = useState(false);
  const [newPhotoName, setNewPhotoName] = useState("");

  const handleSaveCurrentPhoto = () => {
    if (!currentImage) {
      toast.error("Upload a photo first to save it");
      return;
    }
    if (!canAddMore) {
      toast.error(`Maximum ${maxPhotos} favorite photos allowed`);
      return;
    }
    setIsAddingName(true);
  };

  const confirmSavePhoto = () => {
    if (!currentImage) return;
    
    const name = newPhotoName.trim() || `Photo ${photos.length + 1}`;
    const photo = addPhoto(name, currentImage);
    
    if (photo) {
      toast.success(`"${name}" saved to favorites!`);
    } else {
      toast.error("Failed to save photo");
    }
    
    setIsAddingName(false);
    setNewPhotoName("");
  };

  const handleRemovePhoto = (e: React.MouseEvent, photo: FavoritePhoto) => {
    e.stopPropagation();
    removePhoto(photo.id);
    toast.success(`"${photo.name}" removed from favorites`);
  };

  if (photos.length === 0 && !currentImage) {
    return null;
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Heart className="w-3 h-3" />
          <span>Favorite Photos ({photos.length}/{maxPhotos})</span>
        </div>
        
        {currentImage && !isAddingName && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveCurrentPhoto}
            disabled={!canAddMore}
            className="h-6 text-xs gap-1 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
          >
            <Heart className="w-3 h-3" />
            Save to Favorites
          </Button>
        )}
      </div>

      {/* Save Photo Name Input */}
      {isAddingName && (
        <div className="flex items-center gap-2 p-2 bg-rose-50 dark:bg-rose-950/20 rounded-lg animate-fade-in">
          <input
            type="text"
            value={newPhotoName}
            onChange={(e) => setNewPhotoName(e.target.value)}
            placeholder="Name this person (e.g., 'Me', 'Mom')"
            className="flex-1 px-2 py-1 text-sm bg-card border border-border rounded focus:outline-none focus:ring-1 focus:ring-rose-400"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && confirmSavePhoto()}
          />
          <Button size="icon" className="h-7 w-7 bg-rose-500 hover:bg-rose-600" onClick={confirmSavePhoto}>
            <Check className="w-3 h-3" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7" 
            onClick={() => {
              setIsAddingName(false);
              setNewPhotoName("");
            }}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => onSelectPhoto(photo.imageBase64)}
              className={cn(
                "relative flex-shrink-0 group rounded-lg overflow-hidden border-2 transition-all",
                currentImage === photo.imageBase64
                  ? "border-rose-500 ring-2 ring-rose-200"
                  : "border-border hover:border-rose-300"
              )}
            >
              <img
                src={photo.imageBase64}
                alt={photo.name}
                className="w-14 h-14 object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1">
                <span className="text-[9px] text-white font-medium truncate block">
                  {photo.name}
                </span>
              </div>
              <button
                onClick={(e) => handleRemovePhoto(e, photo)}
                className="absolute top-0.5 right-0.5 p-0.5 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500"
              >
                <X className="w-2.5 h-2.5 text-white" />
              </button>
              {currentImage === photo.imageBase64 && (
                <div className="absolute top-0.5 left-0.5 p-0.5 bg-rose-500 rounded-full">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}