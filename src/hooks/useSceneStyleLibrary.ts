import { useState, useEffect } from "react";

export interface SceneStyle {
  id: string;
  name: string;
  description: string;
  template: string;
  createdAt: number;
  isPreset?: boolean;
}

const STORAGE_KEY = "memoable_scene_styles";

export function useSceneStyleLibrary() {
  const [savedStyles, setSavedStyles] = useState<SceneStyle[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSavedStyles(parsed);
      } catch (e) {
        console.error("Failed to parse scene styles from storage:", e);
      }
    }
  }, []);

  // Save to localStorage whenever styles change
  useEffect(() => {
    if (savedStyles.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedStyles));
    }
  }, [savedStyles]);

  const saveStyle = (style: Omit<SceneStyle, "id" | "createdAt">) => {
    const newStyle: SceneStyle = {
      ...style,
      id: `custom_${Date.now()}`,
      createdAt: Date.now(),
    };
    
    // Check if style with same name exists
    const existingIndex = savedStyles.findIndex(
      (s) => s.name.toLowerCase() === style.name.toLowerCase()
    );
    
    if (existingIndex >= 0) {
      // Update existing
      setSavedStyles((prev) =>
        prev.map((s, i) => (i === existingIndex ? { ...newStyle, id: prev[existingIndex].id } : s))
      );
    } else {
      // Add new
      setSavedStyles((prev) => [...prev, newStyle]);
    }
    
    return newStyle;
  };

  const removeStyle = (id: string) => {
    setSavedStyles((prev) => prev.filter((s) => s.id !== id));
  };

  const getStyle = (id: string) => {
    return savedStyles.find((s) => s.id === id);
  };

  return {
    savedStyles,
    saveStyle,
    removeStyle,
    getStyle,
  };
}
