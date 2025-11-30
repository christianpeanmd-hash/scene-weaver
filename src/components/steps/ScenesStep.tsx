import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SceneCard } from "@/components/SceneCard";
import { Character, Scene } from "@/types/prompt-builder";
import { isCharacterComplete } from "@/lib/template-generator";

interface ScenesStepProps {
  concept: string;
  duration: number | null;
  characters: Character[];
  scenes: Scene[];
  copiedId: number | null;
  onViewTemplate: () => void;
  onUpdateScene: (id: number, field: keyof Scene, value: string) => void;
  onGenerateScene: (id: number) => void;
  onCopyScene: (id: number, content: string) => void;
  onRemoveScene: (id: number) => void;
  onAddScene: () => void;
}

export function ScenesStep({
  concept,
  duration,
  characters,
  scenes,
  copiedId,
  onViewTemplate,
  onUpdateScene,
  onGenerateScene,
  onCopyScene,
  onRemoveScene,
  onAddScene,
}: ScenesStepProps) {
  const filledChars = characters.filter(isCharacterComplete);

  return (
    <div className="space-y-5">
      {/* Summary Card */}
      <div className="gradient-primary rounded-2xl p-5 text-primary-foreground animate-slide-up">
        <div className="flex items-center justify-between mb-2">
          <span className="text-teal-100 text-sm font-medium">Production Template</span>
          <button
            onClick={onViewTemplate}
            className="text-xs text-primary-foreground/80 hover:text-primary-foreground underline transition-colors"
          >
            View full template
          </button>
        </div>
        <p className="font-medium">{concept}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {duration && (
            <span className="px-2 py-1 bg-primary-foreground/20 text-primary-foreground text-xs rounded-full">
              {duration}s
            </span>
          )}
          {filledChars.map((char) => (
            <span
              key={char.id}
              className="px-2 py-1 bg-primary-foreground/20 text-primary-foreground text-xs rounded-full"
            >
              {char.name}
            </span>
          ))}
        </div>
      </div>

      {/* Scenes */}
      <div className="space-y-4">
        {scenes.map((scene, index) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            index={index}
            copied={copiedId === scene.id}
            onUpdate={(field, value) => onUpdateScene(scene.id, field, value)}
            onGenerate={() => onGenerateScene(scene.id)}
            onCopy={() => onCopyScene(scene.id, scene.content)}
            onRemove={() => onRemoveScene(scene.id)}
          />
        ))}
      </div>

      {/* Add Scene */}
      <Button variant="dashed" size="xl" className="w-full" onClick={onAddScene}>
        <Plus className="w-5 h-5" />
        Add Scene
      </Button>
    </div>
  );
}
