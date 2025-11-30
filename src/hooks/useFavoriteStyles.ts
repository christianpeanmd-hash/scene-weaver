import { useState, useEffect } from "react";

const STORAGE_KEY = "memoable_favorite_styles";

export interface FavoriteStyles {
  illustration: string[];
  infographic: string[];
  scene: string[];
}

export function useFavoriteStyles() {
  const [favorites, setFavorites] = useState<FavoriteStyles>({
    illustration: [],
    infographic: [],
    scene: [],
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse favorite styles:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (type: keyof FavoriteStyles, id: string) => {
    setFavorites((prev) => {
      const current = prev[type];
      const isFavorite = current.includes(id);
      return {
        ...prev,
        [type]: isFavorite
          ? current.filter((i) => i !== id)
          : [...current, id],
      };
    });
  };

  const isFavorite = (type: keyof FavoriteStyles, id: string) => {
    return favorites[type].includes(id);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
}
