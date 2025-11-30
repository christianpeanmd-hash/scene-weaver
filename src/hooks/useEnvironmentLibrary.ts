import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

const LOCAL_STORAGE_KEY = "memoable-environment-library";

export interface Environment {
  id: number | string;
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
  isShared?: boolean;
}

export function useEnvironmentLibrary() {
  const { user } = useAuth();
  const [savedEnvironments, setSavedEnvironments] = useState<EnhancedEnvironment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    async function loadEnvironments() {
      setIsLoading(true);
      
      if (user) {
        const { data, error } = await supabase
          .from("library_environments")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          const environments: EnhancedEnvironment[] = data.map((e: any) => ({
            id: e.id,
            name: e.name,
            setting: e.setting || "",
            lighting: e.lighting || "",
            audio: e.audio || "",
            props: e.props || "",
            enhancedSetting: e.enhanced_setting || "",
            enhancedLighting: e.enhanced_lighting || "",
            enhancedAudio: e.enhanced_audio || "",
            enhancedProps: e.enhanced_props || "",
            sourceTemplate: e.source_template,
            createdAt: new Date(e.created_at).getTime(),
            isShared: !!e.team_id,
          }));
          setSavedEnvironments(environments);
          setIsSynced(true);
          
          // Migrate localStorage
          const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (localData) {
            try {
              const localEnvs = JSON.parse(localData);
              if (localEnvs.length > 0) {
                await migrateLocalEnvironments(localEnvs, user.id);
                localStorage.removeItem(LOCAL_STORAGE_KEY);
              }
            } catch (e) {
              console.error("Failed to migrate local environments:", e);
            }
          }
        }
      } else {
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) {
            setSavedEnvironments(JSON.parse(stored));
          }
        } catch (e) {
          console.error("Failed to load environment library:", e);
        }
        setIsSynced(false);
      }
      
      setIsLoading(false);
    }

    loadEnvironments();
  }, [user]);

  const migrateLocalEnvironments = async (environments: EnhancedEnvironment[], userId: string) => {
    for (const env of environments) {
      await supabase.from("library_environments").insert({
        user_id: userId,
        name: env.name,
        setting: env.setting,
        lighting: env.lighting,
        audio: env.audio,
        props: env.props,
        enhanced_setting: env.enhancedSetting,
        enhanced_lighting: env.enhancedLighting,
        enhanced_audio: env.enhancedAudio,
        enhanced_props: env.enhancedProps,
        source_template: env.sourceTemplate,
      });
    }
  };

  const saveEnvironment = useCallback(async (environment: EnhancedEnvironment) => {
    if (user) {
      const existing = savedEnvironments.find(e => e.name.toLowerCase() === environment.name.toLowerCase());
      
      if (existing) {
        const { error } = await supabase
          .from("library_environments")
          .update({
            setting: environment.setting,
            lighting: environment.lighting,
            audio: environment.audio,
            props: environment.props,
            enhanced_setting: environment.enhancedSetting,
            enhanced_lighting: environment.enhancedLighting,
            enhanced_audio: environment.enhancedAudio,
            enhanced_props: environment.enhancedProps,
            source_template: environment.sourceTemplate,
          })
          .eq("id", String(existing.id));

        if (!error) {
          setSavedEnvironments(prev => prev.map(e => 
            e.id === existing.id ? { ...environment, id: existing.id, createdAt: e.createdAt } : e
          ));
        }
      } else {
        const { data, error } = await supabase
          .from("library_environments")
          .insert({
            user_id: user.id,
            name: environment.name,
            setting: environment.setting,
            lighting: environment.lighting,
            audio: environment.audio,
            props: environment.props,
            enhanced_setting: environment.enhancedSetting,
            enhanced_lighting: environment.enhancedLighting,
            enhanced_audio: environment.enhancedAudio,
            enhanced_props: environment.enhancedProps,
            source_template: environment.sourceTemplate,
          })
          .select()
          .single();

        if (!error && data) {
          setSavedEnvironments(prev => [{
            ...environment,
            id: data.id,
            createdAt: new Date(data.created_at).getTime(),
          }, ...prev]);
        }
      }
    } else {
      const existing = savedEnvironments.find(e => e.name.toLowerCase() === environment.name.toLowerCase());
      let updated: EnhancedEnvironment[];
      
      if (existing) {
        updated = savedEnvironments.map(e => 
          e.name.toLowerCase() === environment.name.toLowerCase() 
            ? { ...environment, id: e.id, createdAt: e.createdAt }
            : e
        );
      } else {
        updated = [...savedEnvironments, { ...environment, id: Date.now(), createdAt: Date.now() }];
      }
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      setSavedEnvironments(updated);
    }
  }, [user, savedEnvironments]);

  const removeEnvironment = useCallback(async (id: number | string) => {
    if (user) {
      const { error } = await supabase
        .from("library_environments")
        .delete()
        .eq("id", String(id));

      if (!error) {
        setSavedEnvironments(prev => prev.filter(e => e.id !== id));
      }
    } else {
      const updated = savedEnvironments.filter(e => e.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      setSavedEnvironments(updated);
    }
  }, [user, savedEnvironments]);

  const getEnvironment = useCallback((id: number | string) => {
    return savedEnvironments.find(e => e.id === id);
  }, [savedEnvironments]);

  return {
    savedEnvironments,
    saveEnvironment,
    removeEnvironment,
    getEnvironment,
    isLoading,
    isSynced,
  };
}

export function parseEnvironmentFromTemplate(template: string): Partial<EnhancedEnvironment> | null {
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
