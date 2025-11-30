import { Sparkles, Clock, Clapperboard, User, Plus, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CharacterCard } from "@/components/CharacterCard";
import { Character, DURATIONS } from "@/types/prompt-builder";
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
  expandedChar: number | null;
  setExpandedChar: (value: number | null) => void;
  onAddCharacter: () => void;
  onUpdateCharacter: (id: number, field: keyof Character, value: string) => void;
  onRemoveCharacter: (id: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function SetupStep({
  concept,
  setConcept,
  duration,
  setDuration,
  videoStyle,
  setVideoStyle,
  characters,
  expandedChar,
  setExpandedChar,
  onAddCharacter,
  onUpdateCharacter,
  onRemoveCharacter,
  onGenerate,
  isGenerating,
}: SetupStepProps) {
  const filledCharacters = characters.filter(isCharacterComplete).length;
  const isReady = concept.trim().length > 0;
  const showWarning = characters.length > 2;

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

        <div className="p-4 bg-slate-50/50">
          <button
            onClick={onAddCharacter}
            className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add a character
          </button>
          {showWarning && (
            <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-700">
                AI generators work best with 1–2 characters.
              </p>
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
            Generating...
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
