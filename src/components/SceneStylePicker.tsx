import { useState } from "react";
import { Palette, ChevronDown, ChevronUp, Plus, Library, Save, Check, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SCENE_STYLE_PRESETS, SceneStylePreset, STYLE_CATEGORIES } from "@/data/scene-style-presets";
import { SceneStyle } from "@/hooks/useSceneStyleLibrary";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SceneStylePickerProps {
  selectedStyleIds?: string[];
  savedStyles: SceneStyle[];
  onSelectPreset: (preset: SceneStylePreset) => void;
  onDeselectPreset?: (presetId: string) => void;
  onSelectSaved: (style: SceneStyle) => void;
  onDeselectSaved?: (styleId: string) => void;
  onSaveCurrentAsStyle?: () => void;
  currentDescription?: string;
  multiSelect?: boolean;
}

export function SceneStylePicker({
  selectedStyleIds = [],
  savedStyles,
  onSelectPreset,
  onDeselectPreset,
  onSelectSaved,
  onDeselectSaved,
  onSaveCurrentAsStyle,
  currentDescription,
  multiSelect = true,
}: SceneStylePickerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const selectedPresets = SCENE_STYLE_PRESETS.filter(p => selectedStyleIds.includes(p.id));
  const selectedSavedStyles = savedStyles.filter(s => selectedStyleIds.includes(s.id));
  const totalSelected = selectedStyleIds.length;

  const handlePresetClick = (preset: SceneStylePreset) => {
    const isSelected = selectedStyleIds.includes(preset.id);
    
    if (multiSelect) {
      if (isSelected && onDeselectPreset) {
        onDeselectPreset(preset.id);
      } else {
        onSelectPreset(preset);
      }
    } else {
      // Single select mode - just select
      onSelectPreset(preset);
    }
  };

  const handleSavedClick = (style: SceneStyle) => {
    const isSelected = selectedStyleIds.includes(style.id);
    
    if (multiSelect) {
      if (isSelected && onDeselectSaved) {
        onDeselectSaved(style.id);
      } else {
        onSelectSaved(style);
      }
    } else {
      onSelectSaved(style);
    }
  };

  const getSelectedNames = () => {
    const names = [
      ...selectedPresets.map(p => p.name),
      ...selectedSavedStyles.map(s => s.name),
    ];
    if (names.length === 0) return null;
    if (names.length === 1) return names[0];
    if (names.length === 2) return names.join(" + ");
    return `${names.slice(0, 2).join(", ")} +${names.length - 2}`;
  };

  const selectedNames = getSelectedNames();

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <label className="flex items-center gap-2 text-xs text-muted-foreground font-medium cursor-pointer">
          <Palette className="w-3 h-3" />
          Scene Style
          {multiSelect && (
            <span className="text-muted-foreground/60">(mix multiple)</span>
          )}
          {selectedNames && (
            <span className="text-purple-600 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-full flex items-center gap-1">
              {totalSelected > 1 && <Layers className="w-3 h-3" />}
              {selectedNames}
            </span>
          )}
        </label>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-3 animate-fade-in">
          {/* Multi-select hint */}
          {multiSelect && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
              <Layers className="w-3 h-3" />
              <span>Select multiple styles to blend them together in your prompt</span>
            </div>
          )}

          {/* Categories with presets */}
          {STYLE_CATEGORIES.map((category) => {
            const categoryPresets = SCENE_STYLE_PRESETS.filter(p => p.category === category.id);
            const isExpanded = expandedCategory === category.id;
            const CategoryIcon = category.icon;
            const selectedInCategory = categoryPresets.filter(p => selectedStyleIds.includes(p.id)).length;

            return (
              <div key={category.id} className="space-y-2">
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                  className="flex items-center justify-between w-full text-left px-2 py-1.5 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <CategoryIcon className="w-4 h-4 text-purple-500" />
                    {category.name}
                    {selectedInCategory > 0 && (
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded-full">
                        {selectedInCategory}
                      </span>
                    )}
                  </span>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    isExpanded && "rotate-180"
                  )} />
                </button>

                {isExpanded && (
                  <div className="grid grid-cols-2 gap-2 pl-2 animate-fade-in">
                    {categoryPresets.map((preset) => {
                      const Icon = preset.icon;
                      const isSelected = selectedStyleIds.includes(preset.id);
                      return (
                        <button
                          key={preset.id}
                          onClick={() => handlePresetClick(preset)}
                          className={cn(
                            "flex items-start gap-2 p-3 rounded-lg border text-left transition-all relative",
                            isSelected
                              ? "bg-purple-50 dark:bg-purple-950/50 border-purple-300 dark:border-purple-700 ring-1 ring-purple-200 dark:ring-purple-800"
                              : "bg-card border-border hover:border-purple-200 hover:bg-purple-50/50 dark:hover:bg-purple-950/30"
                          )}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <Icon className={cn(
                            "w-4 h-4 mt-0.5 flex-shrink-0",
                            isSelected ? "text-purple-600 dark:text-purple-400" : "text-muted-foreground"
                          )} />
                          <div className="min-w-0 pr-5">
                            <div className={cn(
                              "text-sm font-medium truncate",
                              isSelected ? "text-purple-700 dark:text-purple-300" : "text-foreground"
                            )}>
                              {preset.name}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {preset.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Saved Styles from Library */}
          {savedStyles.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Library className="w-3 h-3" />
                Your Saved Styles
              </div>
              <div className="flex flex-wrap gap-2">
                {savedStyles.map((style) => {
                  const isSelected = selectedStyleIds.includes(style.id);
                  return (
                    <button
                      key={style.id}
                      onClick={() => handleSavedClick(style)}
                      className={cn(
                        "px-3 py-1.5 border rounded-full text-sm transition-all flex items-center gap-1.5",
                        isSelected
                          ? "bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                          : "bg-card border-border text-foreground hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      {style.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Save Current Description as Style */}
          {onSaveCurrentAsStyle && currentDescription && currentDescription.trim().length > 20 && (
            <button
              onClick={onSaveCurrentAsStyle}
              className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              Save current as reusable style
            </button>
          )}
        </div>
      )}
    </div>
  );
}
