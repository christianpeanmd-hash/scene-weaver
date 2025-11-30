import { Check, FileText, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { INFOGRAPHIC_STYLES, InfographicStyle } from "@/data/infographic-styles";
import { useFavoriteStyles } from "@/hooks/useFavoriteStyles";
import { cn } from "@/lib/utils";

interface InfographicStyleSelectorProps {
  selectedStyle: InfographicStyle | null;
  onSelectStyle: (style: InfographicStyle) => void;
}

const STYLE_COLORS: Record<string, { bg: string; icon: string }> = {
  "minimalist-bw": { bg: "from-slate-200 to-slate-100", icon: "bg-slate-800" },
  "sketch-style": { bg: "from-amber-100 to-orange-50", icon: "bg-amber-600" },
  "complex-technical": { bg: "from-blue-100 to-cyan-50", icon: "bg-blue-600" },
  "step-by-step": { bg: "from-violet-100 to-purple-50", icon: "bg-violet-500" },
  "career-map": { bg: "from-emerald-100 to-teal-50", icon: "bg-emerald-600" },
  "cheatsheet": { bg: "from-pink-100 to-rose-50", icon: "bg-pink-500" },
  "landmark-map": { bg: "from-sky-100 to-blue-50", icon: "bg-sky-600" },
  "biology-diagram": { bg: "from-green-100 to-lime-50", icon: "bg-green-600" },
  "mega-infographic": { bg: "from-amber-200 to-orange-100", icon: "bg-amber-700" },
};

export function InfographicStyleSelector({ selectedStyle, onSelectStyle }: InfographicStyleSelectorProps) {
  const { favorites, toggleFavorite, isFavorite } = useFavoriteStyles();
  
  const favoriteStyles = INFOGRAPHIC_STYLES.filter((s) => favorites.infographic.includes(s.id));
  const nonFavoriteStyles = INFOGRAPHIC_STYLES.filter((s) => !favorites.infographic.includes(s.id));

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

      <div className="p-3 bg-muted/30">
        {/* Favorites Section */}
        {favoriteStyles.length > 0 && (
          <div className="mb-3">
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

        {/* All Styles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {nonFavoriteStyles.map((style) => (
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
  const colors = STYLE_COLORS[style.id] || { bg: "from-slate-200 to-slate-100", icon: "bg-slate-500" };

  return (
    <button
      onClick={onSelect}
      className={cn(
        "p-3 rounded-lg text-left transition-all group relative",
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

      {/* Mini style preview */}
      <div className={cn(
        "w-full h-10 rounded-md mb-2 bg-gradient-to-br relative overflow-hidden",
        colors.bg
      )}>
        <div className={cn("absolute bottom-1 right-1 w-3 h-3 rounded", colors.icon)} />
        <div className={cn("absolute top-1 left-1 w-5 h-0.5 rounded-full", colors.icon, "opacity-60")} />
        <div className={cn("absolute top-2.5 left-1 w-3 h-0.5 rounded-full", colors.icon, "opacity-40")} />
      </div>
      
      <div className="flex items-start justify-between gap-1">
        <div className="flex-1 min-w-0">
          <span className={cn(
            "text-xs font-medium block truncate",
            isSelected ? "text-amber-700 dark:text-amber-300" : "text-foreground"
          )}>
            {style.name}
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
