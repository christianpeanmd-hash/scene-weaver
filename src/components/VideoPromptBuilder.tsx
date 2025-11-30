import { useState } from "react";
import { Sparkles } from "lucide-react";
import { MemoableLogo } from "./MemoableLogo";
import { ProgressSteps, StepKey } from "./ProgressSteps";
import { SetupStep } from "./steps/SetupStep";
import { TemplateStep } from "./steps/TemplateStep";
import { ScenesStep } from "./steps/ScenesStep";
import { Character, Scene } from "@/types/prompt-builder";
import { generateProductionTemplate, generateSceneContent, isCharacterComplete } from "@/lib/template-generator";

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

  const addCharacter = () => {
    const newId = characters.length > 0 ? Math.max(...characters.map((c) => c.id)) + 1 : 1;
    const newChar: Character = { id: newId, name: "", look: "", demeanor: "", role: "" };
    setCharacters([...characters, newChar]);
    setExpandedChar(newId);
  };

  const removeCharacter = (id: number) => {
    setCharacters(characters.filter((c) => c.id !== id));
    if (expandedChar === id) setExpandedChar(null);
  };

  const updateCharacter = (id: number, field: keyof Character, value: string) => {
    setCharacters(characters.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleGenerateTemplate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setTemplate(generateProductionTemplate(concept, duration, videoStyle, characters));
      setStep("template");
      setIsGenerating(false);
    }, 800);
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
    };
    setScenes([...scenes, newScene]);
  };

  const updateScene = (id: number, field: keyof Scene, value: string) => {
    setScenes(scenes.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleGenerateScene = (id: number) => {
    const scene = scenes.find((s) => s.id === id);
    if (!scene || !scene.description.trim()) return;

    setScenes(
      scenes.map((s) =>
        s.id === id
          ? {
              ...s,
              generated: true,
              content: generateSceneContent(s, duration, videoStyle, characters),
            }
          : s
      )
    );
  };

  const removeScene = (id: number) => {
    setScenes(scenes.filter((s) => s.id !== id));
  };

  const handleCopy = (text: string, id: number | string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
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
            onUpdateCharacter={updateCharacter}
            onRemoveCharacter={removeCharacter}
            onGenerate={handleGenerateTemplate}
            isGenerating={isGenerating}
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
            scenes={scenes}
            copiedId={typeof copiedId === "number" ? copiedId : null}
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
