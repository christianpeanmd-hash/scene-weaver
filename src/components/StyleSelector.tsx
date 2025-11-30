import { useState } from "react";
import { ChevronDown, Newspaper, BarChart3, Smile, Rocket, Palette, Check, Plus, Pencil, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ILLUSTRATION_STYLES, STYLE_CATEGORIES, IllustrationStyle, StyleCategory } from "@/data/illustration-styles";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS = {
  Newspaper,
  BarChart3,
  Smile,
  Rocket,
  Palette,
};

// Preview images for styles (we'll use placeholders that represent the style)
const STYLE_PREVIEW_COLORS: Record<string, { bg: string; accent: string }> = {
  "editorial-collage": { bg: "from-burgundy-500/20 to-navy-500/20", accent: "bg-amber-700" },
  "watercolor-minimalism": { bg: "from-rose-200/40 to-sky-200/40", accent: "bg-slate-400" },
  "ink-wash": { bg: "from-slate-200 to-slate-100", accent: "bg-slate-800" },
  "surrealist-editorial": { bg: "from-amber-200/30 to-slate-300/30", accent: "bg-amber-600" },
  "modern-flat-vector": { bg: "from-violet-400/30 to-pink-400/30", accent: "bg-violet-500" },
  "isometric-blueprint": { bg: "from-cyan-200/40 to-blue-200/40", accent: "bg-cyan-600" },
  "infographic-comic": { bg: "from-yellow-200/40 to-orange-200/40", accent: "bg-orange-500" },
  "scientific-diagram": { bg: "from-slate-100 to-blue-50", accent: "bg-blue-600" },
  "satirical-caricature": { bg: "from-slate-200 to-slate-100", accent: "bg-slate-900" },
  "line-drawing-xkcd": { bg: "from-white to-slate-50", accent: "bg-slate-800" },
  "pop-art": { bg: "from-yellow-300/50 to-pink-400/50", accent: "bg-red-500" },
  "3d-claymation": { bg: "from-orange-200/40 to-pink-200/40", accent: "bg-orange-400" },
  "childrens-book": { bg: "from-pink-200/40 to-yellow-200/40", accent: "bg-pink-400" },
  "retro-futurist": { bg: "from-orange-300/40 to-teal-300/40", accent: "bg-orange-500" },
  "futuristic-neon": { bg: "from-purple-900/40 to-cyan-900/40", accent: "bg-cyan-400" },
  "brutalist-poster": { bg: "from-red-200/40 to-slate-200/40", accent: "bg-red-600" },
  "minimal-gradient": { bg: "from-purple-100/40 to-pink-100/40", accent: "bg-purple-400" },
  "japanese-woodblock": { bg: "from-amber-100/40 to-rose-100/40", accent: "bg-amber-700" },
  "vintage-engraving": { bg: "from-amber-100 to-amber-50", accent: "bg-slate-800" },
  "painterly-concept": { bg: "from-amber-200/30 to-slate-300/30", accent: "bg-amber-800" },
  "newspaper-halftone": { bg: "from-slate-200 to-slate-100", accent: "bg-slate-700" },
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
                      const colors = STYLE_PREVIEW_COLORS[style.id] || { bg: "from-slate-200 to-slate-100", accent: "bg-slate-500" };
                      
                      return (
                        <button
                          key={style.id}
                          onClick={() => handlePresetSelect(style)}
                          onMouseEnter={() => setPreviewStyle(style)}
                          onMouseLeave={() => setPreviewStyle(null)}
                          className={cn(
                            "p-3 rounded-lg text-left transition-all group relative",
                            isSelected
                              ? "bg-purple-100 border-2 border-purple-400"
                              : "bg-white border border-border hover:border-purple-300 hover:bg-purple-50/50"
                          )}
                        >
                          {/* Mini style preview */}
                          <div className={cn(
                            "w-full h-12 rounded-md mb-2 bg-gradient-to-br relative overflow-hidden",
                            colors.bg
                          )}>
                            <div className={cn("absolute bottom-1 right-1 w-4 h-4 rounded-full", colors.accent)} />
                            <div className={cn("absolute top-1 left-1 w-6 h-1 rounded-full", colors.accent, "opacity-60")} />
                          </div>
                          
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <span className={cn(
                                "text-sm font-medium block truncate",
                                isSelected ? "text-purple-700" : "text-foreground"
                              )}>
                                {style.name}
                              </span>
                              <span className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                {style.feel}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-white" />
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
