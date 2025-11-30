import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { TechyMemoLogo } from "./MemoableLogo";
import { ProgressSteps, StepKey } from "./ProgressSteps";
import { SetupStep } from "./steps/SetupStep";
import { TemplateStep } from "./steps/TemplateStep";
import { ScenesStep } from "./steps/ScenesStep";
import { FreeLimitModal } from "./FreeLimitModal";
import { Character, Scene, EnhancedCharacter, Environment, EnhancedEnvironment } from "@/types/prompt-builder";
import { generateAITemplate, generateAIScene, RateLimitError } from "@/lib/ai-template-generator";
import { isCharacterComplete } from "@/lib/template-generator";
import { useCharacterLibrary, parseCharactersFromTemplate } from "@/hooks/useCharacterLibrary";
import { useEnvironmentLibrary, parseEnvironmentFromTemplate } from "@/hooks/useEnvironmentLibrary";
import { useSceneStyleLibrary, SceneStyle } from "@/hooks/useSceneStyleLibrary";
import { useUsageLimit } from "@/hooks/useUsageLimit";
import { PresetAnchor } from "@/data/preset-anchors";

interface VideoPromptBuilderProps {
  onSwitchToImage?: () => void;
}

export function VideoPromptBuilder({ onSwitchToImage }: VideoPromptBuilderProps) {
  const [step, setStep] = useState<StepKey>("setup");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [concept, setConcept] = useState("");
  const [videoStyle, setVideoStyle] = useState("");
  const [duration, setDuration] = useState<number | null>(null);
  const [template, setTemplate] = useState("");
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [copiedId, setCopiedId] = useState<number | string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedChar, setExpandedChar] = useState<number | string | null>(null);
  const [expandedEnv, setExpandedEnv] = useState<number | string | null>(null);
  const [generatingSceneId, setGeneratingSceneId] = useState<number | string | null>(null);

  const { savedCharacters, saveCharacter } = useCharacterLibrary();
  const { savedEnvironments, saveEnvironment } = useEnvironmentLibrary();
  const { savedStyles: savedSceneStyles, saveStyle: saveSceneStyle } = useSceneStyleLibrary();
  const { showLimitModal, setShowLimitModal, handleRateLimitError } = useUsageLimit();

  // Character handlers
  const addCharacter = () => {
    const numericIds = characters.map(c => typeof c.id === 'number' ? c.id : 0);
    const newId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
    const newChar: Character = { id: newId, name: "", look: "", demeanor: "", role: "" };
    setCharacters([...characters, newChar]);
    setExpandedChar(newId);
  };

  const addCharacterFromLibrary = (enhanced: EnhancedCharacter) => {
    const numericIds = characters.map(c => typeof c.id === 'number' ? c.id : 0);
    const newId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
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

  const addCharacterFromPreset = (preset: PresetAnchor) => {
    // Parse preset template to extract character details
    const lookMatch = preset.template.match(/\*\*Look\*\*:\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/);
    const demeanorMatch = preset.template.match(/\*\*Demeanor\*\*:\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/);
    const roleMatch = preset.template.match(/\*\*Role\*\*:\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/);

    const numericIds = characters.map(c => typeof c.id === 'number' ? c.id : 0);
    const newId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
    const newChar: Character = {
      id: newId,
      name: preset.name,
      look: lookMatch?.[1]?.trim() || "",
      demeanor: demeanorMatch?.[1]?.trim() || "",
      role: roleMatch?.[1]?.trim() || "",
    };
    setCharacters([...characters, newChar]);
    setExpandedChar(newId);
    toast.success(`Added ${preset.name} preset`);
  };

  const addCharacterFromPhoto = (charData: { name: string; look: string; demeanor: string; role: string }) => {
    const numericIds = characters.map(c => typeof c.id === 'number' ? c.id : 0);
    const newId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
    const newChar: Character = {
      id: newId,
      name: charData.name,
      look: charData.look,
      demeanor: charData.demeanor,
      role: charData.role,
    };
    setCharacters([...characters, newChar]);
    setExpandedChar(newId);

    // Also save to library
    const enhanced: EnhancedCharacter = {
      id: Date.now() + Math.random(),
      name: charData.name,
      look: charData.look,
      demeanor: charData.demeanor,
      role: charData.role,
      enhancedLook: charData.look,
      enhancedDemeanor: charData.demeanor,
      enhancedRole: charData.role,
      sourceTemplate: "Generated from photo",
      createdAt: Date.now(),
    };
    saveCharacter(enhanced);
  };

  const removeCharacter = (id: number | string) => {
    setCharacters(characters.filter((c) => c.id !== id));
    if (expandedChar === id) setExpandedChar(null);
  };

  const updateCharacter = (id: number | string, field: keyof Character, value: string) => {
    setCharacters(characters.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  // Environment handlers
  const addEnvironment = () => {
    const numericIds = environments.map(e => typeof e.id === 'number' ? e.id : 0);
    const newId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
    const newEnv: Environment = { id: newId, name: "", setting: "", lighting: "", audio: "", props: "" };
    setEnvironments([...environments, newEnv]);
    setExpandedEnv(newId);
  };

  const addEnvironmentFromLibrary = (enhanced: EnhancedEnvironment) => {
    const numericIds = environments.map(e => typeof e.id === 'number' ? e.id : 0);
    const newId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
    const newEnv: Environment = {
      id: newId,
      name: enhanced.name,
      setting: enhanced.enhancedSetting || enhanced.setting,
      lighting: enhanced.enhancedLighting || enhanced.lighting,
      audio: enhanced.enhancedAudio || enhanced.audio,
      props: enhanced.enhancedProps || enhanced.props,
    };
    setEnvironments([...environments, newEnv]);
    toast.success(`Added ${enhanced.name} from library`);
  };

  const addEnvironmentFromPreset = (preset: PresetAnchor) => {
    // Parse preset template to extract environment details
    const settingMatch = preset.template.match(/\*\*Setting\*\*:\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/);
    const lightingMatch = preset.template.match(/\*\*Lighting\*\*:\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/);
    const audioMatch = preset.template.match(/\*\*Audio[^*]*\*\*:\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/);
    const propsMatch = preset.template.match(/\*\*Props\*\*:\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/);

    const numericIds = environments.map(e => typeof e.id === 'number' ? e.id : 0);
    const newId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
    const newEnv: Environment = {
      id: newId,
      name: preset.name,
      setting: settingMatch?.[1]?.trim() || "",
      lighting: lightingMatch?.[1]?.trim() || "",
      audio: audioMatch?.[1]?.trim() || "",
      props: propsMatch?.[1]?.trim() || "",
    };
    setEnvironments([...environments, newEnv]);
    setExpandedEnv(newId);
    toast.success(`Added ${preset.name} preset`);
  };

  const addEnvironmentFromPhoto = (envData: { name: string; setting: string; lighting: string; audio: string; props: string }) => {
    const numericIds = environments.map(e => typeof e.id === 'number' ? e.id : 0);
    const newId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
    const newEnv: Environment = {
      id: newId,
      name: envData.name,
      setting: envData.setting,
      lighting: envData.lighting,
      audio: envData.audio,
      props: envData.props,
    };
    setEnvironments([...environments, newEnv]);
    setExpandedEnv(newId);

    // Also save to library
    const enhanced: EnhancedEnvironment = {
      id: Date.now() + Math.random(),
      name: envData.name,
      setting: envData.setting,
      lighting: envData.lighting,
      audio: envData.audio,
      props: envData.props,
      enhancedSetting: envData.setting,
      enhancedLighting: envData.lighting,
      enhancedAudio: envData.audio,
      enhancedProps: envData.props,
      sourceTemplate: "Generated from photo",
      createdAt: Date.now(),
    };
    saveEnvironment(enhanced);
  };

  const removeEnvironment = (id: number | string) => {
    setEnvironments(environments.filter((e) => e.id !== id));
    if (expandedEnv === id) setExpandedEnv(null);
  };

  const updateEnvironment = (id: number | string, field: keyof Environment, value: string) => {
    setEnvironments(environments.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const handleGenerateTemplate = async () => {
    setIsGenerating(true);
    try {
      const generatedTemplate = await generateAITemplate({
        concept,
        duration,
        videoStyle,
        characters,
        environments,
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

      // Parse and save enhanced environment from the generated template
      const parsedEnv = parseEnvironmentFromTemplate(generatedTemplate);
      if (parsedEnv && parsedEnv.setting) {
        const envName = environments[0]?.name || `${concept.slice(0, 30)} Environment`;
        const enhanced: EnhancedEnvironment = {
          id: Date.now() + Math.random(),
          name: envName,
          setting: parsedEnv.setting || "",
          lighting: parsedEnv.lighting || "",
          audio: parsedEnv.audio || "",
          props: parsedEnv.props || "",
          enhancedSetting: parsedEnv.enhancedSetting,
          enhancedLighting: parsedEnv.enhancedLighting,
          enhancedAudio: parsedEnv.enhancedAudio,
          enhancedProps: parsedEnv.enhancedProps,
          sourceTemplate: concept,
          createdAt: Date.now(),
        };
        saveEnvironment(enhanced);
      }

      const savedCount = parsedChars.length + (parsedEnv?.setting ? 1 : 0);
      if (savedCount > 0) {
        toast.success(`Template generated! ${savedCount} anchor(s) saved to library.`);
      } else {
        toast.success("Template generated successfully!");
      }
      setStep("template");
    } catch (error) {
      console.error("Error generating template:", error);
      if (error instanceof RateLimitError) {
        handleRateLimitError();
      } else {
        toast.error(error instanceof Error ? error.message : "Failed to generate template");
      }
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
      selectedEnvironmentId: undefined,
    };
    setScenes([...scenes, newScene]);
  };

  const updateScene = (id: number | string, field: keyof Scene, value: string | (string | number)[] | number | undefined) => {
    setScenes(scenes.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleGenerateScene = async (id: number | string) => {
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

    // Get selected environment or custom environment
    let sceneEnvironments = environments;
    
    if (scene.customEnvironment?.trim()) {
      // Use custom environment description
      sceneEnvironments = [{
        id: 'custom',
        name: 'Custom Location',
        setting: scene.customEnvironment,
        lighting: '',
        audio: '',
        props: '',
      }];
    } else if (scene.selectedEnvironmentId) {
      const selectedEnv = savedEnvironments.find((e) => e.id === scene.selectedEnvironmentId);
      if (selectedEnv) {
        sceneEnvironments = [{
          id: selectedEnv.id,
          name: selectedEnv.name,
          setting: (selectedEnv as EnhancedEnvironment).enhancedSetting || selectedEnv.setting,
          lighting: (selectedEnv as EnhancedEnvironment).enhancedLighting || selectedEnv.lighting,
          audio: (selectedEnv as EnhancedEnvironment).enhancedAudio || selectedEnv.audio,
          props: (selectedEnv as EnhancedEnvironment).enhancedProps || selectedEnv.props,
        }];
      }
    }

    setGeneratingSceneId(id);
    try {
      const generatedContent = await generateAIScene({
        concept,
        duration,
        videoStyle,
        characters: sceneCharacters.length > 0 ? sceneCharacters : characters,
        environments: sceneEnvironments,
        sceneTitle: scene.title,
        sceneDescription: scene.description,
        styleTemplate: scene.styleTemplate,
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
      if (error instanceof RateLimitError) {
        handleRateLimitError();
      } else {
        toast.error(error instanceof Error ? error.message : "Failed to generate scene");
      }
    } finally {
      setGeneratingSceneId(null);
    }
  };

  const removeScene = (id: number | string) => {
    setScenes(scenes.filter((s) => s.id !== id));
  };

  const handleCopy = (text: string, id: number | string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
    <div className="pb-8 md:pb-12">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
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
            environments={environments}
            expandedChar={expandedChar}
            setExpandedChar={setExpandedChar}
            expandedEnv={expandedEnv}
            setExpandedEnv={setExpandedEnv}
            onAddCharacter={addCharacter}
            onAddCharacterFromLibrary={addCharacterFromLibrary}
            onAddCharacterFromPreset={addCharacterFromPreset}
            onAddCharacterFromPhoto={addCharacterFromPhoto}
            onUpdateCharacter={updateCharacter}
            onRemoveCharacter={removeCharacter}
            onAddEnvironment={addEnvironment}
            onAddEnvironmentFromLibrary={addEnvironmentFromLibrary}
            onAddEnvironmentFromPreset={addEnvironmentFromPreset}
            onAddEnvironmentFromPhoto={addEnvironmentFromPhoto}
            onUpdateEnvironment={updateEnvironment}
            onRemoveEnvironment={removeEnvironment}
            onGenerate={handleGenerateTemplate}
            isGenerating={isGenerating}
            savedCharacters={savedCharacters}
            savedEnvironments={savedEnvironments}
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
            savedEnvironments={savedEnvironments}
            savedSceneStyles={savedSceneStyles}
            scenes={scenes}
            copiedId={copiedId}
            generatingSceneId={generatingSceneId}
            onViewTemplate={() => setStep("template")}
            onUpdateScene={updateScene}
            onGenerateScene={handleGenerateScene}
            onCopyScene={(id, content) => handleCopy(content, id)}
            onRemoveScene={removeScene}
            onAddScene={addScene}
            onSaveSceneStyle={(style) => {
              saveSceneStyle(style);
              toast.success(`Saved "${style.name}" to your style library`);
            }}
          />
        )}
      </div>
    </div>
    <FreeLimitModal open={showLimitModal} onOpenChange={setShowLimitModal} />
    </>
  );
}
