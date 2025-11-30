import { useState, useEffect, useCallback } from "react";
import { EnhancedCharacter } from "@/types/prompt-builder";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

const LOCAL_STORAGE_KEY = "memoable-character-library";

export function useCharacterLibrary() {
  const { user } = useAuth();
  const [savedCharacters, setSavedCharacters] = useState<EnhancedCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false);

  // Load characters from database or localStorage
  useEffect(() => {
    async function loadCharacters() {
      setIsLoading(true);
      
      if (user) {
        // Load from database for logged-in users
        const { data, error } = await supabase
          .from("library_characters")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          const characters: EnhancedCharacter[] = data.map((c: any) => ({
            id: c.id,
            name: c.name,
            look: c.look || "",
            demeanor: c.demeanor || "",
            role: c.role || "",
            enhancedLook: c.enhanced_look || "",
            enhancedDemeanor: c.enhanced_demeanor || "",
            enhancedRole: c.enhanced_role || "",
            sourceTemplate: c.source_template,
            createdAt: new Date(c.created_at).getTime(),
            isShared: !!c.team_id,
          }));
          setSavedCharacters(characters);
          setIsSynced(true);
          
          // Migrate localStorage data if exists
          const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (localData) {
            try {
              const localCharacters = JSON.parse(localData);
              if (localCharacters.length > 0) {
                await migrateLocalCharacters(localCharacters, user.id);
                localStorage.removeItem(LOCAL_STORAGE_KEY);
              }
            } catch (e) {
              console.error("Failed to migrate local characters:", e);
            }
          }
        }
      } else {
        // Load from localStorage for anonymous users
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) {
            setSavedCharacters(JSON.parse(stored));
          }
        } catch (e) {
          console.error("Failed to load character library:", e);
        }
        setIsSynced(false);
      }
      
      setIsLoading(false);
    }

    loadCharacters();
  }, [user]);

  const migrateLocalCharacters = async (characters: EnhancedCharacter[], userId: string) => {
    for (const char of characters) {
      await supabase.from("library_characters").insert({
        user_id: userId,
        name: char.name,
        look: char.look,
        demeanor: char.demeanor,
        role: char.role,
        enhanced_look: char.enhancedLook,
        enhanced_demeanor: char.enhancedDemeanor,
        enhanced_role: char.enhancedRole,
        source_template: char.sourceTemplate,
      });
    }
  };

  const saveCharacter = useCallback(async (character: EnhancedCharacter) => {
    if (user) {
      // Check if character exists by name
      const existing = savedCharacters.find(c => c.name.toLowerCase() === character.name.toLowerCase());
      
      if (existing) {
        // Update existing
        const { error } = await supabase
          .from("library_characters")
          .update({
            look: character.look,
            demeanor: character.demeanor,
            role: character.role,
            enhanced_look: character.enhancedLook,
            enhanced_demeanor: character.enhancedDemeanor,
            enhanced_role: character.enhancedRole,
            source_template: character.sourceTemplate,
          })
          .eq("id", String(existing.id));

        if (!error) {
          setSavedCharacters(prev => prev.map(c => 
            c.id === existing.id ? { ...character, id: existing.id, createdAt: c.createdAt } : c
          ));
        }
      } else {
        // Insert new
        const { data, error } = await supabase
          .from("library_characters")
          .insert({
            user_id: user.id,
            name: character.name,
            look: character.look,
            demeanor: character.demeanor,
            role: character.role,
            enhanced_look: character.enhancedLook,
            enhanced_demeanor: character.enhancedDemeanor,
            enhanced_role: character.enhancedRole,
            source_template: character.sourceTemplate,
          })
          .select()
          .single();

        if (!error && data) {
          setSavedCharacters(prev => [{
            ...character,
            id: data.id,
            createdAt: new Date(data.created_at).getTime(),
          }, ...prev]);
        }
      }
    } else {
      // localStorage for anonymous users
      const existing = savedCharacters.find(c => c.name.toLowerCase() === character.name.toLowerCase());
      let updated: EnhancedCharacter[];
      
      if (existing) {
        updated = savedCharacters.map(c => 
          c.name.toLowerCase() === character.name.toLowerCase() 
            ? { ...character, id: c.id, createdAt: c.createdAt }
            : c
        );
      } else {
        updated = [...savedCharacters, { ...character, id: Date.now(), createdAt: Date.now() }];
      }
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      setSavedCharacters(updated);
    }
  }, [user, savedCharacters]);

  const removeCharacter = useCallback(async (id: number | string) => {
    if (user) {
      const { error } = await supabase
        .from("library_characters")
        .delete()
        .eq("id", String(id));

      if (!error) {
        setSavedCharacters(prev => prev.filter(c => c.id !== id));
      }
    } else {
      const updated = savedCharacters.filter(c => c.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      setSavedCharacters(updated);
    }
  }, [user, savedCharacters]);

  const getCharacter = useCallback((id: number | string) => {
    return savedCharacters.find(c => c.id === id);
  }, [savedCharacters]);

  return {
    savedCharacters,
    saveCharacter,
    removeCharacter,
    getCharacter,
    isLoading,
    isSynced,
  };
}

// Parse enhanced characters from AI-generated template
export function parseCharactersFromTemplate(template: string): Partial<EnhancedCharacter>[] {
  const characters: Partial<EnhancedCharacter>[] = [];
  
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
