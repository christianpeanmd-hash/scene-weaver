import { GripVertical, MapPin, Users, Film, ChevronRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { Scene, EnhancedCharacter, EnhancedEnvironment } from "@/types/prompt-builder";
import { cn } from "@/lib/utils";

interface StoryOutlineProps {
  scenes: Scene[];
  savedCharacters: EnhancedCharacter[];
  savedEnvironments: EnhancedEnvironment[];
  generatingSceneId: number | string | null;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onSelectScene: (index: number) => void;
}

export function StoryOutline({
  scenes,
  savedCharacters,
  savedEnvironments,
  generatingSceneId,
  onReorder,
  onSelectScene,
}: StoryOutlineProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== toIndex) {
      onReorder(draggedIndex, toIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const getSceneLabel = (index: number) => {
    if (index === 0) return "Opening";
    if (index === scenes.length - 1 && scenes.length > 1) return "Finale";
    return `Scene ${index + 1}`;
  };

  const getSceneStatus = (scene: Scene) => {
    if (generatingSceneId === scene.id) return "generating";
    if (scene.generated && scene.content) return "complete";
    if (scene.description) return "ready";
    return "empty";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">Story Timeline</h3>
        <span className="text-xs text-muted-foreground">Drag to reorder</span>
      </div>

      {/* Timeline visualization */}
      <div className="relative">
        {/* Connecting line */}
        {scenes.length > 1 && (
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/30 z-0" />
        )}

        <div className="space-y-2 relative z-10">
          {scenes.map((scene, index) => {
            const status = getSceneStatus(scene);
            const characters = scene.selectedCharacterIds
              ?.map(id => savedCharacters.find(c => c.id === id))
              .filter(Boolean) || [];
            const environment = savedEnvironments.find(e => e.id === scene.selectedEnvironmentId);
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index;

            return (
              <div
                key={scene.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => onSelectScene(index)}
                className={cn(
                  "group flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200",
                  "bg-card hover:bg-accent/50 hover:border-primary/30",
                  isDragging && "opacity-50 scale-95",
                  isDragOver && "border-primary border-dashed bg-primary/5",
                  status === "complete" && "border-emerald-200 dark:border-emerald-800/50"
                )}
              >
                {/* Drag handle */}
                <div className="flex-shrink-0 mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground/50 group-hover:text-muted-foreground">
                  <GripVertical className="w-4 h-4" />
                </div>

                {/* Timeline node */}
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                  status === "complete" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
                  status === "generating" && "bg-primary/20 text-primary animate-pulse",
                  status === "ready" && "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
                  status === "empty" && "bg-muted text-muted-foreground"
                )}>
                  {status === "generating" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : status === "complete" ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Scene info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                      {getSceneLabel(index)}
                    </span>
                    {scene.title && (
                      <>
                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm font-medium truncate">{scene.title}</span>
                      </>
                    )}
                  </div>

                  {scene.description ? (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {scene.description}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground/50 italic">
                      No description yet
                    </p>
                  )}

                  {/* Quick info badges */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {characters.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        {characters.length}
                      </span>
                    )}
                    {(environment || scene.customEnvironment) && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {environment?.name || "Custom"}
                      </span>
                    )}
                    {scene.selectedStyleIds?.length ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                        <Film className="w-3 h-3" />
                        {scene.selectedStyleIds.length} style{scene.selectedStyleIds.length > 1 ? "s" : ""}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Status indicator */}
                <div className="flex-shrink-0">
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    status === "complete" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
                    status === "generating" && "bg-primary/20 text-primary",
                    status === "ready" && "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
                    status === "empty" && "bg-muted text-muted-foreground"
                  )}>
                    {status === "complete" && "Done"}
                    {status === "generating" && "Generating..."}
                    {status === "ready" && "Ready"}
                    {status === "empty" && "Draft"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {scenes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Film className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No scenes yet. Add your first scene below.</p>
        </div>
      )}
    </div>
  );
}
