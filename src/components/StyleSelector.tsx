import { useState } from "react";
import { ChevronDown, Newspaper, BarChart3, Smile, Rocket, Palette, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ILLUSTRATION_STYLES, STYLE_CATEGORIES, IllustrationStyle, StyleCategory } from "@/data/illustration-styles";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS = {
  Newspaper,
  BarChart3,
  Smile,
  Rocket,
  Palette,
};

interface StyleSelectorProps {
  selectedStyle: IllustrationStyle | null;
  onSelectStyle: (style: IllustrationStyle) => void;
}

export function StyleSelector({ selectedStyle, onSelectStyle }: StyleSelectorProps) {
  const [expandedCategory, setExpandedCategory] = useState<StyleCategory | null>(null);

  const stylesByCategory = STYLE_CATEGORIES.map((category) => ({
    ...category,
    styles: ILLUSTRATION_STYLES.filter((s) => s.category === category.id),
  }));

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
      </div>

      <div className="divide-y divide-border/50">
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
                      const isSelected = selectedStyle?.id === style.id;
                      return (
                        <button
                          key={style.id}
                          onClick={() => onSelectStyle(style)}
                          className={cn(
                            "p-3 rounded-lg text-left transition-all group",
                            isSelected
                              ? "bg-purple-100 border-2 border-purple-400"
                              : "bg-white border border-border hover:border-purple-300 hover:bg-purple-50/50"
                          )}
                        >
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
    </Card>
  );
}
