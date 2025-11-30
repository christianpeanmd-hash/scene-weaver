import { useState } from "react";
import { Check, ChevronDown, Library, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedCharacter, Character } from "@/types/prompt-builder";
import { cn } from "@/lib/utils";

interface CharacterPickerProps {
  savedCharacters: EnhancedCharacter[];
  selectedIds: number[];
  onSelect: (character: EnhancedCharacter) => void;
  onDeselect: (id: number) => void;
}

export function CharacterPicker({
  savedCharacters,
  selectedIds,
  onSelect,
  onDeselect,
}: CharacterPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (savedCharacters.length === 0) {
    return null;
  }

  const selectedChars = savedCharacters.filter(c => selectedIds.includes(c.id));
  const unselectedChars = savedCharacters.filter(c => !selectedIds.includes(c.id));

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
      >
        <Library className="w-4 h-4" />
        Pick from Character Library ({savedCharacters.length})
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="bg-slate-50 rounded-xl p-3 space-y-2 animate-fade-in">
          {/* Selected characters */}
          {selectedChars.length > 0 && (
            <div className="space-y-2 mb-3">
              <span className="text-xs text-muted-foreground font-medium">Selected for this scene:</span>
              <div className="flex flex-wrap gap-2">
                {selectedChars.map((char) => (
                  <div
                    key={char.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm"
                  >
                    <User className="w-3 h-3" />
                    {char.name}
                    <button
                      onClick={() => onDeselect(char.id)}
                      className="hover:text-teal-900 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available characters */}
          {unselectedChars.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground font-medium">Available characters:</span>
              <div className="grid gap-2">
                {unselectedChars.map((char) => (
                  <button
                    key={char.id}
                    onClick={() => onSelect(char)}
                    className="flex items-start gap-3 p-3 bg-white border border-border rounded-lg hover:border-primary/50 hover:bg-teal-50/30 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
                      <User className="w-4 h-4 text-slate-500 group-hover:text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground">{char.name}</div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {char.enhancedLook || char.look}
                      </p>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center flex-shrink-0 group-hover:border-primary group-hover:bg-primary transition-colors">
                      <Check className="w-3 h-3 text-transparent group-hover:text-primary-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedIds.length >= 2 && (
            <p className="text-xs text-amber-600 mt-2">
              Tip: AI generators work best with 1–2 characters per scene.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
