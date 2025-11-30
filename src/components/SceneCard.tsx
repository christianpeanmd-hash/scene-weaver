import { Clapperboard, Copy, Check, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Scene, EnhancedCharacter } from "@/types/prompt-builder";
import { CharacterPicker } from "./CharacterPicker";
import { cn } from "@/lib/utils";

interface SceneCardProps {
  scene: Scene;
  index: number;
  copied: boolean;
  isGenerating?: boolean;
  savedCharacters: EnhancedCharacter[];
  onUpdate: (field: keyof Scene, value: string) => void;
  onSelectCharacter: (character: EnhancedCharacter) => void;
  onDeselectCharacter: (id: number) => void;
  onGenerate: () => void;
  onCopy: () => void;
  onRemove: () => void;
}

export function SceneCard({
  scene,
  index,
  copied,
  isGenerating = false,
  savedCharacters,
  onUpdate,
  onSelectCharacter,
  onDeselectCharacter,
  onGenerate,
  onCopy,
  onRemove,
}: SceneCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-slide-up">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clapperboard className="w-4 h-4 text-primary" />
          <span className="text-foreground font-medium">
            {scene.title || `Scene ${index + 1}`}
          </span>
          {scene.generated && (
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs rounded-full font-medium">
              Ready
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {scene.generated && (
            <Button variant="ghost" size="icon-sm" onClick={onCopy}>
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          )}
          <Button variant="danger" size="icon-sm" onClick={onRemove}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!scene.generated ? (
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground font-medium">
              Scene Title <span className="text-muted-foreground/60">(optional)</span>
            </label>
            <input
              type="text"
              value={scene.title}
              onChange={(e) => onUpdate("title", e.target.value)}
              placeholder="The Big Reveal"
              className="mt-1 w-full px-3 py-2 bg-slate-50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
            />
          </div>

          {/* Character Picker */}
          <CharacterPicker
            savedCharacters={savedCharacters}
            selectedIds={scene.selectedCharacterIds || []}
            onSelect={onSelectCharacter}
            onDeselect={onDeselectCharacter}
          />

          <div>
            <label className="text-xs text-muted-foreground font-medium">What Happens</label>
            <textarea
              value={scene.description}
              onChange={(e) => onUpdate("description", e.target.value)}
              placeholder="Describe the action, dialogue, and emotional arc..."
              rows={3}
              className="mt-1 w-full px-3 py-2 bg-slate-50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none transition-all"
            />
          </div>
          <Button
            variant="soft"
            className="w-full"
            disabled={!scene.description.trim() || isGenerating}
            onClick={onGenerate}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                Generating with AI...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate Scene Template
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="p-4 max-h-[300px] overflow-y-auto bg-slate-50">
          <pre className="text-muted-foreground text-sm whitespace-pre-wrap font-mono leading-relaxed">
            {scene.content}
          </pre>
        </div>
      )}
    </div>
  );
}
