import { Sparkles, Clock, Clapperboard, User, Plus, AlertTriangle, Library, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CharacterCard } from "@/components/CharacterCard";
import { EnvironmentCard } from "@/components/EnvironmentCard";
import { PresetPicker } from "@/components/PresetPicker";
import { PhotoToAnchor } from "@/components/PhotoToAnchor";
import { Character, EnhancedCharacter, Environment, EnhancedEnvironment, DURATIONS } from "@/types/prompt-builder";
import { CHARACTER_PRESETS, ENVIRONMENT_PRESETS, PresetAnchor } from "@/data/preset-anchors";
import { isCharacterComplete } from "@/lib/template-generator";
import { cn } from "@/lib/utils";

interface SetupStepProps {
  concept: string;
  setConcept: (value: string) => void;
  duration: number | null;
  setDuration: (value: number) => void;
  videoStyle: string;
  setVideoStyle: (value: string) => void;
  characters: Character[];
  environments: Environment[];
  expandedChar: number | null;
  setExpandedChar: (value: number | null) => void;
  expandedEnv: number | null;
  setExpandedEnv: (value: number | null) => void;
  onAddCharacter: () => void;
  onAddCharacterFromLibrary: (character: EnhancedCharacter) => void;
  onAddCharacterFromPreset: (preset: PresetAnchor) => void;
  onAddCharacterFromPhoto: (charData: { name: string; look: string; demeanor: string; role: string }) => void;
  onUpdateCharacter: (id: number, field: keyof Character, value: string) => void;
  onRemoveCharacter: (id: number) => void;
  onAddEnvironment: () => void;
  onAddEnvironmentFromLibrary: (environment: EnhancedEnvironment) => void;
  onAddEnvironmentFromPreset: (preset: PresetAnchor) => void;
  onAddEnvironmentFromPhoto: (envData: { name: string; setting: string; lighting: string; audio: string; props: string }) => void;
  onUpdateEnvironment: (id: number, field: keyof Environment, value: string) => void;
  onRemoveEnvironment: (id: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  savedCharacters: EnhancedCharacter[];
  savedEnvironments: EnhancedEnvironment[];
}

export function SetupStep({
  concept,
  setConcept,
  duration,
  setDuration,
  videoStyle,
  setVideoStyle,
  characters,
  environments,
  expandedChar,
  setExpandedChar,
  expandedEnv,
  setExpandedEnv,
  onAddCharacter,
  onAddCharacterFromLibrary,
  onAddCharacterFromPreset,
  onAddCharacterFromPhoto,
  onUpdateCharacter,
  onRemoveCharacter,
  onAddEnvironment,
  onAddEnvironmentFromLibrary,
  onAddEnvironmentFromPreset,
  onAddEnvironmentFromPhoto,
  onUpdateEnvironment,
  onRemoveEnvironment,
  onGenerate,
  isGenerating,
  savedCharacters,
  savedEnvironments,
}: SetupStepProps) {
  const filledCharacters = characters.filter(isCharacterComplete).length;
  const filledEnvironments = environments.filter(e => e.name && e.setting).length;
  const isReady = concept.trim().length > 0;
  const showWarning = characters.length > 2;

  // Filter out characters/environments already added
  const availableCharsFromLibrary = savedCharacters.filter(
    saved => !characters.some(c => c.name.toLowerCase() === saved.name.toLowerCase())
  );
  const availableEnvsFromLibrary = savedEnvironments.filter(
    saved => !environments.some(e => e.name.toLowerCase() === saved.name.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Concept - Required */}
      <Card className="p-5">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          What's your video about?
          <span className="text-rose-500 text-xs">required</span>
        </label>
        <textarea
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          placeholder="Describe your concept... e.g., A barista confidently serves the wrong drink and pretends it was intentional"
          rows={3}
          className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
        />
      </Card>

      {/* Duration Picker */}
      <Card className="p-5">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
          <Clock className="w-4 h-4 text-primary" />
          Duration
        </label>
        <div className="grid grid-cols-3 gap-3">
          {DURATIONS.map((d) => (
            <button
              key={d.seconds}
              onClick={() => setDuration(d.seconds)}
              className={cn(
                "p-4 rounded-xl border-2 transition-all duration-200",
                duration === d.seconds
                  ? "border-primary bg-teal-50"
                  : "border-border hover:border-slate-300 bg-slate-50"
              )}
            >
              <div
                className={cn(
                  "text-xl font-semibold",
                  duration === d.seconds ? "text-teal-700" : "text-foreground"
                )}
              >
                {d.label}
              </div>
              <div
                className={cn(
                  "text-xs mt-1",
                  duration === d.seconds ? "text-teal-600" : "text-muted-foreground"
                )}
              >
                {d.platform}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Video Style - Optional */}
      <Card className="p-5">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
          <Clapperboard className="w-4 h-4 text-primary" />
          Video Style
          <span className="text-muted-foreground text-xs font-normal">optional</span>
        </label>
        <input
          type="text"
          value={videoStyle}
          onChange={(e) => setVideoStyle(e.target.value)}
          placeholder="e.g., Mockumentary, vlog confessional, commercial parody..."
          className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </Card>

      {/* Characters - Optional */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-border/50">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <User className="w-4 h-4 text-primary" />
              Characters
              <span className="text-muted-foreground text-xs font-normal">optional</span>
            </label>
            {filledCharacters > 0 && (
              <span className="text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                {filledCharacters} defined
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Add characters for more consistent results
          </p>
        </div>

        {characters.length > 0 && (
          <div className="divide-y divide-border/50">
            {characters.map((char, index) => (
              <CharacterCard
                key={char.id}
                character={char}
                index={index}
                isExpanded={expandedChar === char.id}
                onToggle={() => setExpandedChar(expandedChar === char.id ? null : char.id)}
                onUpdate={(field, value) => onUpdateCharacter(char.id, field, value)}
                onRemove={() => onRemoveCharacter(char.id)}
              />
            ))}
          </div>
        )}

        <div className="p-4 bg-slate-50/50 space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={onAddCharacter}
              className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add new character
            </button>
          </div>

          {/* Generate from Photo */}
          <PhotoToAnchor
            type="character"
            onGenerated={onAddCharacterFromPhoto}
          />

          {/* Character Presets */}
          <PresetPicker
            presets={CHARACTER_PRESETS}
            onSelectPreset={onAddCharacterFromPreset}
            label="Start from preset template"
          />

          {/* Character Library Quick Pick */}
          {availableCharsFromLibrary.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Library className="w-3 h-3" />
                Quick add from your library:
              </div>
              <div className="flex flex-wrap gap-2">
                {availableCharsFromLibrary.slice(0, 5).map((char) => (
                  <button
                    key={char.id}
                    onClick={() => onAddCharacterFromLibrary(char)}
                    className="px-3 py-1.5 bg-white border border-border rounded-full text-sm text-foreground hover:border-primary hover:bg-teal-50 transition-all"
                  >
                    {char.name}
                  </button>
                ))}
                {availableCharsFromLibrary.length > 5 && (
                  <span className="px-3 py-1.5 text-sm text-muted-foreground">
                    +{availableCharsFromLibrary.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {showWarning && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-700">
                AI generators work best with 1–2 characters.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Environments - Optional */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-border/50">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              Environment
              <span className="text-muted-foreground text-xs font-normal">optional</span>
            </label>
            {filledEnvironments > 0 && (
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {filledEnvironments} defined
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Define your setting for consistent scene locations
          </p>
        </div>

        {environments.length > 0 && (
          <div className="divide-y divide-border/50">
            {environments.map((env) => (
              <EnvironmentCard
                key={env.id}
                environment={env}
                isExpanded={expandedEnv === env.id}
                onToggle={() => setExpandedEnv(expandedEnv === env.id ? null : env.id)}
                onUpdate={(field, value) => onUpdateEnvironment(env.id, field, value)}
                onRemove={() => onRemoveEnvironment(env.id)}
              />
            ))}
          </div>
        )}

        <div className="p-4 bg-slate-50/50 space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={onAddEnvironment}
              className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add new environment
            </button>
          </div>

          {/* Generate from Photo */}
          <PhotoToAnchor
            type="environment"
            onGenerated={onAddEnvironmentFromPhoto}
          />

          {/* Environment Presets */}
          <PresetPicker
            presets={ENVIRONMENT_PRESETS}
            onSelectPreset={onAddEnvironmentFromPreset}
            label="Start from preset template"
          />

          {/* Environment Library Quick Pick */}
          {availableEnvsFromLibrary.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Library className="w-3 h-3" />
                Quick add from your library:
              </div>
              <div className="flex flex-wrap gap-2">
                {availableEnvsFromLibrary.slice(0, 5).map((env) => (
                  <button
                    key={env.id}
                    onClick={() => onAddEnvironmentFromLibrary(env)}
                    className="px-3 py-1.5 bg-white border border-border rounded-full text-sm text-foreground hover:border-primary hover:bg-emerald-50 transition-all"
                  >
                    {env.name}
                  </button>
                ))}
                {availableEnvsFromLibrary.length > 5 && (
                  <span className="px-3 py-1.5 text-sm text-muted-foreground">
                    +{availableEnvsFromLibrary.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Generate Button */}
      <Button
        variant="hero"
        size="xl"
        className="w-full"
        disabled={!isReady || isGenerating}
        onClick={onGenerate}
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin-slow" />
            Generating with AI...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Production Template
          </>
        )}
      </Button>
    </div>
  );
}
