import { Clapperboard, Copy, Check, Trash2, Wand2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Scene, EnhancedCharacter, EnhancedEnvironment } from "@/types/prompt-builder";
import { CharacterPicker } from "./CharacterPicker";
import { SceneStylePicker } from "./SceneStylePicker";
import { SceneStylePreset, SCENE_STYLE_PRESETS } from "@/data/scene-style-presets";
import { SceneStyle } from "@/hooks/useSceneStyleLibrary";
import { cn } from "@/lib/utils";

interface SceneCardProps {
  scene: Scene;
  index: number;
  copied: boolean;
  isGenerating?: boolean;
  savedCharacters: EnhancedCharacter[];
  savedEnvironments: EnhancedEnvironment[];
  savedSceneStyles: SceneStyle[];
  onUpdate: (field: keyof Scene, value: string | number[] | number | undefined) => void;
  onSelectCharacter: (character: EnhancedCharacter) => void;
  onDeselectCharacter: (id: number) => void;
  onSelectEnvironment: (envId: number) => void;
  onSelectStyle: (styleId: string, template: string) => void;
  onSaveStyle: (style: Omit<SceneStyle, "id" | "createdAt">) => void;
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
  savedEnvironments,
  savedSceneStyles,
  onUpdate,
  onSelectCharacter,
  onDeselectCharacter,
  onSelectEnvironment,
  onSelectStyle,
  onSaveStyle,
  onGenerate,
  onCopy,
  onRemove,
}: SceneCardProps) {
  const selectedEnv = savedEnvironments.find(e => e.id === scene.selectedEnvironmentId);

  const handleSelectPreset = (preset: SceneStylePreset) => {
    onSelectStyle(preset.id, preset.template);
  };

  const handleSelectSaved = (style: SceneStyle) => {
    onSelectStyle(style.id, style.template);
  };

  const handleSaveCurrentAsStyle = () => {
    if (scene.description.trim().length > 20) {
      const styleName = scene.title || `Scene Style ${new Date().toLocaleDateString()}`;
      onSaveStyle({
        name: styleName,
        description: scene.description.slice(0, 100),
        template: scene.description,
      });
    }
  };

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

          {/* Environment Picker */}
          {savedEnvironments.length > 0 && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <MapPin className="w-3 h-3" />
                Environment
              </label>
              <div className="flex flex-wrap gap-2">
                {savedEnvironments.map((env) => (
                  <button
                    key={env.id}
                    onClick={() => onSelectEnvironment(env.id)}
                    className={cn(
                      "px-3 py-1.5 border rounded-full text-sm transition-all",
                      scene.selectedEnvironmentId === env.id
                        ? "bg-emerald-100 border-emerald-300 text-emerald-700"
                        : "bg-white border-border text-foreground hover:border-emerald-300 hover:bg-emerald-50"
                    )}
                  >
                    {env.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Scene Style Picker */}
          <SceneStylePicker
            selectedStyleId={scene.selectedStyleId}
            savedStyles={savedSceneStyles}
            onSelectPreset={handleSelectPreset}
            onSelectSaved={handleSelectSaved}
            onSaveCurrentAsStyle={handleSaveCurrentAsStyle}
            currentDescription={scene.description}
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
