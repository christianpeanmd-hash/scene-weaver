import { useState } from "react";
import { ChevronDown, Newspaper, BarChart3, Smile, Rocket, Palette, Check, Pencil, Eye, Star, Target, Save, Scale } from "lucide-react";
import { useFavoriteStyles } from "@/hooks/useFavoriteStyles";
import { useSceneStyleLibrary } from "@/hooks/useSceneStyleLibrary";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ILLUSTRATION_STYLES, STYLE_CATEGORIES, IllustrationStyle, StyleCategory } from "@/data/illustration-styles";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { StyleComparisonPanel } from "./StyleComparisonPanel";

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
// Marketing style previews
import corporateGradient from "@/assets/style-previews/corporate-gradient.jpg";
import lifestyleBrand from "@/assets/style-previews/lifestyle-brand.jpg";
import techProduct from "@/assets/style-previews/tech-product.jpg";
import boldTypography from "@/assets/style-previews/bold-typography.jpg";
import glassmorphism from "@/assets/style-previews/glassmorphism.jpg";
import duotoneImpact from "@/assets/style-previews/duotone-impact.jpg";
import abstract3d from "@/assets/style-previews/3d-abstract.jpg";
import photoCutout from "@/assets/style-previews/photo-cutout.jpg";
// New style previews
import stickFigure from "@/assets/style-previews/stick-figure.jpg";
import darkHumor from "@/assets/style-previews/dark-humor.jpg";
import impressionist from "@/assets/style-previews/impressionist.jpg";
import classicPortrait from "@/assets/style-previews/classic-portrait.jpg";
import editorialGravitas from "@/assets/style-previews/editorial-gravitas.jpg";
import strategyDiagram from "@/assets/style-previews/strategy-diagram.jpg";
import infographicComic from "@/assets/style-previews/infographic-comic.jpg";
import digitalFuturism from "@/assets/style-previews/digital-futurism.jpg";
import whiteboardSketch from "@/assets/style-previews/whiteboard-sketch.jpg";
import timelineJourney from "@/assets/style-previews/timeline-journey.jpg";
import painterlyConcept from "@/assets/style-previews/painterly-concept.jpg";
import newspaperHalftone from "@/assets/style-previews/newspaper-halftone.jpg";
import brutalistPoster from "@/assets/style-previews/brutalist-poster.jpg";

const CATEGORY_ICONS = {
  Target,
  Newspaper,
  BarChart3,
  Smile,
  Rocket,
  Palette,
};

