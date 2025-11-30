import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { PresetAnchor, ICON_MAP } from "@/data/preset-anchors";
import { cn } from "@/lib/utils";

interface PresetPickerProps {
  presets: PresetAnchor[];
  onSelectPreset: (preset: PresetAnchor) => void;
  label: string;
  emptyMessage?: string;
}

export function PresetPicker({
  presets,
  onSelectPreset,
  label,
  emptyMessage = "No presets available",
}: PresetPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (presets.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
      >
        <Plus className="w-4 h-4" />
        {label}
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl animate-fade-in">
          {presets.map((preset) => {
            const IconComponent = ICON_MAP[preset.icon];
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 p-3 bg-white border border-border rounded-lg hover:border-primary/50 hover:bg-teal-50/30 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:from-teal-200 group-hover:to-emerald-200 transition-colors">
                  {IconComponent && <IconComponent className="w-4 h-4 text-teal-600" />}
                </div>
                <span className="text-sm font-medium text-foreground truncate">
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
