export interface Character {
  id: number;
  name: string;
  look: string;
  demeanor: string;
  role: string;
}

export interface EnhancedCharacter extends Character {
  enhancedLook?: string;
  enhancedDemeanor?: string;
  enhancedRole?: string;
  sourceTemplate?: string;
  createdAt: number;
}

export interface Environment {
  id: number;
  name: string;
  setting: string;
  lighting: string;
  audio: string;
  props: string;
}

export interface EnhancedEnvironment extends Environment {
  enhancedSetting?: string;
  enhancedLighting?: string;
  enhancedAudio?: string;
  enhancedProps?: string;
  sourceTemplate?: string;
  createdAt: number;
}

export interface Scene {
  id: number;
  title: string;
  description: string;
  generated: boolean;
  content: string;
  selectedCharacterIds?: number[];
  selectedEnvironmentId?: number;
}

export interface Duration {
  seconds: 8 | 10 | 15;
  label: string;
  platform: "Veo" | "Sora";
}

export const DURATIONS: Duration[] = [
  { seconds: 8, label: "8 sec", platform: "Veo" },
  { seconds: 10, label: "10 sec", platform: "Sora" },
  { seconds: 15, label: "15 sec", platform: "Sora" },
];
