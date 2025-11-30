import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { MemoableLogo } from "./MemoableLogo";
import { ProgressSteps, StepKey } from "./ProgressSteps";
import { SetupStep } from "./steps/SetupStep";
import { TemplateStep } from "./steps/TemplateStep";
import { ScenesStep } from "./steps/ScenesStep";
import { Character, Scene, EnhancedCharacter } from "@/types/prompt-builder";
import { generateAITemplate, generateAIScene } from "@/lib/ai-template-generator";
import { isCharacterComplete } from "@/lib/template-generator";
import { useCharacterLibrary, parseCharactersFromTemplate } from "@/hooks/useCharacterLibrary";

export function VideoPromptBuilder() {
  const [step, setStep] = useState<StepKey>("setup");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [concept, setConcept] = useState("");
  const [videoStyle, setVideoStyle] = useState("");
  const [duration, setDuration] = useState<number | null>(null);
  const [template, setTemplate] = useState("");
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [copiedId, setCopiedId] = useState<number | string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedChar, setExpandedChar] = useState<number | null>(null);
  const [generatingSceneId, setGeneratingSceneId] = useState<number | null>(null);

  const { savedCharacters, saveCharacter } = useCharacterLibrary();

  const addCharacter = () => {
    const newId = characters.length > 0 ? Math.max(...characters.map((c) => c.id)) + 1 : 1;
    const newChar: Character = { id: newId, name: "", look: "", demeanor: "", role: "" };
    setCharacters([...characters, newChar]);
    setExpandedChar(newId);
  };

  const addCharacterFromLibrary = (enhanced: EnhancedCharacter) => {
    const newId = characters.length > 0 ? Math.max(...characters.map((c) => c.id)) + 1 : 1;
    const newChar: Character = {
      id: newId,
      name: enhanced.name,
      look: enhanced.enhancedLook || enhanced.look,
      demeanor: enhanced.enhancedDemeanor || enhanced.demeanor,
      role: enhanced.enhancedRole || enhanced.role,
    };
    setCharacters([...characters, newChar]);
    toast.success(`Added ${enhanced.name} from library`);
  };

  const removeCharacter = (id: number) => {
    setCharacters(characters.filter((c) => c.id !== id));
    if (expandedChar === id) setExpandedChar(null);
  };

  const updateCharacter = (id: number, field: keyof Character, value: string) => {
    setCharacters(characters.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleGenerateTemplate = async () => {
    setIsGenerating(true);
    try {
      const generatedTemplate = await generateAITemplate({
        concept,
        duration,
        videoStyle,
        characters,
      });
      setTemplate(generatedTemplate);

      // Parse and save enhanced characters from the generated template
      const parsedChars = parseCharactersFromTemplate(generatedTemplate);
      parsedChars.forEach((parsed) => {
        if (parsed.name) {
          const enhanced: EnhancedCharacter = {
            id: Date.now() + Math.random(),
            name: parsed.name,
            look: parsed.look || "",
            demeanor: parsed.demeanor || "",
            role: parsed.role || "",
            enhancedLook: parsed.enhancedLook,
            enhancedDemeanor: parsed.enhancedDemeanor,
            enhancedRole: parsed.enhancedRole,
            sourceTemplate: concept,
            createdAt: Date.now(),
          };
          saveCharacter(enhanced);
        }
      });

      if (parsedChars.length > 0) {
        toast.success(`Template generated! ${parsedChars.length} character(s) saved to library.`);
      } else {
        toast.success("Template generated successfully!");
      }
      setStep("template");
    } catch (error) {
      console.error("Error generating template:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate template");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveTemplate = () => {
    setStep("scenes");
  };

  const addScene = () => {
    const newScene: Scene = {
      id: Date.now(),
      title: "",
      description: "",
      generated: false,
      content: "",
      selectedCharacterIds: [],
    };
    setScenes([...scenes, newScene]);
  };

  const updateScene = (id: number, field: keyof Scene, value: string | number[]) => {
    setScenes(scenes.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleGenerateScene = async (id: number) => {
    const scene = scenes.find((s) => s.id === id);
    if (!scene || !scene.description.trim()) return;

    // Get selected characters from library for this scene
    const sceneCharacters = scene.selectedCharacterIds
      ?.map((charId) => savedCharacters.find((c) => c.id === charId))
      .filter((c): c is EnhancedCharacter => !!c)
      .map((c) => ({
        id: c.id,
        name: c.name,
        look: c.enhancedLook || c.look,
        demeanor: c.enhancedDemeanor || c.demeanor,
        role: c.enhancedRole || c.role,
      })) || characters;

    setGeneratingSceneId(id);
    try {
      const generatedContent = await generateAIScene({
        concept,
        duration,
        videoStyle,
        characters: sceneCharacters.length > 0 ? sceneCharacters : characters,
        sceneTitle: scene.title,
        sceneDescription: scene.description,
      });

      setScenes(
        scenes.map((s) =>
          s.id === id
            ? {
                ...s,
                generated: true,
                content: generatedContent,
              }
            : s
        )
      );
      toast.success("Scene generated successfully!");
    } catch (error) {
      console.error("Error generating scene:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate scene");
    } finally {
      setGeneratingSceneId(null);
    }
  };

  const removeScene = (id: number) => {
    setScenes(scenes.filter((s) => s.id !== id));
  };

  const handleCopy = (text: string, id: number | string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 animate-fade-in">
          <MemoableLogo />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            Video Prompt Builder
          </div>
        </header>

        {/* Progress Steps */}
        <ProgressSteps
          currentStep={step}
          hasTemplate={!!template}
          onStepClick={setStep}
        />

        {/* Step Content */}
        {step === "setup" && (
          <SetupStep
            concept={concept}
            setConcept={setConcept}
            duration={duration}
            setDuration={setDuration}
            videoStyle={videoStyle}
            setVideoStyle={setVideoStyle}
            characters={characters}
            expandedChar={expandedChar}
            setExpandedChar={setExpandedChar}
            onAddCharacter={addCharacter}
            onAddCharacterFromLibrary={addCharacterFromLibrary}
            onUpdateCharacter={updateCharacter}
            onRemoveCharacter={removeCharacter}
            onGenerate={handleGenerateTemplate}
            isGenerating={isGenerating}
            savedCharacters={savedCharacters}
          />
        )}

        {step === "template" && (
          <TemplateStep
            template={template}
            copied={copiedId === "template"}
            onCopy={() => handleCopy(template, "template")}
            onEdit={() => setStep("setup")}
            onApprove={handleApproveTemplate}
          />
        )}

        {step === "scenes" && (
          <ScenesStep
            concept={concept}
            duration={duration}
            characters={characters}
            savedCharacters={savedCharacters}
            scenes={scenes}
            copiedId={typeof copiedId === "number" ? copiedId : null}
            generatingSceneId={generatingSceneId}
            onViewTemplate={() => setStep("template")}
            onUpdateScene={updateScene}
            onGenerateScene={handleGenerateScene}
            onCopyScene={(id, content) => handleCopy(content, id)}
            onRemoveScene={removeScene}
            onAddScene={addScene}
          />
        )}
      </div>
    </div>
  );
}
