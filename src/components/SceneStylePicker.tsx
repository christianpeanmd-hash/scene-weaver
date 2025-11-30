import { useState } from "react";
import { Palette, ChevronDown, ChevronUp, Plus, Library, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SCENE_STYLE_PRESETS, SceneStylePreset } from "@/data/scene-style-presets";
import { SceneStyle } from "@/hooks/useSceneStyleLibrary";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SceneStylePickerProps {
  selectedStyleId?: string;
  savedStyles: SceneStyle[];
  onSelectPreset: (preset: SceneStylePreset) => void;
  onSelectSaved: (style: SceneStyle) => void;
  onSaveCurrentAsStyle?: () => void;
  currentDescription?: string;
}

export function SceneStylePicker({
  selectedStyleId,
  savedStyles,
  onSelectPreset,
  onSelectSaved,
  onSaveCurrentAsStyle,
  currentDescription,
}: SceneStylePickerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedPreset = SCENE_STYLE_PRESETS.find(p => p.id === selectedStyleId);
  const selectedSaved = savedStyles.find(s => s.id === selectedStyleId);
  const selectedName = selectedPreset?.name || selectedSaved?.name;

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <label className="flex items-center gap-2 text-xs text-muted-foreground font-medium cursor-pointer">
          <Palette className="w-3 h-3" />
          Scene Style
          {selectedName && (
            <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              {selectedName}
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
          {/* Preset Styles */}
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Preset Templates</span>
            <div className="grid grid-cols-2 gap-2">
              {SCENE_STYLE_PRESETS.map((preset) => {
                const Icon = preset.icon;
                const isSelected = selectedStyleId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onSelectPreset(preset)}
                    className={cn(
                      "flex items-start gap-2 p-3 rounded-lg border text-left transition-all",
                      isSelected
                        ? "bg-purple-50 border-purple-300 ring-1 ring-purple-200"
                        : "bg-white border-border hover:border-purple-200 hover:bg-purple-50/50"
                    )}
                  >
                    <Icon className={cn(
                      "w-4 h-4 mt-0.5 flex-shrink-0",
                      isSelected ? "text-purple-600" : "text-muted-foreground"
                    )} />
                    <div className="min-w-0">
                      <div className={cn(
                        "text-sm font-medium truncate",
                        isSelected ? "text-purple-700" : "text-foreground"
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
          </div>

          {/* Saved Styles from Library */}
          {savedStyles.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Library className="w-3 h-3" />
                Your Saved Styles
              </div>
              <div className="flex flex-wrap gap-2">
                {savedStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => onSelectSaved(style)}
                    className={cn(
                      "px-3 py-1.5 border rounded-full text-sm transition-all",
                      selectedStyleId === style.id
                        ? "bg-purple-100 border-purple-300 text-purple-700"
                        : "bg-white border-border text-foreground hover:border-purple-300 hover:bg-purple-50"
                    )}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Save Current Description as Style */}
          {onSaveCurrentAsStyle && currentDescription && currentDescription.trim().length > 20 && (
            <button
              onClick={onSaveCurrentAsStyle}
              className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
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
