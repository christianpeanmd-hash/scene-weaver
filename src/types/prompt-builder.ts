export interface Character {
  id: number;
  name: string;
  look: string;
  demeanor: string;
  role: string;
}

export interface Scene {
  id: number;
  title: string;
  description: string;
  generated: boolean;
  content: string;
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