// Map style IDs to their preview images
const STYLE_PREVIEWS: Record<string, string> = {
  // Marketing styles
  "corporate-gradient": corporateGradient,
  "lifestyle-brand": lifestyleBrand,
  "tech-product": techProduct,
  "bold-typography": boldTypography,
  "glassmorphism": glassmorphism,
  "duotone-impact": duotoneImpact,
  "3d-abstract": abstract3d,
  "photo-cutout": photoCutout,
  // Editorial styles
  "editorial-collage": editorialCollagePreview,
  "watercolor-minimalism": watercolorMinimalism,
  "ink-wash": inkWash,
  "surrealist-editorial": surrealistEditorial,
  "editorial-gravitas": editorialGravitas,
  // Explainer styles
  "modern-flat-vector": modernFlatVector,
  "isometric-blueprint": isometricBlueprint,
  "infographic-comic": infographicComic,
  "scientific-diagram": scientificDiagram,
  "strategy-diagram": strategyDiagram,
  "whiteboard-sketch": whiteboardSketch,
  "timeline-journey": timelineJourney,
  // Humor styles
  "satirical-caricature": satiricalCaricature,
  "line-drawing-xkcd": lineDrawingXkcd,
  "pop-art": popArt,
  "3d-claymation": claymation,
  "childrens-book": childrensBook,
  "stick-figure": stickFigure,
  "dark-humor": darkHumor,
  // Futurism styles
  "retro-futurist": retroFuturist,
  "futuristic-neon": futuristicNeon,
  "brutalist-poster": brutalistPoster,
  "minimal-gradient": minimalGradient,
  "digital-futurism": digitalFuturism,
  // Artistic styles
  "japanese-woodblock": japaneseWoodblock,
  "vintage-engraving": vintageEngraving,
  "painterly-concept": painterlyConcept,
  "newspaper-halftone": newspaperHalftone,
  "classic-portrait": classicPortrait,
  "impressionist": impressionist,
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
  const [expandedCategory, setExpandedCategory] = useState<StyleCategory | "custom" | "favorites" | "saved" | null>(null);
  const [previewStyle, setPreviewStyle] = useState<IllustrationStyle | null>(null);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [styleName, setStyleName] = useState("");
  const [comparisonStyles, setComparisonStyles] = useState<IllustrationStyle[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const { favorites, toggleFavorite, isFavorite } = useFavoriteStyles();
  const { savedStyles, saveStyle } = useSceneStyleLibrary("image");

  const isInComparison = (styleId: string) => comparisonStyles.some(s => s.id === styleId);

  const toggleComparison = (style: IllustrationStyle, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInComparison(style.id)) {
      setComparisonStyles(prev => prev.filter(s => s.id !== style.id));
    } else if (comparisonStyles.length < 3) {
      setComparisonStyles(prev => [...prev, style]);
    } else {
      toast.error("Maximum 3 styles for comparison");
    }
  };

  const handleComparisonSelect = (style: IllustrationStyle) => {
    handlePresetSelect(style);
    setComparisonStyles([]);
    setShowComparison(false);
  };

  const favoriteStyles = ILLUSTRATION_STYLES.filter((s) => favorites.illustration.includes(s.id));

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
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Palette className="w-4 h-4 text-purple-500" />
            Illustration Style
            <span className="text-rose-500 text-xs">required</span>
          </label>
          {comparisonStyles.length > 0 && (
            <Button
              variant="soft"
              size="sm"
              onClick={() => setShowComparison(true)}
              className="text-xs"
            >
              <Scale className="w-3 h-3 mr-1" />
              Compare ({comparisonStyles.length})
            </Button>
          )}
        </div>
        {selectedStyle && (
          <p className="text-sm text-purple-600 mt-1">Selected: {selectedStyle.name}</p>
        )}
        {isCustomMode && customStyleText && (
          <p className="text-sm text-purple-600 mt-1">Using: Custom Style</p>
        )}
      </div>

      <div className="divide-y divide-border/50">
        {/* Favorites Section */}
        {favoriteStyles.length > 0 && (
          <div>
            <button
              onClick={() => setExpandedCategory(expandedCategory === "favorites" ? null : "favorites")}
              className={cn(
                "w-full p-4 flex items-center justify-between transition-colors",
                expandedCategory === "favorites" ? "bg-amber-50/50 dark:bg-amber-950/20" : "hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <div className="text-left">
                  <span className="font-medium text-foreground">Favorites</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {favoriteStyles.length} saved
                  </span>
                </div>
              </div>
              <ChevronDown className={cn(
                "w-5 h-5 text-muted-foreground transition-transform",
                expandedCategory === "favorites" && "rotate-180"
              )} />
            </button>

            {expandedCategory === "favorites" && (
              <div className="p-3 pt-0 bg-amber-50/30 dark:bg-amber-950/10 animate-fade-in">
                <div className="grid grid-cols-2 gap-2">
                  {favoriteStyles.map((style) => {
                    const isSelected = selectedStyle?.id === style.id && !isCustomMode;
                    const previewImage = STYLE_PREVIEWS[style.id];
                    
                    return (
                      <button
                        key={style.id}
                        onClick={() => handlePresetSelect(style)}
                        className={cn(
                          "p-2 rounded-lg text-left transition-all group relative",
                          isSelected
                            ? "bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-400"
                            : "bg-card border border-border hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-950/20"
                        )}
                      >
                        <div className="absolute top-1 right-1 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => toggleComparison(style, e)}
                            className={cn(
                              "p-1 rounded-full bg-card/80 hover:bg-card",
                              isInComparison(style.id) && "bg-blue-100 dark:bg-blue-900/50"
                            )}
                            title={isInComparison(style.id) ? "Remove from comparison" : "Add to compare"}
                          >
                            <Scale className={cn(
                              "w-3 h-3",
                              isInComparison(style.id) 
                                ? "text-blue-500" 
                                : "text-muted-foreground"
                            )} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite("illustration", style.id);
                            }}
                            className="p-1 rounded-full bg-card/80 hover:bg-card"
                          >
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          </button>
                        </div>
                        <div className="w-full h-16 rounded-md mb-2 overflow-hidden bg-muted">
                          {previewImage ? (
                            <img src={previewImage} alt={style.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10" />
                          )}
                        </div>
                        <span className={cn(
                          "text-xs font-medium block truncate",
                          isSelected ? "text-purple-700 dark:text-purple-300" : "text-foreground"
                        )}>
                          {style.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

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
            <div className="p-4 pt-0 bg-purple-50/30 animate-fade-in space-y-3">
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
              
              {/* Save custom style */}
              {customStyleText && customStyleText.length > 20 && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={styleName}
                    onChange={(e) => setStyleName(e.target.value)}
                    placeholder="Style name..."
                    className="flex-1 px-3 py-2 bg-white border border-border rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                  />
                  <Button
                    variant="soft"
                    size="sm"
                    disabled={!styleName.trim()}
                    onClick={async () => {
                      await saveStyle({
                        name: styleName.trim(),
                        description: customStyleText.slice(0, 100),
                        template: customStyleText,
                      });
                      toast.success(`Saved "${styleName}" to your style library`);
                      setStyleName("");
                    }}
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                Tip: Be specific about colors, textures, and artistic influences
              </p>
            </div>
          )}
        </div>

        {/* Saved Custom Styles */}
        {savedStyles.length > 0 && (
          <div>
            <button
              onClick={() => setExpandedCategory(expandedCategory === "saved" ? null : "saved")}
              className={cn(
                "w-full p-4 flex items-center justify-between transition-colors",
                expandedCategory === "saved" ? "bg-purple-50/50 dark:bg-purple-950/20" : "hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Save className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-left">
                  <span className="font-medium text-foreground">Saved Styles</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {savedStyles.length} custom
                  </span>
                </div>
              </div>
              <ChevronDown className={cn(
                "w-5 h-5 text-muted-foreground transition-transform",
                expandedCategory === "saved" && "rotate-180"
              )} />
            </button>

            {expandedCategory === "saved" && (
              <div className="p-3 pt-0 bg-purple-50/30 dark:bg-purple-950/10 animate-fade-in">
                <div className="grid grid-cols-2 gap-2">
                  {savedStyles.map((style) => {
                    const isSelected = isCustomMode && customStyleText === style.template;
                    
                    return (
                      <button
                        key={style.id}
                        onClick={() => {
                          setIsCustomMode(true);
                          onSelectStyle(null);
                          onCustomStyleChange?.(style.template);
                        }}
                        className={cn(
                          "p-2 rounded-lg text-left transition-all",
                          isSelected
                            ? "bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-400"
                            : "bg-card border border-border hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-950/20"
                        )}
                      >
                        <div className="w-full h-12 rounded-md mb-2 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                          <Pencil className="w-4 h-4 text-purple-400" />
                        </div>
                        <span className={cn(
                          "text-xs font-medium block truncate",
                          isSelected ? "text-purple-700 dark:text-purple-300" : "text-foreground"
                        )}>
                          {style.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground line-clamp-1">
                          {style.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

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
                              ? "bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-400"
                              : "bg-card border border-border hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-950/20"
                          )}
                        >
                          {/* Action buttons */}
                          <div className="absolute top-1 right-1 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => toggleComparison(style, e)}
                              className={cn(
                                "p-1 rounded-full bg-card/80 hover:bg-card",
                                isInComparison(style.id) && "bg-blue-100 dark:bg-blue-900/50"
                              )}
                              title={isInComparison(style.id) ? "Remove from comparison" : "Add to compare"}
                            >
                              <Scale className={cn(
                                "w-3 h-3",
                                isInComparison(style.id) 
                                  ? "text-blue-500" 
                                  : "text-muted-foreground"
                              )} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite("illustration", style.id);
                              }}
                              className="p-1 rounded-full bg-card/80 hover:bg-card"
                            >
                              <Star className={cn(
                                "w-3 h-3",
                                isFavorite("illustration", style.id) 
                                  ? "text-amber-500 fill-amber-500" 
                                  : "text-muted-foreground"
                              )} />
                            </button>
                          </div>

                          {/* Style preview thumbnail */}
                          <div className="w-full h-16 rounded-md mb-2 overflow-hidden bg-muted">
                            {previewImage ? (
                              <img 
                                src={previewImage} 
                                alt={style.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10" />
                            )}
                          </div>
                          
                          <div className="flex items-start justify-between gap-1">
                            <div className="flex-1 min-w-0">
                              <span className={cn(
                                "text-xs font-medium block truncate",
                                isSelected ? "text-purple-700 dark:text-purple-300" : "text-foreground"
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

      {/* Style Comparison Panel */}
      {showComparison && comparisonStyles.length > 0 && (
        <StyleComparisonPanel
          styles={comparisonStyles}
          previewImages={STYLE_PREVIEWS}
          onSelect={handleComparisonSelect}
          onRemove={(styleId) => setComparisonStyles(prev => prev.filter(s => s.id !== styleId))}
          onClose={() => setShowComparison(false)}
        />
      )}
    </Card>
  );
}
