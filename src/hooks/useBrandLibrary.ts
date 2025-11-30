import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

const LOCAL_STORAGE_KEY = "memoable_brands";

export interface Brand {
  id: string;
  name: string;
  description: string;
  colors?: string[];
  fonts?: string;
  logoUrl?: string;
  additionalNotes?: string;
  createdAt: number;
  isShared?: boolean;
}

export function useBrandLibrary() {
  const { user } = useAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    async function loadBrands() {
      setIsLoading(true);
      
      if (user) {
        const { data, error } = await supabase
          .from("library_brands")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          const loadedBrands: Brand[] = data.map((b: any) => ({
            id: b.id,
            name: b.name,
            description: b.description || "",
            colors: b.colors || [],
            fonts: b.fonts || "",
            logoUrl: b.logo_url || "",
            additionalNotes: b.additional_notes || "",
            createdAt: new Date(b.created_at).getTime(),
            isShared: !!b.team_id,
          }));
          setBrands(loadedBrands);
          setIsSynced(true);
          
          // Migrate localStorage
          const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (localData) {
            try {
              const localBrands = JSON.parse(localData);
              if (localBrands.length > 0) {
                await migrateLocalBrands(localBrands, user.id);
                localStorage.removeItem(LOCAL_STORAGE_KEY);
              }
            } catch (e) {
              console.error("Failed to migrate local brands:", e);
            }
          }
        }
      } else {
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) {
            setBrands(JSON.parse(stored));
          }
        } catch (e) {
          console.error("Failed to load brands:", e);
        }
        setIsSynced(false);
      }
      
      setIsLoading(false);
    }

    loadBrands();
  }, [user]);

  const migrateLocalBrands = async (localBrands: Brand[], userId: string) => {
    for (const brand of localBrands) {
      await supabase.from("library_brands").insert({
        user_id: userId,
        name: brand.name,
        description: brand.description,
        colors: brand.colors,
        fonts: brand.fonts,
        logo_url: brand.logoUrl,
        additional_notes: brand.additionalNotes,
      });
    }
  };

  const saveBrand = useCallback(async (brand: Omit<Brand, "id" | "createdAt">) => {
    if (user) {
      const existing = brands.find(b => b.name.toLowerCase() === brand.name.toLowerCase());
      
      if (existing) {
        const { error } = await supabase
          .from("library_brands")
          .update({
            description: brand.description,
            colors: brand.colors,
            fonts: brand.fonts,
            logo_url: brand.logoUrl,
            additional_notes: brand.additionalNotes,
          })
          .eq("id", existing.id);

        if (!error) {
          setBrands(prev => prev.map(b => 
            b.id === existing.id ? { ...brand, id: existing.id, createdAt: b.createdAt } : b
          ));
          return { ...brand, id: existing.id, createdAt: existing.createdAt };
        }
      } else {
        const { data, error } = await supabase
          .from("library_brands")
          .insert({
            user_id: user.id,
            name: brand.name,
            description: brand.description,
            colors: brand.colors,
            fonts: brand.fonts,
            logo_url: brand.logoUrl,
            additional_notes: brand.additionalNotes,
          })
          .select()
          .single();

        if (!error && data) {
          const newBrand: Brand = {
            ...brand,
            id: data.id,
            createdAt: new Date(data.created_at).getTime(),
          };
          setBrands(prev => [newBrand, ...prev]);
          return newBrand;
        }
      }
    } else {
      const newBrand: Brand = {
        ...brand,
        id: `brand_${Date.now()}`,
        createdAt: Date.now(),
      };

      const existingIndex = brands.findIndex(b => b.name.toLowerCase() === brand.name.toLowerCase());

      if (existingIndex >= 0) {
        const updated = brands.map((b, i) =>
          i === existingIndex ? { ...newBrand, id: brands[existingIndex].id } : b
        );
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        setBrands(updated);
      } else {
        const updated = [...brands, newBrand];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        setBrands(updated);
      }

      return newBrand;
    }
    return null;
  }, [user, brands]);

  const updateBrand = useCallback(async (id: string, updates: Partial<Brand>) => {
    if (user) {
      const { error } = await supabase
        .from("library_brands")
        .update({
          name: updates.name,
          description: updates.description,
          colors: updates.colors,
          fonts: updates.fonts,
          logo_url: updates.logoUrl,
          additional_notes: updates.additionalNotes,
        })
        .eq("id", id);

      if (!error) {
        setBrands(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
      }
    } else {
      const updated = brands.map(b => (b.id === id ? { ...b, ...updates } : b));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      setBrands(updated);
    }
  }, [user, brands]);

  const removeBrand = useCallback(async (id: string) => {
    if (user) {
      const { error } = await supabase
        .from("library_brands")
        .delete()
        .eq("id", id);

      if (!error) {
        setBrands(prev => prev.filter(b => b.id !== id));
      }
    } else {
      const updated = brands.filter(b => b.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      setBrands(updated);
    }
  }, [user, brands]);

  const getBrand = useCallback((id: string) => {
    return brands.find(b => b.id === id);
  }, [brands]);

  return {
    brands,
    saveBrand,
    updateBrand,
    removeBrand,
    getBrand,
    isLoading,
    isSynced,
  };
}
