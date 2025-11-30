import { useState } from "react";
import { ChevronDown, Newspaper, BarChart3, Smile, Rocket, Palette, Check, Pencil, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ILLUSTRATION_STYLES, STYLE_CATEGORIES, IllustrationStyle, StyleCategory } from "@/data/illustration-styles";
import { cn } from "@/lib/utils";

// Import style preview images
import editorialCollagePreview from "@/assets/style-previews/editorial-collage-preview.jpg";
import watercolorMinimalism from "@/assets/style-previews/watercolor-minimalism.jpg";
import inkWash from "@/assets/style-previews/ink-wash.jpg";
import surrealistEditorial from "@/assets/style-previews/surrealist-editorial.jpg";
import modernFlatVector from "@/assets/style-previews/modern-flat-vector.jpg";
import isometricBlueprint from "@/assets/style-previews/isometric-blueprint.jpg";
import scientificDiagram from "@/assets/style-previews/scientific-diagram.jpg";
import satiricalCaricature from "@/assets/style-previews/satirical-caricature.jpg";
import lineDrawingXkcd from "@/assets/style-previews/line-drawing-xkcd.jpg";
import popArt from "@/assets/style-previews/pop-art.jpg";
import claymation from "@/assets/style-previews/3d-claymation.jpg";
import childrensBook from "@/assets/style-previews/childrens-book.jpg";
import retroFuturist from "@/assets/style-previews/retro-futurist.jpg";
import futuristicNeon from "@/assets/style-previews/futuristic-neon.jpg";
import minimalGradient from "@/assets/style-previews/minimal-gradient.jpg";
import japaneseWoodblock from "@/assets/style-previews/japanese-woodblock.jpg";
import vintageEngraving from "@/assets/style-previews/vintage-engraving.jpg";

const CATEGORY_ICONS = {
  Newspaper,
  BarChart3,
  Smile,
  Rocket,
  Palette,
};

// Map style IDs to their preview images
const STYLE_PREVIEWS: Record<string, string> = {
  "editorial-collage": editorialCollagePreview,
  "watercolor-minimalism": watercolorMinimalism,
  "ink-wash": inkWash,
  "surrealist-editorial": surrealistEditorial,
  "modern-flat-vector": modernFlatVector,
  "isometric-blueprint": isometricBlueprint,
  "infographic-comic": modernFlatVector, // Reuse similar style
  "scientific-diagram": scientificDiagram,
  "satirical-caricature": satiricalCaricature,
  "line-drawing-xkcd": lineDrawingXkcd,
  "pop-art": popArt,
  "3d-claymation": claymation,
  "childrens-book": childrensBook,
  "retro-futurist": retroFuturist,
  "futuristic-neon": futuristicNeon,
  "brutalist-poster": retroFuturist, // Reuse similar style
  "minimal-gradient": minimalGradient,
  "japanese-woodblock": japaneseWoodblock,
  "vintage-engraving": vintageEngraving,
  "painterly-concept": surrealistEditorial, // Reuse similar style
  "newspaper-halftone": editorialCollagePreview, // Reuse similar style
};

interface StyleSelectorProps {
  selectedStyle: IllustrationStyle | null;
  onSelectStyle: (style: IllustrationStyle | null) => void;
  customStyleText?: string;
  onCustomStyleChange?: (text: string) => void;
}

