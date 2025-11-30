import { useState, useEffect, useCallback } from "react";
import { EnhancedCharacter } from "@/types/prompt-builder";

const STORAGE_KEY = "memoable-character-library";

export function useCharacterLibrary() {
  const [savedCharacters, setSavedCharacters] = useState<EnhancedCharacter[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedCharacters(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load character library:", e);
    }
  }, []);

  // Save to localStorage whenever characters change
  const persistCharacters = useCallback((chars: EnhancedCharacter[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
      setSavedCharacters(chars);
    } catch (e) {
      console.error("Failed to save character library:", e);
    }
  }, []);

  const saveCharacter = useCallback((character: EnhancedCharacter) => {
    const existing = savedCharacters.find(c => c.name.toLowerCase() === character.name.toLowerCase());
    if (existing) {
      // Update existing character
      const updated = savedCharacters.map(c => 
        c.name.toLowerCase() === character.name.toLowerCase() 
          ? { ...character, id: c.id, createdAt: c.createdAt }
          : c
      );
      persistCharacters(updated);
    } else {
      // Add new character
      persistCharacters([...savedCharacters, { ...character, createdAt: Date.now() }]);
    }
  }, [savedCharacters, persistCharacters]);

  const removeCharacter = useCallback((id: number) => {
    persistCharacters(savedCharacters.filter(c => c.id !== id));
  }, [savedCharacters, persistCharacters]);

  const getCharacter = useCallback((id: number) => {
    return savedCharacters.find(c => c.id === id);
  }, [savedCharacters]);

  return {
    savedCharacters,
    saveCharacter,
    removeCharacter,
    getCharacter,
  };
}

// Parse enhanced characters from AI-generated template
export function parseCharactersFromTemplate(template: string): Partial<EnhancedCharacter>[] {
  const characters: Partial<EnhancedCharacter>[] = [];
  
  // Match character anchor blocks
  const charPattern = /\*\*Character Anchor:\s*([^*\n]+)\*\*[\s\S]*?\*\s*\*\*Look\*\*:\s*([^\n]+)[\s\S]*?\*\s*\*\*Demeanor\*\*:\s*([^\n]+)[\s\S]*?\*\s*\*\*Role\*\*:\s*([^\n]+)/gi;
  
  let match;
  while ((match = charPattern.exec(template)) !== null) {
    const [, name, look, demeanor, role] = match;
    if (name && look && demeanor) {
      characters.push({
        name: name.trim(),
        enhancedLook: look.trim(),
        enhancedDemeanor: demeanor.trim(),
        enhancedRole: role?.trim() || "",
        look: look.trim(),
        demeanor: demeanor.trim(),
        role: role?.trim() || "",
      });
    }
  }
  
  return characters;
}
