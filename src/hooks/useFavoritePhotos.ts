import { useState, useEffect } from "react";

export interface FavoritePhoto {
  id: string;
  name: string;
  imageBase64: string;
  createdAt: number;
}

const STORAGE_KEY = "memoable_favorite_photos";
const MAX_PHOTOS = 10;

export function useFavoritePhotos() {
  const [photos, setPhotos] = useState<FavoritePhoto[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPhotos(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse favorite photos:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (photos.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    }
  }, [photos]);

  const addPhoto = (name: string, imageBase64: string): FavoritePhoto | null => {
    if (photos.length >= MAX_PHOTOS) {
      return null;
    }

    const newPhoto: FavoritePhoto = {
      id: `photo_${Date.now()}`,
      name,
      imageBase64,
      createdAt: Date.now(),
    };

    setPhotos((prev) => [...prev, newPhoto]);
    return newPhoto;
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePhotoName = (id: string, name: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name } : p))
    );
  };

  const canAddMore = photos.length < MAX_PHOTOS;

  return {
    photos,
    addPhoto,
    removePhoto,
    updatePhotoName,
    canAddMore,
    maxPhotos: MAX_PHOTOS,
  };
}