import { Plus, Film, List, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SceneCard } from "@/components/SceneCard";
import { ProjectManager } from "@/components/ProjectManager";
import { StoryOutline } from "@/components/StoryOutline";
import { Character, Scene, EnhancedCharacter, EnhancedEnvironment } from "@/types/prompt-builder";
import { SceneStyle } from "@/hooks/useSceneStyleLibrary";
import { isCharacterComplete } from "@/lib/template-generator";
import { cn } from "@/lib/utils";

interface ScenesStepProps {
  concept: string;
  duration: number | null;
  characters: Character[];
  savedCharacters: EnhancedCharacter[];
  savedEnvironments: EnhancedEnvironment[];
  savedSceneStyles: SceneStyle[];
  scenes: Scene[];
  copiedId: number | string | null;
  generatingSceneId: number | string | null;
  onViewTemplate: () => void;
  onUpdateScene: (id: number | string, field: keyof Scene, value: string | (string | number)[] | number | undefined) => void;
  onGenerateScene: (id: number | string) => void;
  onCopyScene: (id: number | string, content: string) => void;
  onRemoveScene: (id: number | string) => void;
  onAddScene: () => void;
  onReorderScenes: (fromIndex: number, toIndex: number) => void;
  onSaveSceneStyle: (style: Omit<SceneStyle, "id" | "createdAt">) => void;
}

export function ScenesStep({
  concept,
  duration,
  characters,
  savedCharacters,
  savedEnvironments,
  savedSceneStyles,
  scenes,
  copiedId,
  generatingSceneId,
  onViewTemplate,
  onUpdateScene,
  onGenerateScene,
  onCopyScene,
  onRemoveScene,
  onAddScene,
  onReorderScenes,
  onSaveSceneStyle,
}: ScenesStepProps) {
  const [viewMode, setViewMode] = useState<"detailed" | "outline">("detailed");
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number | null>(null);
  
  const filledChars = characters.filter(isCharacterComplete);

  const handleSelectCharacter = (sceneId: number | string, character: EnhancedCharacter) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;
    const currentIds = scene.selectedCharacterIds || [];
    if (!currentIds.includes(character.id)) {
      onUpdateScene(sceneId, "selectedCharacterIds", [...currentIds, character.id]);
    }
  };

  const handleDeselectCharacter = (sceneId: number | string, charId: number | string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;
    const currentIds = scene.selectedCharacterIds || [];
    onUpdateScene(sceneId, "selectedCharacterIds", currentIds.filter(id => id !== charId));
  };

  const handleSelectEnvironment = (sceneId: number | string, envId: number | string) => {
    onUpdateScene(sceneId, "selectedEnvironmentId", envId);
  };

  const handleSelectStyle = (sceneId: number | string, styleId: string, template: string) => {
    onUpdateScene(sceneId, "selectedStyleId", styleId);
    onUpdateScene(sceneId, "styleTemplate", template);
  };

  const handleOutlineSelectScene = (index: number) => {
    setSelectedSceneIndex(index);
    setViewMode("detailed");
    // Scroll to the scene after a brief delay for view switch
    setTimeout(() => {
      const sceneElement = document.getElementById(`scene-${scenes[index]?.id}`);
      sceneElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

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
        <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-primary-foreground/20">
          {savedCharacters.length > 0 && (
            <span className="text-xs text-teal-100">
              {savedCharacters.length} character{savedCharacters.length !== 1 ? 's' : ''} in library
            </span>
          )}
          {savedEnvironments.length > 0 && (
            <span className="text-xs text-teal-100">
              {savedEnvironments.length} environment{savedEnvironments.length !== 1 ? 's' : ''} in library
            </span>
          )}
        </div>
      </div>

      {/* View Toggle */}
      {scenes.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-border flex-1 mr-3">
            <Film className="w-4 h-4 text-primary" />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Story flow:</span> Each scene builds on the previous. Drag to reorder in outline view.
            </p>
          </div>
          
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode("detailed")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                viewMode === "detailed"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Detailed</span>
            </button>
            <button
              onClick={() => setViewMode("outline")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                viewMode === "outline"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Outline</span>
            </button>
          </div>
        </div>
      )}

      {/* Empty state info */}
      {scenes.length === 0 && (
        <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-border">
          <Film className="w-4 h-4 text-primary" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Story flow:</span> Each scene should build on the previous one. The AI will maintain character consistency and story continuity.
          </p>
        </div>
      )}

      {/* Outline View */}
      {viewMode === "outline" && scenes.length > 0 && (
        <StoryOutline
          scenes={scenes}
          savedCharacters={savedCharacters}
          savedEnvironments={savedEnvironments}
          generatingSceneId={generatingSceneId}
          onReorder={onReorderScenes}
          onSelectScene={handleOutlineSelectScene}
        />
      )}

      {/* Detailed View - Scenes */}
      {viewMode === "detailed" && (
        <div className="space-y-4 relative">
          {/* Connecting line for story flow */}
          {scenes.length > 1 && (
            <div className="absolute left-[22px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-teal-500 via-emerald-500 to-teal-500 opacity-30 z-0" />
          )}
          
          {scenes.map((scene, index) => (
            <div key={scene.id} id={`scene-${scene.id}`} className="relative z-10">
              <SceneCard
                scene={scene}
                index={index}
                totalScenes={scenes.length}
                previousSceneDescription={index > 0 ? scenes[index - 1]?.description : undefined}
                copied={copiedId === scene.id}
                isGenerating={generatingSceneId === scene.id}
                savedCharacters={savedCharacters}
                savedEnvironments={savedEnvironments}
                savedSceneStyles={savedSceneStyles}
                onUpdate={(field, value) => onUpdateScene(scene.id, field, value)}
                onSelectCharacter={(char) => handleSelectCharacter(scene.id, char)}
                onDeselectCharacter={(charId) => handleDeselectCharacter(scene.id, charId)}
                onSelectEnvironment={(envId) => handleSelectEnvironment(scene.id, envId)}
                onSelectStyle={(styleId, template) => handleSelectStyle(scene.id, styleId, template)}
                onSaveStyle={onSaveSceneStyle}
                onGenerate={() => onGenerateScene(scene.id)}
                onCopy={() => onCopyScene(scene.id, scene.content)}
                onRemove={() => onRemoveScene(scene.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Add Scene */}
      <Button variant="dashed" size="xl" className="w-full" onClick={onAddScene}>
        <Plus className="w-5 h-5" />
        Add Scene
      </Button>

      {/* Project Manager */}
      <div className="mt-6">
        <ProjectManager 
          currentPrompt={scenes.find(s => s.generated && s.content)?.content}
        />
      </div>
    </div>
  );
}
