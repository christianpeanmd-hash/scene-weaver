import { Clapperboard, Copy, Check, Trash2, Wand2, MapPin, Film, Loader2, Download, Play, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Scene, EnhancedCharacter, EnhancedEnvironment } from "@/types/prompt-builder";
import { CharacterPicker } from "./CharacterPicker";
import { SceneStylePicker } from "./SceneStylePicker";
import { SceneStylePreset, SCENE_STYLE_PRESETS } from "@/data/scene-style-presets";
import { SceneStyle } from "@/hooks/useSceneStyleLibrary";
import { useVideoGeneration } from "@/hooks/useVideoGeneration";
import { useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";

interface SceneCardProps {
  scene: Scene;
  index: number;
  totalScenes: number;
  previousSceneDescription?: string;
  copied: boolean;
  isGenerating?: boolean;
  savedCharacters: EnhancedCharacter[];
  savedEnvironments: EnhancedEnvironment[];
  savedSceneStyles: SceneStyle[];
  sceneId?: string;
  onUpdate: (field: keyof Scene, value: string | (string | number)[] | number | undefined) => void;
  onSelectCharacter: (character: EnhancedCharacter) => void;
  onDeselectCharacter: (id: number | string) => void;
  onSelectEnvironment: (envId: number | string) => void;
  onSelectStyle: (styleId: string, template: string) => void;
  onSaveStyle: (style: Omit<SceneStyle, "id" | "createdAt">) => void;
  onGenerate: () => void;
  onCopy: () => void;
  onRemove: () => void;
}

export function SceneCard({
  scene,
  index,
  totalScenes,
  previousSceneDescription,
  copied,
  isGenerating = false,
  savedCharacters,
  savedEnvironments,
  savedSceneStyles,
  sceneId,
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
  const [showCustomEnv, setShowCustomEnv] = useState(false);
  const selectedEnv = savedEnvironments.find(e => e.id === scene.selectedEnvironmentId);
  const { tier } = useSubscription();
  const videoGen = useVideoGeneration();
  const isPremium = tier === 'pro' || tier === 'studio';

  // Get current selected style IDs (support both old and new format)
  const selectedStyleIds = scene.selectedStyleIds || (scene.selectedStyleId ? [scene.selectedStyleId] : []);

  // Scene label - first scene is "Opening Scene", then "Scene 2", "Scene 3", etc.
  const getSceneLabel = () => {
    if (index === 0) return "Opening Scene";
    return `Scene ${index + 1}`;
  };

  // Transition hint based on position
  const getTransitionHint = () => {
    if (index === 0) {
      return "This scene sets up your story. Establish the characters, setting, and hook.";
    }
    if (index === totalScenes - 1 && totalScenes > 1) {
      return "Final scene - deliver the payoff, resolution, or call-to-action.";
    }
    return "Build on the previous scene. How does the story progress?";
  };

  const handleGenerateVideo = async () => {
    if (!scene.content) return;
    
    await videoGen.generateVideo({
      prompt: scene.content,
      duration: 5,
      aspectRatio: '16:9',
      sceneId: sceneId,
    });
  };

  const handleSelectPreset = (preset: SceneStylePreset) => {
    const newIds = [...selectedStyleIds, preset.id];
    onUpdate("selectedStyleIds", newIds);
    const allTemplates = newIds.map(id => {
      const p = SCENE_STYLE_PRESETS.find(sp => sp.id === id);
      return p?.template || savedSceneStyles.find(s => s.id === id)?.template;
    }).filter(Boolean).join("\n\n---\n\n");
    onUpdate("styleTemplate", allTemplates);
  };

  const handleDeselectPreset = (presetId: string) => {
    const newIds = selectedStyleIds.filter(id => id !== presetId);
    onUpdate("selectedStyleIds", newIds);
    const allTemplates = newIds.map(id => {
      const p = SCENE_STYLE_PRESETS.find(sp => sp.id === id);
      return p?.template || savedSceneStyles.find(s => s.id === id)?.template;
    }).filter(Boolean).join("\n\n---\n\n");
    onUpdate("styleTemplate", allTemplates);
  };

  const handleSelectSaved = (style: SceneStyle) => {
    const newIds = [...selectedStyleIds, style.id];
    onUpdate("selectedStyleIds", newIds);
    const allTemplates = newIds.map(id => {
      const p = SCENE_STYLE_PRESETS.find(sp => sp.id === id);
      return p?.template || savedSceneStyles.find(s => s.id === id)?.template;
    }).filter(Boolean).join("\n\n---\n\n");
    onUpdate("styleTemplate", allTemplates);
  };

  const handleDeselectSaved = (styleId: string) => {
    const newIds = selectedStyleIds.filter(id => id !== styleId);
    onUpdate("selectedStyleIds", newIds);
    const allTemplates = newIds.map(id => {
      const p = SCENE_STYLE_PRESETS.find(sp => sp.id === id);
      return p?.template || savedSceneStyles.find(s => s.id === id)?.template;
    }).filter(Boolean).join("\n\n---\n\n");
    onUpdate("styleTemplate", allTemplates);
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
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
            {index + 1}
          </div>
          <span className="text-foreground font-medium">
            {scene.title || getSceneLabel()}
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
        <div className="p-4 space-y-4">
          {/* Story Continuity Hint */}
          <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
            <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-700 dark:text-amber-300">
              <span className="font-medium">Story tip:</span> {getTransitionHint()}
              {previousSceneDescription && (
                <p className="mt-1 text-amber-600/80 dark:text-amber-400/80 italic">
                  Previous: "{previousSceneDescription.slice(0, 60)}..."
                </p>
              )}
            </div>
          </div>

          {/* Scene Title */}
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

          {/* Environment/Location Section - More Prominent */}
          <div className="space-y-2 p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
            <label className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <MapPin className="w-3.5 h-3.5" />
              Location/Environment
              <span className="text-emerald-600/60 dark:text-emerald-400/60 font-normal">
                (change setting from master template)
              </span>
            </label>
            
            {/* Saved Environments */}
            {savedEnvironments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    onSelectEnvironment(undefined as any);
                    setShowCustomEnv(false);
                  }}
                  className={cn(
                    "px-3 py-1.5 border rounded-full text-xs transition-all",
                    !scene.selectedEnvironmentId && !showCustomEnv
                      ? "bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-900/50 dark:border-emerald-600 dark:text-emerald-300"
                      : "bg-white dark:bg-slate-800 border-border text-foreground hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                  )}
                >
                  Same as template
                </button>
                {savedEnvironments.map((env) => (
                  <button
                    key={env.id}
                    onClick={() => {
                      onSelectEnvironment(env.id);
                      setShowCustomEnv(false);
                    }}
                    className={cn(
                      "px-3 py-1.5 border rounded-full text-xs transition-all",
                      scene.selectedEnvironmentId === env.id
                        ? "bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-900/50 dark:border-emerald-600 dark:text-emerald-300"
                        : "bg-white dark:bg-slate-800 border-border text-foreground hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                    )}
                  >
                    {env.name}
                  </button>
                ))}
                <button
                  onClick={() => setShowCustomEnv(!showCustomEnv)}
                  className={cn(
                    "px-3 py-1.5 border rounded-full text-xs transition-all flex items-center gap-1",
                    showCustomEnv
                      ? "bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-900/50 dark:border-emerald-600 dark:text-emerald-300"
                      : "bg-white dark:bg-slate-800 border-dashed border-emerald-400 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                  )}
                >
                  + New location
                  {showCustomEnv ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            )}

            {/* Custom Environment Description */}
            {(showCustomEnv || savedEnvironments.length === 0) && (
              <div className="mt-2">
                <textarea
                  value={scene.customEnvironment || ""}
                  onChange={(e) => onUpdate("customEnvironment" as keyof Scene, e.target.value)}
                  placeholder="Describe the new location... e.g., 'A dimly lit jazz club with velvet curtains, neon signs, and smoky atmosphere'"
                  rows={2}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-700 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs resize-none transition-all"
                />
              </div>
            )}

            {/* Selected environment preview */}
            {selectedEnv && (
              <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
                {selectedEnv.setting?.slice(0, 80)}...
              </p>
            )}
          </div>

          {/* Character Picker */}
          <CharacterPicker
            savedCharacters={savedCharacters}
            selectedIds={scene.selectedCharacterIds || []}
            onSelect={onSelectCharacter}
            onDeselect={onDeselectCharacter}
          />

          {/* Scene Style Picker */}
          <SceneStylePicker
            selectedStyleIds={selectedStyleIds}
            savedStyles={savedSceneStyles}
            onSelectPreset={handleSelectPreset}
            onDeselectPreset={handleDeselectPreset}
            onSelectSaved={handleSelectSaved}
            onDeselectSaved={handleDeselectSaved}
            onSaveCurrentAsStyle={handleSaveCurrentAsStyle}
            currentDescription={scene.description}
            multiSelect={true}
          />

          {/* What Happens - with transition prompting */}
          <div>
            <label className="text-xs text-muted-foreground font-medium">
              What Happens in This Scene
            </label>
            <textarea
              value={scene.description}
              onChange={(e) => onUpdate("description", e.target.value)}
              placeholder={index === 0 
                ? "Describe the opening action, dialogue, and hook that grabs attention..."
                : "Describe how this scene continues the story. What action, dialogue, or revelation happens?"
              }
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
        <div className="p-4 space-y-4">
          {/* Video Generation Progress */}
          {videoGen.isGenerating && (
            <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Generating video...</p>
                  <p className="text-xs text-muted-foreground capitalize">Status: {videoGen.status}</p>
                </div>
              </div>
              {videoGen.progress > 0 && (
                <Progress value={videoGen.progress} className="h-2" />
              )}
            </div>
          )}

          {/* Generated Video */}
          {videoGen.videoUrl && (
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden bg-black">
                <video 
                  src={videoGen.videoUrl} 
                  controls 
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = videoGen.videoUrl!;
                    link.download = `${scene.title || 'scene'}-video.mp4`;
                    link.click();
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => videoGen.reset()}
                >
                  New Video
                </Button>
              </div>
            </div>
          )}

          {/* Scene Prompt */}
          <div className="max-h-[200px] overflow-y-auto bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
            <pre className="text-muted-foreground text-sm whitespace-pre-wrap font-mono leading-relaxed">
              {scene.content}
            </pre>
          </div>

          {/* Video Generation Button for Premium */}
          {isPremium && !videoGen.videoUrl && !videoGen.isGenerating && (
            <Button
              variant="default"
              size="sm"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              onClick={handleGenerateVideo}
            >
              <Film className="w-4 h-4 mr-2" />
              Generate Video with Runway ML
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
