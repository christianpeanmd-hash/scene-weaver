import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

const LOCAL_STORAGE_KEY = "memoable_scene_styles";

export interface SceneStyle {
  id: string;
  name: string;
  description: string;
  template: string;
  createdAt: number;
  isPreset?: boolean;
  isShared?: boolean;
}

export function useSceneStyleLibrary() {
  const { user } = useAuth();
  const [savedStyles, setSavedStyles] = useState<SceneStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    async function loadStyles() {
      setIsLoading(true);
      
      if (user) {
        const { data, error } = await supabase
          .from("library_scene_styles")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          const styles: SceneStyle[] = data.map((s: any) => ({
            id: s.id,
            name: s.name,
            description: s.description || "",
            template: s.template,
            createdAt: new Date(s.created_at).getTime(),
            isPreset: s.is_preset || false,
            isShared: !!s.team_id,
          }));
          setSavedStyles(styles);
          setIsSynced(true);
          
          // Migrate localStorage
          const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (localData) {
            try {
              const localStyles = JSON.parse(localData);
              if (localStyles.length > 0) {
                await migrateLocalStyles(localStyles, user.id);
                localStorage.removeItem(LOCAL_STORAGE_KEY);
              }
            } catch (e) {
              console.error("Failed to migrate local styles:", e);
            }
          }
        }
      } else {
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) {
            setSavedStyles(JSON.parse(stored));
          }
        } catch (e) {
          console.error("Failed to load scene styles:", e);
        }
        setIsSynced(false);
      }
      
      setIsLoading(false);
    }

    loadStyles();
  }, [user]);

  const migrateLocalStyles = async (localStyles: SceneStyle[], userId: string) => {
    for (const style of localStyles) {
      await supabase.from("library_scene_styles").insert({
        user_id: userId,
        name: style.name,
        description: style.description,
        template: style.template,
        is_preset: style.isPreset || false,
      });
    }
  };

  const saveStyle = useCallback(async (style: Omit<SceneStyle, "id" | "createdAt">) => {
    if (user) {
      const existing = savedStyles.find(s => s.name.toLowerCase() === style.name.toLowerCase());
      
      if (existing) {
        const { error } = await supabase
          .from("library_scene_styles")
          .update({
            description: style.description,
            template: style.template,
            is_preset: style.isPreset,
          })
          .eq("id", existing.id);

        if (!error) {
          setSavedStyles(prev => prev.map(s => 
            s.id === existing.id ? { ...style, id: existing.id, createdAt: s.createdAt } : s
          ));
          return { ...style, id: existing.id, createdAt: existing.createdAt };
        }
      } else {
        const { data, error } = await supabase
          .from("library_scene_styles")
          .insert({
            user_id: user.id,
            name: style.name,
            description: style.description,
            template: style.template,
            is_preset: style.isPreset || false,
          })
          .select()
          .single();

        if (!error && data) {
          const newStyle: SceneStyle = {
            ...style,
            id: data.id,
            createdAt: new Date(data.created_at).getTime(),
          };
          setSavedStyles(prev => [newStyle, ...prev]);
          return newStyle;
        }
      }
    } else {
      const newStyle: SceneStyle = {
        ...style,
        id: `custom_${Date.now()}`,
        createdAt: Date.now(),
      };
      
      const existingIndex = savedStyles.findIndex(s => s.name.toLowerCase() === style.name.toLowerCase());
      
      if (existingIndex >= 0) {
        const updated = savedStyles.map((s, i) => (i === existingIndex ? { ...newStyle, id: savedStyles[existingIndex].id } : s));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        setSavedStyles(updated);
      } else {
        const updated = [newStyle, ...savedStyles];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        setSavedStyles(updated);
      }
      
      return newStyle;
    }
    return null;
  }, [user, savedStyles]);

  const removeStyle = useCallback(async (id: string) => {
    if (user) {
      const { error } = await supabase
        .from("library_scene_styles")
        .delete()
        .eq("id", id);

      if (!error) {
        setSavedStyles(prev => prev.filter(s => s.id !== id));
      }
    } else {
      const updated = savedStyles.filter(s => s.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      setSavedStyles(updated);
    }
  }, [user, savedStyles]);

  const getStyle = useCallback((id: string) => {
    return savedStyles.find(s => s.id === id);
  }, [savedStyles]);

  return {
    savedStyles,
    saveStyle,
    removeStyle,
    getStyle,
    isLoading,
    isSynced,
  };
}
