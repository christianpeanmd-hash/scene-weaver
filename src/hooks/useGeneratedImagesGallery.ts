import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface GeneratedImage {
  id: string;
  image_url: string;
  prompt?: string;
  style_name?: string;
  source_thumbnail?: string;
  created_at: string;
}

const LOCAL_STORAGE_KEY = "generated_images_gallery";
const MAX_LOCAL_IMAGES = 20;

export function useGeneratedImagesGallery() {
  const { user } = useAuth();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load images from DB or localStorage
  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      
      if (user) {
        // Logged in - fetch from database
        const { data, error } = await supabase
          .from("generated_images")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);
        
        if (!error && data) {
          setImages(data);
        }
      } else {
        // Anonymous - use localStorage
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          try {
            setImages(JSON.parse(stored));
          } catch {
            setImages([]);
          }
        }
      }
      
      setIsLoading(false);
    };

    loadImages();
  }, [user]);

  // Add a new generated image
  const addImage = useCallback(async (
    imageUrl: string,
    prompt?: string,
    styleName?: string,
    sourceThumbnail?: string
  ): Promise<GeneratedImage | null> => {
    const newImage: GeneratedImage = {
      id: crypto.randomUUID(),
      image_url: imageUrl,
      prompt,
      style_name: styleName,
      source_thumbnail: sourceThumbnail,
      created_at: new Date().toISOString(),
    };

    if (user) {
      // Save to database
      const { data, error } = await supabase
        .from("generated_images")
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          prompt,
          style_name: styleName,
          source_thumbnail: sourceThumbnail,
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving image:", error);
        return null;
      }

      setImages(prev => [data, ...prev]);
      return data;
    } else {
      // Save to localStorage
      setImages(prev => {
        const updated = [newImage, ...prev].slice(0, MAX_LOCAL_IMAGES);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      return newImage;
    }
  }, [user]);

  // Delete an image
  const deleteImage = useCallback(async (id: string) => {
    if (user) {
      const { error } = await supabase
        .from("generated_images")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting image:", error);
        return false;
      }
    }

    setImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      if (!user) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
    return true;
  }, [user]);

  return {
    images,
    isLoading,
    addImage,
    deleteImage,
  };
}
