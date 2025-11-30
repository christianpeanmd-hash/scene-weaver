export interface Character {
  id: number | string;
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
  isShared?: boolean;
}

export interface Environment {
  id: number | string;
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
  isShared?: boolean;
}

export interface Scene {
  id: number | string;
  title: string;
  description: string;
  generated: boolean;
  content: string;
  selectedCharacterIds?: (number | string)[];
  selectedEnvironmentId?: number | string;
  selectedStyleIds?: string[];
  selectedStyleId?: string; // Deprecated, use selectedStyleIds
  styleTemplate?: string;
  customEnvironment?: string; // Custom environment description for this scene
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
