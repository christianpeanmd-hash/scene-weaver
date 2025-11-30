import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useSubscription } from "./useSubscription";
import { supabase } from "@/integrations/supabase/client";

const LOCAL_STORAGE_KEY = "memoable_favorite_photos";

// Photo limits by tier
const PHOTO_LIMITS = {
  free: 3,
  creator: 10,
  pro: 25,
  studio: 100,
};

export interface FavoritePhoto {
  id: string;
  name: string;
  imageBase64: string;
  createdAt: number;
  isShared?: boolean;
}

export function useFavoritePhotos() {
  const { user } = useAuth();
  const { tier } = useSubscription();
  const [photos, setPhotos] = useState<FavoritePhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false);

  const maxPhotos = PHOTO_LIMITS[tier] || PHOTO_LIMITS.free;

  useEffect(() => {
    async function loadPhotos() {
      setIsLoading(true);
      
      if (user) {
        const { data, error } = await supabase
          .from("library_photos")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          const loadedPhotos: FavoritePhoto[] = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            imageBase64: p.image_base64,
            createdAt: new Date(p.created_at).getTime(),
            isShared: !!p.team_id,
          }));
          setPhotos(loadedPhotos);
          setIsSynced(true);
          
          // Migrate localStorage
          const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (localData) {
            try {
              const localPhotos = JSON.parse(localData);
              if (localPhotos.length > 0) {
                await migrateLocalPhotos(localPhotos, user.id);
                localStorage.removeItem(LOCAL_STORAGE_KEY);
              }
            } catch (e) {
              console.error("Failed to migrate local photos:", e);
            }
          }
        }
      } else {
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) {
            setPhotos(JSON.parse(stored));
          }
        } catch (e) {
          console.error("Failed to load favorite photos:", e);
        }
        setIsSynced(false);
      }
      
      setIsLoading(false);
    }

    loadPhotos();
  }, [user]);

  const migrateLocalPhotos = async (localPhotos: FavoritePhoto[], userId: string) => {
    for (const photo of localPhotos) {
      await supabase.from("library_photos").insert({
        user_id: userId,
        name: photo.name,
        image_base64: photo.imageBase64,
      });
    }
  };

  const addPhoto = useCallback(async (name: string, imageBase64: string): Promise<FavoritePhoto | null> => {
    if (photos.length >= maxPhotos) {
      return null;
    }

    if (user) {
      const { data, error } = await supabase
        .from("library_photos")
        .insert({
          user_id: user.id,
          name,
          image_base64: imageBase64,
        })
        .select()
        .single();

      if (!error && data) {
        const newPhoto: FavoritePhoto = {
          id: data.id,
          name,
          imageBase64,
          createdAt: new Date(data.created_at).getTime(),
        };
        setPhotos(prev => [newPhoto, ...prev]);
        return newPhoto;
      }
    } else {
      const newPhoto: FavoritePhoto = {
        id: `photo_${Date.now()}`,
        name,
        imageBase64,
        createdAt: Date.now(),
      };

      const updated = [newPhoto, ...photos];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      setPhotos(updated);
      return newPhoto;
    }

    return null;
  }, [user, photos, maxPhotos]);

  const removePhoto = useCallback(async (id: string) => {
    if (user) {
      const { error } = await supabase
        .from("library_photos")
        .delete()
        .eq("id", id);

      if (!error) {
        setPhotos(prev => prev.filter(p => p.id !== id));
      }
    } else {
      const updated = photos.filter(p => p.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      setPhotos(updated);
    }
  }, [user, photos]);

  const updatePhotoName = useCallback(async (id: string, name: string) => {
    if (user) {
      // Note: library_photos doesn't have an update policy, so we skip for now
      // This would need a migration to add the UPDATE policy
      setPhotos(prev => prev.map(p => (p.id === id ? { ...p, name } : p)));
    } else {
      const updated = photos.map(p => (p.id === id ? { ...p, name } : p));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      setPhotos(updated);
    }
  }, [user, photos]);

  const canAddMore = photos.length < maxPhotos;

  return {
    photos,
    addPhoto,
    removePhoto,
    updatePhotoName,
    canAddMore,
    maxPhotos,
    isLoading,
    isSynced,
  };
}
