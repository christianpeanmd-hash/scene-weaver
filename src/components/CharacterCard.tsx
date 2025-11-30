import { useState } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Character } from "@/types/prompt-builder";
import { isCharacterComplete } from "@/lib/template-generator";
import { cn } from "@/lib/utils";

interface CharacterCardProps {
  character: Character;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (field: keyof Character, value: string) => void;
  onRemove: () => void;
}

export function CharacterCard({
  character,
  index,
  isExpanded,
  onToggle,
  onUpdate,
  onRemove,
}: CharacterCardProps) {
  const complete = isCharacterComplete(character);

  return (
    <div className="bg-slate-50/50 animate-slide-up">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-100/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
              complete
                ? "gradient-primary text-primary-foreground"
                : "bg-slate-200 text-slate-500"
            )}
          >
            {complete ? <Check className="w-4 h-4" /> : index + 1}
          </div>
          <span className={cn("font-medium", character.name ? "text-foreground" : "text-muted-foreground")}>
            {character.name || `Character ${index + 1}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="danger"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="w-4 h-4" />
          </Button>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 space-y-3 animate-fade-in">
          <div>
            <label className="text-xs text-muted-foreground font-medium">Name</label>
            <input
              type="text"
              value={character.name}
              onChange={(e) => onUpdate("name", e.target.value)}
              placeholder="Tired Tara"
              className="mt-1 w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium">Look</label>
            <textarea
              value={character.look}
              onChange={(e) => onUpdate("look", e.target.value)}
              placeholder="Physical appearance, clothing, distinctive features..."
              rows={2}
              className="mt-1 w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none transition-all"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium">Demeanor</label>
            <textarea
              value={character.demeanor}
              onChange={(e) => onUpdate("demeanor", e.target.value)}
              placeholder="Personality, attitude, how they move and speak..."
              rows={2}
              className="mt-1 w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none transition-all"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium">
              Role <span className="text-muted-foreground/60">(optional)</span>
            </label>
            <input
              type="text"
              value={character.role}
              onChange={(e) => onUpdate("role", e.target.value)}
              placeholder="Their function in the story..."
              className="mt-1 w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
            />
          </div>
        </div>
      )}
    </div>
  );
}
