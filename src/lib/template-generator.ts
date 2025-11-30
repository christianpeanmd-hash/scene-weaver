import { Character, Duration, Scene, DURATIONS } from "@/types/prompt-builder";

export function isCharacterComplete(char: Character): boolean {
  return char.name.trim() !== "" && char.look.trim() !== "" && char.demeanor.trim() !== "";
}

export function generateCharacterBlock(char: Character): string {
  return `**Character Anchor: ${char.name}**
* **Look**: ${char.look}
* **Demeanor**: ${char.demeanor}${char.role ? `\n* **Role**: ${char.role}` : ""}`;
}

export function generateProductionTemplate(
  concept: string,
  duration: number | null,
  videoStyle: string,
  characters: Character[]
): string {
  const filledChars = characters.filter(isCharacterComplete);
  const charBlocks =
    filledChars.length > 0
      ? filledChars.map(generateCharacterBlock).join("\n\n")
      : "*No character anchors defined — AI will generate based on scene context.*";
  const charNames = filledChars.map((c) => c.name);
  const selectedDuration = DURATIONS.find((d) => d.seconds === duration);

  return `# Production Template

## Concept
*${concept}*

## Technical Specs
* **Duration**: ${selectedDuration ? `${selectedDuration.seconds} seconds (${selectedDuration.platform})` : "Not specified"}
* **Video Style**: ${videoStyle || "Not specified — AI will interpret from scene"}
* **Aspect Ratio**: Horizontal 16:9

---

## Characters

${charBlocks}

---

## Production Notes

* **Camera Style**: Handheld for action sequences, locked-off for talking heads/confessionals
* **Lighting**: Appropriate to setting; consistent across scenes
${charNames.length > 0 ? `* **Cast**: ${charNames.join(", ")}` : ""}

---

## Scenes

*Scenes will be added below once this template is approved.*`;
}

export function generateSceneContent(
  scene: Scene,
  duration: number | null,
  videoStyle: string,
  characters: Character[]
): string {
  const filledChars = characters.filter(isCharacterComplete);
  const charNames = filledChars.map((c) => c.name);
  const selectedDuration = DURATIONS.find((d) => d.seconds === duration);
  const dur = selectedDuration?.seconds || 10;

  // Generate time breakdowns based on duration
  const timeBreaks =
    dur === 8
      ? ["0–2 s", "2–4 s", "4–6 s", "6–8 s"]
      : dur === 10
      ? ["0–2 s", "2–4 s", "4–6 s", "6–8 s", "8–10 s"]
      : ["0–3 s", "3–6 s", "6–9 s", "9–12 s", "12–15 s"];

  const castLine =
    charNames.length > 0
      ? `* **Cast**: ${charNames
          .map((name, i) => {
            const char = filledChars[i];
            return `${name} (${char.demeanor.split(";")[0].split(",")[0]})`;
          })
          .join(", ")}`
      : "* **Cast**: Characters as described in scene";

  const performanceNotes =
    charNames.length > 0
      ? charNames
          .map((name, i) => {
            const char = filledChars[i];
            return `${name} should embody "${char.demeanor.split(";")[0].split(",")[0]}"`;
          })
          .join(". ")
      : "Characters should feel natural and grounded in the scene context";

  return `### 🎬 ${scene.title || "Untitled Scene"}

*${scene.description}*

**Duration**: ${dur} seconds${selectedDuration ? ` (${selectedDuration.platform})` : ""}
**Style**: ${videoStyle || "Match to scene tone"}

#### 📍 Scene Setup

* **Aspect / Camera**: Horizontal 16:9, handheld with subtle snap-zooms
* **Setting**: [Inferred from scene description]
* **Lighting**: [Appropriate to mood and setting]
* **Props**: • [Key prop 1] • [Key prop 2] • [Key prop 3]
${castLine}

#### 🎥 Visual Breakdown

| Time | Action & Framing |
|------|------------------|
${timeBreaks.map((t, i) => `| **${t}** | [Action beat ${i + 1}] |`).join("\n")}

#### 🔊 Audio Breakdown

* **Dialogue**
  "[Key line 1]"
  "[Key line 2]"
  "[Button/punchline]"
* **SFX**
  ${timeBreaks.slice(0, -1).map((t, i) => `${t} – [Sound ${i + 1}]`).join("\n  ")}
* **Music**
  [Style recommendation based on tone]

#### 🎛 Direction Notes

* **Performance**: ${performanceNotes}.
* **Camera**: Start wide to establish, push in for emotional beats, snap zoom on punchlines.
* **Graphics**: [Optional lower-thirds, timestamps, or text overlays]
* **Color Grade**: [Mood-appropriate grading]`;
}
