import { useState } from "react";
import { Sparkles, Copy, Check, Clock, Plus, User, MapPin, Clapperboard, Library, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIToolLinks } from "@/components/AIToolLinks";
import { FreeLimitModal } from "@/components/FreeLimitModal";
import { VIDEO_STYLE_PRESETS } from "@/data/video-style-presets";
import { CHARACTER_PRESETS, ENVIRONMENT_PRESETS, ICON_MAP } from "@/data/preset-anchors";
import { generateAITemplate, RateLimitError } from "@/lib/ai-template-generator";
import { useCharacterLibrary } from "@/hooks/useCharacterLibrary";
import { useEnvironmentLibrary, EnhancedEnvironment } from "@/hooks/useEnvironmentLibrary";
import { useUsageLimit } from "@/hooks/useUsageLimit";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { EnhancedCharacter } from "@/types/prompt-builder";

const DURATIONS = [
  { seconds: 5, label: "5s" },
  { seconds: 10, label: "10s" },
  { seconds: 15, label: "15s" },
];

export function SimpleVideoBuilder() {
  const [description, setDescription] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState<string | null>(null);
  const [duration, setDuration] = useState(10);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Custom preset creation
  const [showCharacterCreator, setShowCharacterCreator] = useState(false);
  const [showEnvironmentCreator, setShowEnvironmentCreator] = useState(false);
  const [customCharacterDesc, setCustomCharacterDesc] = useState("");
  const [customEnvironmentDesc, setCustomEnvironmentDesc] = useState("");
  const [isCreatingPreset, setIsCreatingPreset] = useState(false);

  const { savedCharacters, saveCharacter } = useCharacterLibrary();
  const { savedEnvironments, saveEnvironment } = useEnvironmentLibrary();
  const { showLimitModal, setShowLimitModal, handleRateLimitError } = useUsageLimit();

  // Get selected items
  const selectedCharacter = selectedCharacterId 
    ? CHARACTER_PRESETS.find(c => c.id === selectedCharacterId) || 
      savedCharacters.find(c => String(c.id) === selectedCharacterId)
    : null;
  
  const selectedEnvironment = selectedEnvironmentId
    ? ENVIRONMENT_PRESETS.find(e => e.id === selectedEnvironmentId) ||
      savedEnvironments.find(e => String(e.id) === selectedEnvironmentId)
    : null;

  const handleCreateCharacterPreset = async () => {
    if (!customCharacterDesc.trim()) return;
    
    setIsCreatingPreset(true);
    try {
      // Use AI to enhance the description
      const { data, error } = await supabase.functions.invoke('generate-template', {
        body: {
          type: 'character-anchor',
          description: customCharacterDesc,
        }
      });

      if (error) throw error;

      const enhanced: EnhancedCharacter = {
        id: Date.now() + Math.random(),
        name: customCharacterDesc.split(' ').slice(0, 3).join(' '),
        look: data.look || customCharacterDesc,
        demeanor: data.demeanor || "",
        role: data.role || "",
        enhancedLook: data.look,
        enhancedDemeanor: data.demeanor,
        enhancedRole: data.role,
        sourceTemplate: "Custom created",
        createdAt: Date.now(),
      };
      
      saveCharacter(enhanced);
      setSelectedCharacterId(String(enhanced.id));
      setShowCharacterCreator(false);
      setCustomCharacterDesc("");
      toast.success("Character preset created!");
    } catch (error) {
      console.error("Error creating preset:", error);
      // Fallback: save without AI enhancement
      const enhanced: EnhancedCharacter = {
        id: Date.now() + Math.random(),
        name: customCharacterDesc.split(' ').slice(0, 3).join(' '),
        look: customCharacterDesc,
        demeanor: "",
        role: "",
        enhancedLook: customCharacterDesc,
        enhancedDemeanor: "",
        enhancedRole: "",
        sourceTemplate: "Custom created",
        createdAt: Date.now(),
      };
      saveCharacter(enhanced);
      setSelectedCharacterId(String(enhanced.id));
      setShowCharacterCreator(false);
      setCustomCharacterDesc("");
      toast.success("Character saved!");
    } finally {
      setIsCreatingPreset(false);
    }
  };

  const handleCreateEnvironmentPreset = async () => {
    if (!customEnvironmentDesc.trim()) return;
    
    setIsCreatingPreset(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-template', {
        body: {
          type: 'environment-anchor',
          description: customEnvironmentDesc,
        }
      });

      if (error) throw error;

      const enhanced: EnhancedEnvironment = {
        id: Date.now() + Math.random(),
        name: customEnvironmentDesc.split(' ').slice(0, 3).join(' '),
        setting: data.setting || customEnvironmentDesc,
        lighting: data.lighting || "",
        audio: data.audio || "",
        props: data.props || "",
        enhancedSetting: data.setting,
        enhancedLighting: data.lighting,
        enhancedAudio: data.audio,
        enhancedProps: data.props,
        sourceTemplate: "Custom created",
        createdAt: Date.now(),
      };
      
      saveEnvironment(enhanced);
      setSelectedEnvironmentId(String(enhanced.id));
      setShowEnvironmentCreator(false);
      setCustomEnvironmentDesc("");
      toast.success("Environment preset created!");
    } catch (error) {
      console.error("Error creating preset:", error);
      const enhanced: EnhancedEnvironment = {
        id: Date.now() + Math.random(),
        name: customEnvironmentDesc.split(' ').slice(0, 3).join(' '),
        setting: customEnvironmentDesc,
        lighting: "",
        audio: "",
        props: "",
        enhancedSetting: customEnvironmentDesc,
        enhancedLighting: "",
        enhancedAudio: "",
        enhancedProps: "",
        sourceTemplate: "Custom created",
        createdAt: Date.now(),
      };
      saveEnvironment(enhanced);
      setSelectedEnvironmentId(String(enhanced.id));
      setShowEnvironmentCreator(false);
      setCustomEnvironmentDesc("");
      toast.success("Environment saved!");
    } finally {
      setIsCreatingPreset(false);
    }
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error("Please describe what happens in your video");
      return;
    }

    setIsGenerating(true);
    try {
      const stylePreset = VIDEO_STYLE_PRESETS.find(s => s.id === selectedStyle);
      
      // Build characters array
      const characters = [];
      if (selectedCharacter) {
        if ('template' in selectedCharacter) {
          // It's a preset
          const lookMatch = selectedCharacter.template.match(/\*\*Look\*\*:\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/);
          const demeanorMatch = selectedCharacter.template.match(/\*\*Demeanor\*\*:\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/);
          const roleMatch = selectedCharacter.template.match(/\*\*Role\*\*:\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/);
          characters.push({
            id: 1,
            name: selectedCharacter.name,
            look: lookMatch?.[1]?.trim() || "",
            demeanor: demeanorMatch?.[1]?.trim() || "",
            role: roleMatch?.[1]?.trim() || "",
          });
        } else {
          // It's from library
          const libChar = selectedCharacter as EnhancedCharacter;
          characters.push({
            id: 1,
            name: libChar.name,
            look: libChar.enhancedLook || libChar.look,
            demeanor: libChar.enhancedDemeanor || libChar.demeanor,
            role: libChar.enhancedRole || libChar.role,
          });
        }
      }

      // Build environments array
      const environments = [];
      if (selectedEnvironment) {
        if ('template' in selectedEnvironment) {
          const settingMatch = selectedEnvironment.template.match(/\*\*Setting\*\*:\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/);
          const lightingMatch = selectedEnvironment.template.match(/\*\*Lighting\*\*:\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/);
          const audioMatch = selectedEnvironment.template.match(/\*\*Audio[^*]*\*\*:\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/);
          environments.push({
            id: 1,
            name: selectedEnvironment.name,
            setting: settingMatch?.[1]?.trim() || "",
            lighting: lightingMatch?.[1]?.trim() || "",
            audio: audioMatch?.[1]?.trim() || "",
            props: "",
          });
        } else {
          const libEnv = selectedEnvironment as EnhancedEnvironment;
          environments.push({
            id: 1,
            name: libEnv.name,
            setting: libEnv.enhancedSetting || libEnv.setting,
            lighting: libEnv.enhancedLighting || libEnv.lighting,
            audio: libEnv.enhancedAudio || libEnv.audio,
            props: libEnv.enhancedProps || libEnv.props,
          });
        }
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
  };

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* 1. CHARACTER SELECTION */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <User className="w-4 h-4 text-primary" />
              1. Character
              <span className="text-xs font-normal text-muted-foreground">for consistency</span>
            </label>
            {selectedCharacter && (
              <button 
                onClick={() => setSelectedCharacterId(null)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
          
          {/* Selected character display */}
          {selectedCharacter && !showCharacterCreator && (
            <div className="mb-3 p-3 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between">
              <span className="font-medium text-primary">{selectedCharacter.name}</span>
              <button onClick={() => setSelectedCharacterId(null)}>
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          )}

          {/* Character options */}
          {!showCharacterCreator ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {CHARACTER_PRESETS.map((char) => {
                  const IconComponent = ICON_MAP[char.icon];
                  return (
                    <button
                      key={char.id}
                      onClick={() => setSelectedCharacterId(char.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all",
                        selectedCharacterId === char.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {IconComponent && <IconComponent className="w-4 h-4" />}
                      {char.name}
                    </button>
                  );
                })}
              </div>
              
              {/* Library characters */}
              {savedCharacters.length > 0 && (
                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <Library className="w-3 h-3" />
                    Your library
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {savedCharacters.slice(0, 8).map((char) => (
                      <button
                        key={char.id}
                        onClick={() => setSelectedCharacterId(String(char.id))}
                        className={cn(
                          "px-3 py-1.5 rounded-full border text-xs transition-all",
                          selectedCharacterId === String(char.id)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {char.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Create custom */}
              <button
                onClick={() => setShowCharacterCreator(true)}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium"
              >
                <Plus className="w-4 h-4" />
                Create custom character
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={customCharacterDesc}
                onChange={(e) => setCustomCharacterDesc(e.target.value)}
                placeholder="Describe your character in detail... e.g., A grumpy elderly cat with grey fur, wears a tiny bow tie, walks with attitude"
                rows={3}
                className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleCreateCharacterPreset}
                  disabled={!customCharacterDesc.trim() || isCreatingPreset}
                >
                  {isCreatingPreset ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Creating...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-1" /> Create Preset</>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setShowCharacterCreator(false); setCustomCharacterDesc(""); }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* 2. ENVIRONMENT SELECTION */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="w-4 h-4 text-emerald-500" />
              2. Setting / Environment
            </label>
            {selectedEnvironment && (
              <button 
                onClick={() => setSelectedEnvironmentId(null)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
          
          {selectedEnvironment && !showEnvironmentCreator && (
            <div className="mb-3 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg flex items-center justify-between">
              <span className="font-medium text-emerald-600">{selectedEnvironment.name}</span>
              <button onClick={() => setSelectedEnvironmentId(null)}>
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          )}

          {!showEnvironmentCreator ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {ENVIRONMENT_PRESETS.map((env) => {
                  const IconComponent = ICON_MAP[env.icon];
                  return (
                    <button
                      key={env.id}
                      onClick={() => setSelectedEnvironmentId(env.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all",
                        selectedEnvironmentId === env.id
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                          : "border-border hover:border-emerald-500/50"
                      )}
                    >
                      {IconComponent && <IconComponent className="w-4 h-4" />}
                      {env.name}
                    </button>
                  );
                })}
              </div>
              
              {savedEnvironments.length > 0 && (
                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <Library className="w-3 h-3" />
                    Your library
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {savedEnvironments.slice(0, 8).map((env) => (
                      <button
                        key={env.id}
                        onClick={() => setSelectedEnvironmentId(String(env.id))}
                        className={cn(
                          "px-3 py-1.5 rounded-full border text-xs transition-all",
                          selectedEnvironmentId === String(env.id)
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                            : "border-border hover:border-emerald-500/50"
                        )}
                      >
                        {env.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowEnvironmentCreator(true)}
                className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-500 font-medium"
              >
                <Plus className="w-4 h-4" />
                Create custom environment
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={customEnvironmentDesc}
                onChange={(e) => setCustomEnvironmentDesc(e.target.value)}
                placeholder="Describe the setting in detail... e.g., A cluttered vintage bookshop at dusk, warm lamp light, dusty shelves packed with leather-bound books"
                rows={3}
                className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-emerald-500 hover:bg-emerald-600"
                  onClick={handleCreateEnvironmentPreset}
                  disabled={!customEnvironmentDesc.trim() || isCreatingPreset}
                >
                  {isCreatingPreset ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Creating...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-1" /> Create Preset</>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setShowEnvironmentCreator(false); setCustomEnvironmentDesc(""); }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* 3. VIDEO STYLE */}
        <Card className="p-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
            <Clapperboard className="w-4 h-4 text-violet-500" />
            3. Visual Style
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
                    "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all",
                    isSelected
                      ? "border-violet-500 bg-violet-500/10 text-violet-600"
                      : "border-border hover:border-violet-500/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {style.name}
                  {isSelected && <Check className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </Card>

        {/* 4. DESCRIPTION + DURATION */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              4. What happens?
              <span className="text-rose-500 text-xs font-normal">required</span>
            </label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-1">
                {DURATIONS.map((d) => (
                  <button
                    key={d.seconds}
                    onClick={() => setDuration(d.seconds)}
                    className={cn(
                      "px-2.5 py-1 rounded text-xs font-medium transition-all",
                      duration === d.seconds
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the action... e.g., walks into the coffee shop, orders confidently, then realizes they forgot their wallet"
            rows={3}
            className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          />
        </Card>

        {/* GENERATE BUTTON */}
        <Button
          variant="hero"
          size="xl"
          className="w-full"
          disabled={!description.trim() || isGenerating}
          onClick={handleGenerate}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Video Prompt
            </>
          )}
        </Button>

        {/* GENERATED OUTPUT */}
        {generatedPrompt && (
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Your Video Prompt</h3>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Prompt"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 max-h-80 overflow-y-auto">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                {generatedPrompt}
              </pre>
            </div>

            <div className="pt-3 border-t border-border">
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
