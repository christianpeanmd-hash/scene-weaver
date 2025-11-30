import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "memoable-environment-library";

export interface Environment {
  id: number;
  name: string;
  setting: string;
  lighting: string;
  audio: string;
  props: string;
}

export interface EnhancedEnvironment extends Environment {
  enhancedSetting?: string;
  enhancedLighting?: string;
  enhancedAudio?: string;
  enhancedProps?: string;
  sourceTemplate?: string;
  createdAt: number;
}

export function useEnvironmentLibrary() {
  const [savedEnvironments, setSavedEnvironments] = useState<EnhancedEnvironment[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedEnvironments(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load environment library:", e);
    }
  }, []);

  // Save to localStorage whenever environments change
  const persistEnvironments = useCallback((envs: EnhancedEnvironment[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(envs));
      setSavedEnvironments(envs);
    } catch (e) {
      console.error("Failed to save environment library:", e);
    }
  }, []);

  const saveEnvironment = useCallback((environment: EnhancedEnvironment) => {
    const existing = savedEnvironments.find(e => e.name.toLowerCase() === environment.name.toLowerCase());
    if (existing) {
      // Update existing environment
      const updated = savedEnvironments.map(e => 
        e.name.toLowerCase() === environment.name.toLowerCase() 
          ? { ...environment, id: e.id, createdAt: e.createdAt }
          : e
      );
      persistEnvironments(updated);
    } else {
      // Add new environment
      persistEnvironments([...savedEnvironments, { ...environment, createdAt: Date.now() }]);
    }
  }, [savedEnvironments, persistEnvironments]);

  const removeEnvironment = useCallback((id: number) => {
    persistEnvironments(savedEnvironments.filter(e => e.id !== id));
  }, [savedEnvironments, persistEnvironments]);

  const getEnvironment = useCallback((id: number) => {
    return savedEnvironments.find(e => e.id === id);
  }, [savedEnvironments]);

  return {
    savedEnvironments,
    saveEnvironment,
    removeEnvironment,
    getEnvironment,
  };
}

// Parse enhanced environment from AI-generated template
export function parseEnvironmentFromTemplate(template: string): Partial<EnhancedEnvironment> | null {
  // Match environment setup section
  const settingMatch = template.match(/Setting:\s*([^\n]+(?:\n(?![A-Z][a-z]*:)[^\n]+)*)/i);
  const lightingMatch = template.match(/Lighting:\s*([^\n]+(?:\n(?![A-Z][a-z]*:)[^\n]+)*)/i);
  const audioMatch = template.match(/(?:Audio|Ambient|Atmosphere):\s*([^\n]+(?:\n(?![A-Z][a-z]*:)[^\n]+)*)/i);
  const propsMatch = template.match(/Props?:\s*([^\n]+(?:\n(?![A-Z][a-z]*:)[^\n]+)*)/i);

  if (settingMatch) {
    return {
      name: "Scene Environment",
      setting: settingMatch[1]?.trim() || "",
      enhancedSetting: settingMatch[1]?.trim() || "",
      lighting: lightingMatch?.[1]?.trim() || "",
      enhancedLighting: lightingMatch?.[1]?.trim() || "",
      audio: audioMatch?.[1]?.trim() || "",
      enhancedAudio: audioMatch?.[1]?.trim() || "",
      props: propsMatch?.[1]?.trim() || "",
      enhancedProps: propsMatch?.[1]?.trim() || "",
    };
  }
  
  return null;
}
