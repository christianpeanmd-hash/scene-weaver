import { Check, FileText, Star, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { INFOGRAPHIC_STYLES, INFOGRAPHIC_CATEGORIES, InfographicStyle } from "@/data/infographic-styles";
import { useFavoriteStyles } from "@/hooks/useFavoriteStyles";
import { cn } from "@/lib/utils";

// Import preview images
import explainerPreview from "@/assets/infographic-previews/explainer.jpg";
import dataPreview from "@/assets/infographic-previews/data-driven.jpg";
import timelinePreview from "@/assets/infographic-previews/timeline.jpg";
import comparisonPreview from "@/assets/infographic-previews/comparison.jpg";
import checklistPreview from "@/assets/infographic-previews/checklist.jpg";
import processPreview from "@/assets/infographic-previews/process-flow.jpg";
import educationalPreview from "@/assets/infographic-previews/educational.jpg";
import stepByStepPreview from "@/assets/infographic-previews/step-by-step.jpg";
import complexTechnicalPreview from "@/assets/infographic-previews/complex-technical.jpg";
import careerMapPreview from "@/assets/infographic-previews/career-map.jpg";
import leadMagnetPreview from "@/assets/infographic-previews/lead-magnet.jpg";
import productBenefitsPreview from "@/assets/infographic-previews/product-benefits.jpg";
import socialMediaPreview from "@/assets/infographic-previews/social-media.jpg";
import cheatsheetPreview from "@/assets/infographic-previews/cheatsheet.jpg";
import biologyDiagramPreview from "@/assets/infographic-previews/biology-diagram.jpg";
import minimalistBwPreview from "@/assets/infographic-previews/minimalist-bw.jpg";
import sketchStylePreview from "@/assets/infographic-previews/sketch-style.jpg";
import landmarkMapPreview from "@/assets/infographic-previews/landmark-map.jpg";
import megaInfographicPreview from "@/assets/infographic-previews/mega-infographic.jpg";
import whiteboardPreview from "@/assets/infographic-previews/whiteboard.jpg";
import visualAbstractPreview from "@/assets/infographic-previews/visual-abstract.jpg";

interface InfographicStyleSelectorProps {
  selectedStyle: InfographicStyle | null;
  onSelectStyle: (style: InfographicStyle) => void;
}

// Preview images for styles that have them
const STYLE_PREVIEW_IMAGES: Record<string, string> = {
  "explainer": explainerPreview,
  "data-driven": dataPreview,
  "timeline": timelinePreview,
  "comparison": comparisonPreview,
  "checklist": checklistPreview,
  "process-flow": processPreview,
  "educational": educationalPreview,
  "step-by-step": stepByStepPreview,
  "complex-technical": complexTechnicalPreview,
  "career-map": careerMapPreview,
  "lead-magnet": leadMagnetPreview,
  "product-benefits": productBenefitsPreview,
  "social-media": socialMediaPreview,
  "cheatsheet": cheatsheetPreview,
  "biology-diagram": biologyDiagramPreview,
  "minimalist-bw": minimalistBwPreview,
  "sketch-style": sketchStylePreview,
  "landmark-map": landmarkMapPreview,
  "mega-infographic": megaInfographicPreview,
  "whiteboard": whiteboardPreview,
  "visual-abstract": visualAbstractPreview,
};

// Visual preview configurations for each style type (fallback when no image)
const STYLE_PREVIEWS: Record<string, { 
  bg: string; 
  accent: string;
  layout: "steps" | "columns" | "timeline" | "grid" | "list" | "chart" | "map" | "custom";
}> = {
  "explainer": { bg: "from-blue-100 to-indigo-50", accent: "bg-blue-500", layout: "steps" },
  "educational": { bg: "from-violet-100 to-purple-50", accent: "bg-violet-500", layout: "grid" },
  "whiteboard": { bg: "from-gray-50 to-white", accent: "bg-blue-600", layout: "custom" },
  "visual-abstract": { bg: "from-purple-200 to-blue-200", accent: "bg-purple-500", layout: "custom" },
  "step-by-step": { bg: "from-teal-100 to-cyan-50", accent: "bg-teal-500", layout: "steps" },
  "data-driven": { bg: "from-emerald-100 to-green-50", accent: "bg-emerald-500", layout: "chart" },
  "comparison": { bg: "from-amber-100 to-yellow-50", accent: "bg-amber-500", layout: "columns" },
  "complex-technical": { bg: "from-slate-200 to-slate-100", accent: "bg-slate-600", layout: "grid" },
  "timeline": { bg: "from-rose-100 to-pink-50", accent: "bg-rose-500", layout: "timeline" },
  "process-flow": { bg: "from-orange-100 to-amber-50", accent: "bg-orange-500", layout: "steps" },
  "career-map": { bg: "from-emerald-100 to-teal-50", accent: "bg-emerald-600", layout: "map" },
  "lead-magnet": { bg: "from-fuchsia-100 to-pink-50", accent: "bg-fuchsia-500", layout: "list" },
  "product-benefits": { bg: "from-sky-100 to-blue-50", accent: "bg-sky-500", layout: "grid" },
  "checklist": { bg: "from-lime-100 to-green-50", accent: "bg-lime-600", layout: "list" },
  "social-media": { bg: "from-pink-100 to-rose-50", accent: "bg-pink-500", layout: "steps" },
  "cheatsheet": { bg: "from-indigo-100 to-violet-50", accent: "bg-indigo-500", layout: "list" },
  "biology-diagram": { bg: "from-green-100 to-emerald-50", accent: "bg-green-600", layout: "chart" },
  "minimalist-bw": { bg: "from-gray-200 to-gray-100", accent: "bg-gray-800", layout: "grid" },
  "sketch-style": { bg: "from-amber-100 to-orange-50", accent: "bg-amber-600", layout: "custom" },
  "landmark-map": { bg: "from-sky-100 to-cyan-50", accent: "bg-sky-600", layout: "map" },
  "mega-infographic": { bg: "from-violet-100 to-pink-100", accent: "bg-violet-500", layout: "custom" },
};

export function InfographicStyleSelector({ selectedStyle, onSelectStyle }: InfographicStyleSelectorProps) {
  const { favorites, toggleFavorite, isFavorite } = useFavoriteStyles();
  // Start with all categories collapsed, user expands what they want
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  
  const favoriteStyles = INFOGRAPHIC_STYLES.filter((s) => favorites.infographic.includes(s.id));

  const getStylesByCategory = (categoryId: string) => 
    INFOGRAPHIC_STYLES.filter((s) => s.category === categoryId && !favorites.infographic.includes(s.id));

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <FileText className="w-4 h-4 text-amber-500" />
          Infographic Style
          <span className="text-rose-500 text-xs">required</span>
        </label>
        {selectedStyle && (
          <p className="text-sm text-amber-600 mt-1">Selected: {selectedStyle.name}</p>
        )}
      </div>

      <div className="p-3 bg-muted/30 space-y-3">
        {/* Favorites Section */}
        {favoriteStyles.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              Favorites
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {favoriteStyles.map((style) => (
                <StyleButton
                  key={style.id}
                  style={style}
                  isSelected={selectedStyle?.id === style.id}
                  isFavorite={true}
                  onSelect={() => onSelectStyle(style)}
                  onToggleFavorite={() => toggleFavorite("infographic", style.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Categorized Styles */}
        {INFOGRAPHIC_CATEGORIES.map((category) => {
          const styles = getStylesByCategory(category.id);
          if (styles.length === 0) return null;
          
          const isCollapsed = collapsedCategories.has(category.id);
          
          return (
            <div key={category.id}>
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between text-xs font-medium text-muted-foreground mb-2 hover:text-foreground transition-colors py-1"
              >
                <span className="flex items-center gap-1.5">
                  <span>{category.icon}</span>
                  {category.name}
                  <span className="text-muted-foreground/60">({styles.length})</span>
                </span>
                <ChevronDown className={cn(
                  "w-3.5 h-3.5 transition-transform",
                  !isCollapsed && "rotate-180"
                )} />
              </button>
              
              {!isCollapsed && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 animate-fade-in">
                  {styles.map((style) => (
                    <StyleButton
                      key={style.id}
                      style={style}
                      isSelected={selectedStyle?.id === style.id}
                      isFavorite={isFavorite("infographic", style.id)}
                      onSelect={() => onSelectStyle(style)}
                      onToggleFavorite={() => toggleFavorite("infographic", style.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function StyleButton({
  style,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
}: {
  style: InfographicStyle;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}) {
  const preview = STYLE_PREVIEWS[style.id] || { bg: "from-slate-200 to-slate-100", accent: "bg-slate-500", layout: "grid" };
  const previewImage = STYLE_PREVIEW_IMAGES[style.id];

  return (
    <button
      onClick={onSelect}
      className={cn(
        "p-2 rounded-lg text-left transition-all group relative",
        isSelected
          ? "bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-400"
          : "bg-card border border-border hover:border-amber-300 hover:bg-amber-50/50 dark:hover:bg-amber-950/20"
      )}
    >
      {/* Favorite toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={cn(
          "absolute top-1 right-1 z-10 p-1 rounded-full bg-card/80 hover:bg-card transition-opacity",
          isFavorite ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <Star className={cn(
          "w-3 h-3",
          isFavorite ? "text-amber-500 fill-amber-500" : "text-muted-foreground"
        )} />
      </button>

      {/* Visual preview - use image if available, otherwise use layout preview */}
      <div className={cn(
        "w-full h-16 rounded-md mb-2 relative overflow-hidden",
        !previewImage && "bg-gradient-to-br p-1.5",
        !previewImage && preview.bg
      )}>
        {previewImage ? (
          <img 
            src={previewImage} 
            alt={style.name}
            className="w-full h-full object-cover rounded-sm"
          />
        ) : (
          <LayoutPreview layout={preview.layout} accent={preview.accent} />
        )}
      </div>
      
      <div className="flex items-start justify-between gap-1">
        <div className="flex-1 min-w-0">
          <span className={cn(
            "text-xs font-medium block truncate",
            isSelected ? "text-amber-700 dark:text-amber-300" : "text-foreground"
          )}>
            {style.name}
          </span>
          <span className="text-[10px] text-muted-foreground line-clamp-1">
            {style.useCase}
          </span>
        </div>
        {isSelected && (
          <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
            <Check className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>
    </button>
  );
}

// Visual layout preview component (fallback when no image)
function LayoutPreview({ layout, accent }: { layout: string; accent: string }) {
  switch (layout) {
    case "steps":
      return (
        <div className="h-full flex flex-col justify-between">
          <div className={cn("w-full h-1.5 rounded-full", accent, "opacity-80")} />
          <div className="flex items-center gap-1">
            <div className={cn("w-3 h-3 rounded-full", accent)} />
            <div className={cn("flex-1 h-1 rounded-full", accent, "opacity-40")} />
          </div>
          <div className="flex items-center gap-1">
            <div className={cn("w-3 h-3 rounded-full", accent)} />
            <div className={cn("flex-1 h-1 rounded-full", accent, "opacity-40")} />
          </div>
          <div className="flex items-center gap-1">
            <div className={cn("w-3 h-3 rounded-full", accent)} />
            <div className={cn("flex-1 h-1 rounded-full", accent, "opacity-40")} />
          </div>
        </div>
      );
    case "columns":
      return (
        <div className="h-full flex gap-1">
          <div className="flex-1 flex flex-col gap-0.5">
            <div className={cn("h-2 rounded", accent, "opacity-70")} />
            <div className={cn("flex-1 rounded", accent, "opacity-20")} />
          </div>
          <div className="w-px bg-current opacity-20" />
          <div className="flex-1 flex flex-col gap-0.5">
            <div className={cn("h-2 rounded", accent, "opacity-70")} />
            <div className={cn("flex-1 rounded", accent, "opacity-20")} />
          </div>
        </div>
      );
    case "timeline":
      return (
        <div className="h-full flex items-center relative">
          <div className={cn("w-full h-0.5 rounded-full", accent, "opacity-60")} />
          <div className="absolute inset-x-1 flex justify-between">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className={cn("w-2 h-2 rounded-full", accent)} />
                <div className={cn("w-3 h-0.5 rounded-full", accent, "opacity-40")} />
              </div>
            ))}
          </div>
        </div>
      );
    case "grid":
      return (
        <div className="h-full grid grid-cols-2 gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={cn("rounded", accent, i === 0 ? "opacity-70" : "opacity-30")} />
          ))}
        </div>
      );
    case "list":
      return (
        <div className="h-full flex flex-col justify-between">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={cn("w-2 h-2 rounded-sm", accent, "opacity-80")} />
              <div className={cn("flex-1 h-1 rounded-full", accent, "opacity-40")} />
            </div>
          ))}
        </div>
      );
    case "chart":
      return (
        <div className="h-full flex items-end gap-0.5 pt-2">
          {[60, 80, 40, 90, 55, 75].map((h, i) => (
            <div 
              key={i} 
              className={cn("flex-1 rounded-t", accent)}
              style={{ height: `${h}%`, opacity: 0.5 + (i * 0.1) }}
            />
          ))}
        </div>
      );
    case "map":
      return (
        <div className="h-full relative">
          <div className={cn("absolute top-1 left-1 w-2 h-3 rounded-t-full", accent, "opacity-70")} />
          <div className={cn("absolute top-2 right-2 w-1.5 h-2.5 rounded-t-full", accent, "opacity-50")} />
          <div className={cn("absolute bottom-1 left-1/3 w-2.5 h-3.5 rounded-t-full", accent, "opacity-60")} />
          <div className={cn("absolute bottom-0 inset-x-0 h-1 rounded", accent, "opacity-20")} />
        </div>
      );
    case "custom":
    default:
      return (
        <div className="h-full flex flex-col gap-1">
          <div className={cn("h-2 rounded", accent, "opacity-70")} />
          <div className="flex-1 flex gap-1">
            <div className={cn("w-1/3 rounded", accent, "opacity-30")} />
            <div className={cn("flex-1 rounded", accent, "opacity-20")} />
          </div>
          <div className={cn("h-1.5 rounded", accent, "opacity-40")} />
        </div>
      );
  }
}