export function StyleSelector({ 
  selectedStyle, 
  onSelectStyle, 
  customStyleText = "",
  onCustomStyleChange 
}: StyleSelectorProps) {
  const [expandedCategory, setExpandedCategory] = useState<StyleCategory | "custom" | null>(null);
  const [previewStyle, setPreviewStyle] = useState<IllustrationStyle | null>(null);
  const [isCustomMode, setIsCustomMode] = useState(false);

  const stylesByCategory = STYLE_CATEGORIES.map((category) => ({
    ...category,
    styles: ILLUSTRATION_STYLES.filter((s) => s.category === category.id),
  }));

  const handleCustomSelect = () => {
    setIsCustomMode(true);
    onSelectStyle(null);
    setExpandedCategory("custom");
  };

  const handlePresetSelect = (style: IllustrationStyle) => {
    setIsCustomMode(false);
    onSelectStyle(style);
    if (onCustomStyleChange) {
      onCustomStyleChange("");
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Palette className="w-4 h-4 text-purple-500" />
          Illustration Style
          <span className="text-rose-500 text-xs">required</span>
        </label>
        {selectedStyle && (
          <p className="text-sm text-purple-600 mt-1">Selected: {selectedStyle.name}</p>
        )}
        {isCustomMode && customStyleText && (
          <p className="text-sm text-purple-600 mt-1">Using: Custom Style</p>
        )}
      </div>

      <div className="divide-y divide-border/50">
        {/* Custom Style Option */}
        <div>
          <button
            onClick={() => setExpandedCategory(expandedCategory === "custom" ? null : "custom")}
            className={cn(
              "w-full p-4 flex items-center justify-between transition-colors",
              expandedCategory === "custom" ? "bg-purple-50/50" : "hover:bg-slate-50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                isCustomMode ? "bg-purple-100" : "bg-slate-100"
              )}>
                <Pencil className={cn(
                  "w-4 h-4",
                  isCustomMode ? "text-purple-600" : "text-slate-500"
                )} />
              </div>
              <div className="text-left">
                <span className="font-medium text-foreground">Custom Style</span>
                <span className="text-xs text-muted-foreground ml-2">
                  Describe your own
                </span>
              </div>
            </div>
            <ChevronDown className={cn(
              "w-5 h-5 text-muted-foreground transition-transform",
              expandedCategory === "custom" && "rotate-180"
            )} />
          </button>

          {expandedCategory === "custom" && (
            <div className="p-4 pt-0 bg-purple-50/30 animate-fade-in">
              <textarea
                value={customStyleText}
                onChange={(e) => {
                  onCustomStyleChange?.(e.target.value);
                  if (e.target.value) {
                    setIsCustomMode(true);
                    onSelectStyle(null);
                  }
                }}
                placeholder="Describe your illustration style... e.g., 'Minimalist line art with muted earth tones, inspired by Japanese design principles'"
                rows={3}
                className="w-full px-4 py-3 bg-white border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all resize-none text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Tip: Be specific about colors, textures, and artistic influences
              </p>
            </div>
          )}
        </div>

        {/* Preset Categories */}
        {stylesByCategory.map((category) => {
          const IconComponent = CATEGORY_ICONS[category.icon as keyof typeof CATEGORY_ICONS];
          const isExpanded = expandedCategory === category.id;
          const hasSelectedStyle = category.styles.some((s) => s.id === selectedStyle?.id);

          return (
            <div key={category.id}>
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                className={cn(
                  "w-full p-4 flex items-center justify-between transition-colors",
                  isExpanded ? "bg-purple-50/50" : "hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    hasSelectedStyle 
                      ? "bg-purple-100" 
                      : "bg-slate-100"
                  )}>
                    {IconComponent && (
                      <IconComponent className={cn(
                        "w-4 h-4",
                        hasSelectedStyle ? "text-purple-600" : "text-slate-500"
                      )} />
                    )}
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-foreground">{category.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {category.styles.length} styles
                    </span>
                  </div>
                </div>
                <ChevronDown className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform",
                  isExpanded && "rotate-180"
                )} />
              </button>

              {isExpanded && (
                <div className="p-3 pt-0 bg-purple-50/30 animate-fade-in">
                  <div className="grid grid-cols-2 gap-2">
                    {category.styles.map((style) => {
                      const isSelected = selectedStyle?.id === style.id && !isCustomMode;
                      const previewImage = STYLE_PREVIEWS[style.id];
                      
                      return (
                        <button
                          key={style.id}
                          onClick={() => handlePresetSelect(style)}
                          onMouseEnter={() => setPreviewStyle(style)}
                          onMouseLeave={() => setPreviewStyle(null)}
                          className={cn(
                            "p-2 rounded-lg text-left transition-all group relative",
                            isSelected
                              ? "bg-purple-100 border-2 border-purple-400"
                              : "bg-white border border-border hover:border-purple-300 hover:bg-purple-50/50"
                          )}
                        >
                          {/* Style preview thumbnail */}
                          <div className="w-full h-16 rounded-md mb-2 overflow-hidden bg-slate-100">
                            {previewImage ? (
                              <img 
                                src={previewImage} 
                                alt={style.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-100" />
                            )}
                          </div>
                          
                          <div className="flex items-start justify-between gap-1">
                            <div className="flex-1 min-w-0">
                              <span className={cn(
                                "text-xs font-medium block truncate",
                                isSelected ? "text-purple-700" : "text-foreground"
                              )}>
                                {style.name}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                                <Check className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Style Preview Tooltip */}
      {previewStyle && (
        <div className="p-4 border-t border-border/50 bg-gradient-to-r from-purple-50/50 to-pink-50/50 animate-fade-in">
          <div className="flex items-start gap-3">
            <Eye className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">{previewStyle.name}</p>
              <p className="text-muted-foreground mt-1">{previewStyle.look}</p>
              <p className="text-purple-600 text-xs mt-1">Best for: {previewStyle.useCase}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
