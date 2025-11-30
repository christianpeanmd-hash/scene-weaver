import { useState, useEffect } from "react";

export interface Brand {
  id: string;
  name: string;
  description: string;
  colors?: string[];
  fonts?: string;
  logoUrl?: string;
  additionalNotes?: string;
  createdAt: number;
}

const STORAGE_KEY = "memoable_brands";

export function useBrandLibrary() {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setBrands(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse brands:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (brands.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(brands));
    }
  }, [brands]);

  const saveBrand = (brand: Omit<Brand, "id" | "createdAt">) => {
    const newBrand: Brand = {
      ...brand,
      id: `brand_${Date.now()}`,
      createdAt: Date.now(),
    };

    const existingIndex = brands.findIndex(
      (b) => b.name.toLowerCase() === brand.name.toLowerCase()
    );

    if (existingIndex >= 0) {
      setBrands((prev) =>
        prev.map((b, i) =>
          i === existingIndex ? { ...newBrand, id: prev[existingIndex].id } : b
        )
      );
    } else {
      setBrands((prev) => [...prev, newBrand]);
    }

    return newBrand;
  };

  const updateBrand = (id: string, updates: Partial<Brand>) => {
    setBrands((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const removeBrand = (id: string) => {
    setBrands((prev) => prev.filter((b) => b.id !== id));
  };

  const getBrand = (id: string) => {
    return brands.find((b) => b.id === id);
  };

  return {
    brands,
    saveBrand,
    updateBrand,
    removeBrand,
    getBrand,
  };
}
