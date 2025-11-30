import { useState } from "react";
import { Sparkles, Copy, Check, Clock, ExternalLink, ChevronDown, ChevronUp, User, MapPin, Clapperboard, Library } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIToolLinks } from "@/components/AIToolLinks";
import { FreeLimitModal } from "@/components/FreeLimitModal";
import { VIDEO_STYLE_PRESETS } from "@/data/video-style-presets";
import { CHARACTER_PRESETS, ENVIRONMENT_PRESETS } from "@/data/preset-anchors";
import { generateAITemplate, RateLimitError } from "@/lib/ai-template-generator";
import { useCharacterLibrary } from "@/hooks/useCharacterLibrary";
import { useEnvironmentLibrary } from "@/hooks/useEnvironmentLibrary";
import { useUsageLimit } from "@/hooks/useUsageLimit";
import { cn } from "@/lib/utils";

const DURATIONS = [
  { seconds: 5, label: "5s", platform: "Quick clip" },
  { seconds: 10, label: "10s", platform: "TikTok / Reel" },
  { seconds: 15, label: "15s", platform: "Short story" },
];

export function SimpleVideoBuilder() {
  const [description, setDescription] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null);
  const [duration, setDuration] = useState(10);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { savedCharacters } = useCharacterLibrary();
  const { savedEnvironments } = useEnvironmentLibrary();
  const { showLimitModal, setShowLimitModal, handleRateLimitError } = useUsageLimit();

  // Combine presets with library items
  const characterOptions = [
    ...CHARACTER_PRESETS.slice(0, 6).map(p => ({ id: p.id, name: p.name, type: 'preset' as const })),
    ...savedCharacters.slice(0, 4).map(c => ({ id: String(c.id), name: c.name, type: 'library' as const })),
  ];

  const environmentOptions = [
    ...ENVIRONMENT_PRESETS.slice(0, 6).map(p => ({ id: p.id, name: p.name, type: 'preset' as const })),
    ...savedEnvironments.slice(0, 4).map(e => ({ id: String(e.id), name: e.name, type: 'library' as const })),
  ];

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error("Please describe your video");
      return;
    }

    setIsGenerating(true);
    try {
      // Build the style prompt
      const stylePreset = VIDEO_STYLE_PRESETS.find(s => s.id === selectedStyle);
      const charPreset = CHARACTER_PRESETS.find(c => c.id === selectedCharacter);
      const envPreset = ENVIRONMENT_PRESETS.find(e => e.id === selectedEnvironment);
      const libChar = savedCharacters.find(c => String(c.id) === selectedCharacter);
      const libEnv = savedEnvironments.find(e => String(e.id) === selectedEnvironment);

      // Build characters array
      const characters = [];
      if (charPreset) {
        const lookMatch = charPreset.template.match(/\*\*Look\*\*:\s*([^\n]+)/);
        const demeanorMatch = charPreset.template.match(/\*\*Demeanor\*\*:\s*([^\n]+)/);
        const roleMatch = charPreset.template.match(/\*\*Role\*\*:\s*([^\n]+)/);
        characters.push({
          id: 1,
          name: charPreset.name,
          look: lookMatch?.[1]?.trim() || "",
          demeanor: demeanorMatch?.[1]?.trim() || "",
          role: roleMatch?.[1]?.trim() || "",
        });
      } else if (libChar) {
        characters.push({
          id: 1,
          name: libChar.name,
          look: libChar.enhancedLook || libChar.look,
          demeanor: libChar.enhancedDemeanor || libChar.demeanor,
          role: libChar.enhancedRole || libChar.role,
        });
      }

      // Build environments array
      const environments = [];
      if (envPreset) {
        const settingMatch = envPreset.template.match(/\*\*Setting\*\*:\s*([^\n]+)/);
        const lightingMatch = envPreset.template.match(/\*\*Lighting\*\*:\s*([^\n]+)/);
        environments.push({
          id: 1,
          name: envPreset.name,
          setting: settingMatch?.[1]?.trim() || "",
          lighting: lightingMatch?.[1]?.trim() || "",
          audio: "",
          props: "",
        });
      } else if (libEnv) {
        environments.push({
          id: 1,
          name: libEnv.name,
          setting: libEnv.enhancedSetting || libEnv.setting,
          lighting: libEnv.enhancedLighting || libEnv.lighting,
          audio: libEnv.enhancedAudio || libEnv.audio,
          props: libEnv.enhancedProps || libEnv.props,
        });
      }

      const result = await generateAITemplate({
        concept: description,
        duration,
        videoStyle: stylePreset?.prompt || "",
        characters,
        environments,
      });

      setGeneratedPrompt(result);
      toast.success("Prompt generated!");
    } catch (error) {
      console.error("Error generating:", error);
      if (error instanceof RateLimitError) {
        handleRateLimitError();
      } else {
        toast.error(error instanceof Error ? error.message : "Failed to generate");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setGeneratedPrompt("");
    setDescription("");
    setSelectedStyle(null);
    setSelectedCharacter(null);
    setSelectedEnvironment(null);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Video Styles - Primary Selection */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Clapperboard className="w-4 h-4 text-primary" />
            Style
          </label>
          <div className="flex flex-wrap gap-2">
            {VIDEO_STYLE_PRESETS.map((style) => {
              const Icon = style.icon;
              const isSelected = selectedStyle === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(isSelected ? null : style.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all text-sm font-medium",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card hover:border-primary/50 text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {style.name}
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration Pills */}
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d.seconds}
                onClick={() => setDuration(d.seconds)}
                className={cn(
                  "px-4 py-2 rounded-lg border transition-all text-sm font-medium",
                  duration === d.seconds
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your video... e.g., A chef dramatically flames a dish tableside at a fancy restaurant"
            rows={3}
            className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-base"
          />
        </div>

        {/* Advanced Options (Collapsible) */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showAdvanced ? "Hide" : "Show"} character & environment presets
        </button>

        {showAdvanced && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-xl">
            {/* Character Presets */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <User className="w-3 h-3" />
                Character (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {characterOptions.map((char) => (
                  <button
                    key={char.id}
                    onClick={() => setSelectedCharacter(selectedCharacter === char.id ? null : char.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full border text-xs transition-all",
                      selectedCharacter === char.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50",
                      char.type === 'library' && "bg-teal-50/50"
                    )}
                  >
                    {char.type === 'library' && <Library className="w-3 h-3 inline mr-1" />}
                    {char.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Environment Presets */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <MapPin className="w-3 h-3" />
                Environment (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {environmentOptions.map((env) => (
                  <button
                    key={env.id}
                    onClick={() => setSelectedEnvironment(selectedEnvironment === env.id ? null : env.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full border text-xs transition-all",
                      selectedEnvironment === env.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50",
                      env.type === 'library' && "bg-emerald-50/50"
                    )}
                  >
                    {env.type === 'library' && <Library className="w-3 h-3 inline mr-1" />}
                    {env.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <Button
          variant="hero"
          size="xl"
          className="w-full"
          disabled={!description.trim() || isGenerating}
          onClick={handleGenerate}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Video Prompt
            </>
          )}
        </Button>

        {/* Generated Prompt Output */}
        {generatedPrompt && (
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Generated Prompt</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                >
                  Start Over
                </Button>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 max-h-80 overflow-y-auto">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                {generatedPrompt}
              </pre>
            </div>

            {/* AI Tool Links */}
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">Paste this prompt in:</p>
              <AIToolLinks type="video" />
            </div>
          </Card>
        )}
      </div>

      <FreeLimitModal
        open={showLimitModal}
        onOpenChange={setShowLimitModal}
      />
    </>
  );
}
