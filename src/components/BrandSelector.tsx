import { useState } from "react";
import { ChevronDown, Plus, Sparkles, X, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBrandLibrary, Brand } from "@/hooks/useBrandLibrary";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BrandSelectorProps {
  selectedBrand: Brand | null;
  onSelectBrand: (brand: Brand | null) => void;
  customBrandText?: string;
  onCustomBrandChange?: (text: string) => void;
}

export function BrandSelector({
  selectedBrand,
  onSelectBrand,
  customBrandText = "",
  onCustomBrandChange,
}: BrandSelectorProps) {
  const { brands, saveBrand } = useBrandLibrary();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandDescription, setNewBrandDescription] = useState("");
  const [newBrandColors, setNewBrandColors] = useState("");
  const [newBrandFonts, setNewBrandFonts] = useState("");

  const handleSaveBrand = () => {
    if (!newBrandName.trim()) {
      toast.error("Please enter a brand name");
      return;
    }
    if (!newBrandDescription.trim()) {
      toast.error("Please enter a brand description");
      return;
    }

    const brand = saveBrand({
      name: newBrandName.trim(),
      description: newBrandDescription.trim(),
      colors: newBrandColors.trim()
        ? newBrandColors.split(",").map((c) => c.trim())
        : undefined,
      fonts: newBrandFonts.trim() || undefined,
    });

    onSelectBrand(brand);
    setIsCreating(false);
    setNewBrandName("");
    setNewBrandDescription("");
    setNewBrandColors("");
    setNewBrandFonts("");
    toast.success("Brand saved to library!");
  };

  const handleSelectBrand = (brand: Brand) => {
    onSelectBrand(brand);
    if (onCustomBrandChange) {
      onCustomBrandChange("");
    }
    setIsExpanded(false);
  };

  const handleCustomChange = (text: string) => {
    onCustomBrandChange?.(text);
    if (text) {
      onSelectBrand(null);
    }
  };

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-foreground">Brand / Theme</span>
          <span className="text-muted-foreground text-xs">optional</span>
        </div>
        <div className="flex items-center gap-2">
          {(selectedBrand || customBrandText) && (
            <span className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
              {selectedBrand?.name || "Custom"}
            </span>
          )}
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-border/50 bg-muted/20 animate-fade-in">
          {/* Saved Brands */}
          {brands.length > 0 && (
            <div className="p-3 border-b border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-2">Saved Brands</p>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => handleSelectBrand(brand)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                      selectedBrand?.id === brand.id
                        ? "bg-amber-500 text-white"
                        : "bg-card border border-border hover:border-amber-300"
                    )}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Description */}
          <div className="p-3 border-b border-border/50">
            <p className="text-xs font-medium text-muted-foreground mb-2">Quick Brand Description</p>
            <textarea
              value={customBrandText}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="Describe your brand... e.g., 'Professional tech company with blue and white colors, modern minimal aesthetic'"
              rows={2}
              className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all resize-none"
            />
          </div>

          {/* Create New Brand */}
          {!isCreating ? (
            <div className="p-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreating(true)}
                className="w-full gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Brand Kit
              </Button>
            </div>
          ) : (
            <div className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-foreground">New Brand Kit</p>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setIsCreating(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <input
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Brand name"
                className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
              />

              <textarea
                value={newBrandDescription}
                onChange={(e) => setNewBrandDescription(e.target.value)}
                placeholder="Brand description and visual style..."
                rows={2}
                className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 resize-none"
              />

              <input
                value={newBrandColors}
                onChange={(e) => setNewBrandColors(e.target.value)}
                placeholder="Brand colors (comma separated, e.g., #1a73e8, #ea4335)"
                className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
              />

              <input
                value={newBrandFonts}
                onChange={(e) => setNewBrandFonts(e.target.value)}
                placeholder="Font preferences (e.g., Montserrat, clean sans-serif)"
                className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
              />

              <Button
                onClick={handleSaveBrand}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                size="sm"
              >
                Save Brand to Library
              </Button>
            </div>
          )}

          {/* Clear Selection */}
          {(selectedBrand || customBrandText) && (
            <div className="p-3 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onSelectBrand(null);
                  onCustomBrandChange?.("");
                }}
                className="w-full text-muted-foreground"
              >
                Clear brand selection
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
