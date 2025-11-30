import { Character, Duration, Scene, DURATIONS } from "@/types/prompt-builder";

export function isCharacterComplete(char: Character): boolean {
  return char.name.trim() !== "" && char.look.trim() !== "" && char.demeanor.trim() !== "";
}

export function generateCharacterBlock(char: Character): string {
  return `**Character Anchor: ${char.name}**
* **Look**: ${char.look}
* **Demeanor**: ${char.demeanor}${char.role ? `\n* **Role**: ${char.role}` : ""}`;
}

function getTimeBreaks(duration: number): string[] {
  if (duration === 8) {
    return ["0–2 s", "2–4 s", "4–6 s", "6–8 s"];
  } else if (duration === 10) {
    return ["0–2 s", "2–4 s", "4–6 s", "6–8 s", "8–10 s"];
  }
  return ["0–3 s", "3–6 s", "6–9 s", "9–12 s", "12–15 s"];
}

function getBeatDescriptions(duration: number): string[] {
  if (duration === 8) {
    return ["Establish / Setup", "Action / Turn", "Escalation / Reaction", "Punchline / Button"];
  } else if (duration === 10) {
    return ["Establish", "Setup", "Turn / Action", "Escalation", "Punchline / Resolution"];
  }
  return ["Establish / Set scene", "Setup / Introduce conflict", "Turn / Main action", "Escalation / Reaction", "Resolution / Button"];
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
      : "*No character anchors defined — characters will be generated based on scene context.*";
  const charNames = filledChars.map((c) => c.name);
  const selectedDuration = DURATIONS.find((d) => d.seconds === duration);
  const dur = selectedDuration?.seconds || 10;
  const timeBreaks = getTimeBreaks(dur);
  const beatDescriptions = getBeatDescriptions(dur);

  // Generate cast line with emotional arcs
  const castLine = filledChars.length > 0
    ? `* **Cast**: ${filledChars.map((char) => {
        const demeanorShort = char.demeanor.split(";")[0].split(",")[0].trim();
        return `${char.name} (${demeanorShort} → [transition] → [end state])`;
      }).join(", ")}`
    : "* **Cast**: Characters as described in scene";

  // Generate performance notes
  const performanceNotes = filledChars.length > 0
    ? filledChars.map((char) => {
        const demeanorShort = char.demeanor.split(";")[0].split(",")[0].trim();
        return `${char.name} should embody "${demeanorShort}" — [specific physical/emotional direction]`;
      }).join(". ") + "."
    : "Characters should feel natural and grounded in the scene context. [Specific performance direction].";

  // Determine style description
  const styleDesc = videoStyle 
    ? `${videoStyle}; 16:9, handheld with subtle snap-zooms, **no music**`
    : "Match to scene tone; 16:9, handheld with subtle snap-zooms, **no music**";

  return `### 🎬 [Scene Title — 3-5 punchy words]

*${concept}*

---

## Characters

${charBlocks}

---

**Video Style:** ${styleDesc}.

---

#### 📍 Scene Setup

* **Aspect / Camera**: Horizontal 16:9, handheld with subtle snap-zooms for action, locked-off for static moments
* **Setting**: [Location with visual details — describe what we SEE: textures, colors, objects, lighting quality, atmosphere]
* **Lighting**: [Quality and color temperature — e.g., "Warm cafe overheads; soft morning light through windows" or "Cool fluorescent office lighting; harsh and clinical"]
* **Props**: • [Key prop 1 with visual detail] • [Key prop 2 with visual detail] • [Key prop 3 with visual detail]
${castLine}

---

#### 🎥 Visual Breakdown

| Time | Action & Framing |
|------|------------------|
${timeBreaks.map((t, i) => `| **${t}** | [${beatDescriptions[i]}] — [Shot type] on [subject]; [specific action/dialogue]. |`).join("\n")}

---

#### 🔊 Audio Breakdown

* **Dialogue**
  "[Key line 1 — under 10 words]"
  "[Key line 2 — builds or responds]"
  "[Button/punchline — the landing moment]"
* **SFX**
  ${timeBreaks.slice(0, -1).map((t, i) => `${t} – [Ambient/environmental sound ${i + 1}]`).join("\n  ")}
* **Music**
  None (ambient sound only).

---

#### 🎛 Direction Notes

* **Performance**: ${performanceNotes}
* **Camera**: Start wide to establish, push in for emotional beats, snap zoom on punchlines. Handheld energy throughout.
* **Graphics**: None.
* **Color Grade**: [Mood-appropriate grading — e.g., "Warm and saturated" or "Cool and clinical"]. Documentary clean.

---

## Production Notes

* **Duration**: ${selectedDuration ? `${selectedDuration.seconds} seconds (${selectedDuration.platform})` : "Not specified"}
* **Aspect Ratio**: Horizontal 16:9
* **Camera Style**: Handheld for action sequences, locked-off for talking heads/confessionals
* **Lighting**: Appropriate to setting; consistent across scenes
${charNames.length > 0 ? `* **Cast**: ${charNames.join(", ")}` : ""}

---

*Fill in the bracketed placeholders above with specific, visual details. Every element should be describable — concrete details over abstract concepts.*`;
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
  const timeBreaks = getTimeBreaks(dur);
  const beatDescriptions = getBeatDescriptions(dur);

  const castLine = charNames.length > 0
    ? `* **Cast**: ${charNames
        .map((name, i) => {
          const char = filledChars[i];
          const demeanorShort = char.demeanor.split(";")[0].split(",")[0].trim();
          return `${name} (${demeanorShort} → [transition] → [end state])`;
        })
        .join(", ")}`
    : "* **Cast**: Characters as described in scene";

  const performanceNotes = charNames.length > 0
    ? charNames
        .map((name, i) => {
          const char = filledChars[i];
          const demeanorShort = char.demeanor.split(";")[0].split(",")[0].trim();
          return `${name} should embody "${demeanorShort}" — [specific physical/emotional direction]`;
        })
        .join(". ") + "."
    : "Characters should feel natural and grounded in the scene context. [Specific performance direction].";

  const styleDesc = videoStyle 
    ? `${videoStyle}; 16:9, handheld with subtle snap-zooms, **no music**`
    : "Match to scene tone; 16:9, handheld with subtle snap-zooms, **no music**";

  return `### 🎬 ${scene.title || "[Scene Title — 3-5 punchy words]"}

*${scene.description}*

---

${filledChars.length > 0 ? filledChars.map(generateCharacterBlock).join("\n\n") + "\n\n---\n\n" : ""}**Video Style:** ${styleDesc}.

---

#### 📍 Scene Setup

* **Aspect / Camera**: Horizontal 16:9, handheld with subtle snap-zooms for action, locked-off for static moments
* **Setting**: [Location with visual details — describe what we SEE: textures, colors, objects, lighting quality, atmosphere]
* **Lighting**: [Quality and color temperature — e.g., "Warm cafe overheads; soft morning light" or "Cool fluorescent; harsh and clinical"]
* **Props**: • [Key prop 1 with visual detail] • [Key prop 2 with visual detail] • [Key prop 3 with visual detail]
${castLine}

---

#### 🎥 Visual Breakdown

| Time | Action & Framing |
|------|------------------|
${timeBreaks.map((t, i) => `| **${t}** | [${beatDescriptions[i]}] — [Shot type] on [subject]; [specific action/dialogue]. |`).join("\n")}

---

#### 🔊 Audio Breakdown

* **Dialogue**
  "[Key line 1 — under 10 words]"
  "[Key line 2 — builds or responds]"
  "[Button/punchline — the landing moment]"
* **SFX**
  ${timeBreaks.slice(0, -1).map((t, i) => `${t} – [Ambient/environmental sound ${i + 1}]`).join("\n  ")}
* **Music**
  None (ambient sound only).

---

#### 🎛 Direction Notes

* **Performance**: ${performanceNotes}
* **Camera**: Start wide to establish, push in for emotional beats, snap zoom on punchlines. Handheld energy throughout.
* **Graphics**: None.
* **Color Grade**: [Mood-appropriate grading — e.g., "Warm and saturated" or "Cool and clinical"]. Documentary clean.

---

*Fill in the bracketed placeholders with specific, visual details. Every element should be describable — concrete details over abstract concepts.*`;
}
