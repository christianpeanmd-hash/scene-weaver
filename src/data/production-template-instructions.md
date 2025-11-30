# Video Prompt Production Template — Generation Instructions

## Overview

These instructions guide the generation of production templates optimized for AI video generators (Veo, Sora). The goal is to create highly specific, structured prompts that produce consistent, high-quality video output.

---

## Core Principles

### 1. Specificity Over Ambiguity
AI video generators perform best with concrete, visual details rather than abstract concepts. Every element should be describable in visual terms.

**Good:** "Messy bun escaping from a faded black cap, dark circles under eyes, coffee-stained green apron"
**Bad:** "Tired-looking barista"

### 2. Constraint Over Freedom
Limit variables to improve consistency. Fewer characters, simpler settings, and defined actions produce better results than complex, multi-element scenes.

### 3. Structure Over Prose
Use consistent formatting with clear sections. AI generators and human editors both benefit from predictable template structure.

---

## Template Structure

Every production template must include these sections in order:

```
1. Scene Title & Logline
2. Character Anchor(s)
3. Video Style
4. Scene Setup
5. Visual Breakdown (time-stamped)
6. Audio Breakdown
7. Direction Notes
```

---

## Section-by-Section Guidelines

### 1. Scene Title & Logline

Format:
```
### 🎬 [Scene Title]

*[One-sentence description of what happens]*
```

- Title should be punchy and memorable (3-5 words)
- Logline describes the core action/joke/moment
- Use italics for the logline

---

### 2. Character Anchors

For each character, provide:

```
**Character Anchor: [Name]**
* **Look**: [Physical appearance, clothing, distinctive features, accessories, colors]
* **Demeanor**: [Personality, attitude, movement style, vocal quality, emotional baseline]
* **Role**: [Function in the scene — optional but helpful]
```

#### Guidelines:
- **Look** should be camera-ready: describe what we SEE, not what we know
- Include colors, textures, and specific items (not "nice shirt" but "wrinkled navy polo with coffee stain on collar")
- **Demeanor** should inform performance: how do they move? speak? react?
- Keep to 1-2 characters for best results; warn users if adding more
- If no characters defined, note: "*Characters will be generated based on scene context*"

---

### 3. Video Style

Format:
```
**Video Style:** [Style description]; [Aspect ratio], [Camera approach], **[Music note]**.
```

Example:
```
**Video Style:** Single-cam mockumentary, *The Office* vibe; 16:9, handheld with subtle snap-zooms, **no music**.
```

#### Style Options to Reference:
- Mockumentary / talking-head confessional
- Commercial parody
- Vlog style
- Reality TV hybrid
- Corporate video parody
- Social media native (vertical noted if applicable)
- Documentary clean
- Sitcom multi-cam

#### Always Specify:
- Aspect ratio (default: Horizontal 16:9)
- Camera approach (handheld, locked-off, hybrid)
- Music intention (usually "no music" or "light underscore optional")

---

### 4. Scene Setup

Format:
```
#### 📍 Scene Setup

* **Aspect / Camera**: [Ratio], [camera style with specific techniques]
* **Setting**: [Location with visual details]
* **Lighting**: [Quality, color temperature, mood]
* **Props**: • [Prop 1] • [Prop 2] • [Prop 3]
* **Cast**: [Character names with brief emotional arc]
```

#### Guidelines:
- **Camera** should name specific techniques: "handheld with subtle snap-zooms," "locked-off medium close-up with gentle digital zooms"
- **Setting** needs enough detail to generate consistently: "Busy coffee shop counter; espresso machine steaming, cups stacked, morning light through windows"
- **Lighting** affects mood: "Standard bright OR overheads; cool white, even and clinical" vs "Warm cafe overheads; soft morning light"
- **Props** should be visible, relevant items (3-5 max)
- **Cast** format: "CharacterName (emotional state → transition → end state)"

---

### 5. Visual Breakdown

Format:
```
#### 🎥 Visual Breakdown

| Time | Action & Framing |
|------|------------------|
| **0–2 s** | [Shot type] on [subject]; [action]. |
| **2–4 s** | [Camera move] to [subject]: "[Dialogue if any]" |
| ... | ... |
```

#### Duration-Based Timing:

**8 seconds (Veo):**
| Time | Beat |
|------|------|
| 0–2 s | Establish / Setup |
| 2–4 s | Action / Turn |
| 4–6 s | Escalation / Reaction |
| 6–8 s | Punchline / Button |

**10 seconds (Sora):**
| Time | Beat |
|------|------|
| 0–2 s | Establish |
| 2–4 s | Setup |
| 4–6 s | Turn / Action |
| 6–8 s | Escalation |
| 8–10 s | Punchline / Resolution |

**15 seconds (Sora):**
| Time | Beat |
|------|------|
| 0–3 s | Establish / Set scene |
| 3–6 s | Setup / Introduce conflict |
| 6–9 s | Turn / Main action |
| 9–12 s | Escalation / Reaction |
| 12–15 s | Resolution / Button |

#### Shot & Camera Terminology:
- **Shots**: Wide, medium, medium close-up, close-up, extreme close-up, over-shoulder
- **Moves**: Whip-pan, push-in, pull-out, snap-zoom, tracking, static/locked-off
- **Transitions**: Cut, smash cut, match cut, freeze frame

#### Guidelines:
- Each time segment gets ONE clear action
- Include shot type AND subject AND action
- Put dialogue in quotes within the action description
- Note camera moves explicitly: "Whip-pan to Rep" not just "Cut to Rep"

---

### 6. Audio Breakdown

Format:
```
#### 🔊 Audio Breakdown

* **Dialogue**
  "[Line 1]"
  "[Line 2]"
  "[Line 3 — punchline or button]"
* **SFX**
  0–X s – [Ambient/environmental sounds]
  X–X s – [Action-specific sounds]
  X–X s – [Transition or punctuation sounds]
* **Music**
  [Explicit instruction — usually "None" or minimal]
```

#### Critical Audio Rules:

**Dialogue:**
- Keep lines short (under 10 words ideal)
- 2-4 lines total for short-form video
- Final line should be the button/punchline
- Format as actual quoted speech

**Sound Effects — USE SPARINGLY:**
- Prioritize ambient/environmental sounds over action SFX
- Good: "OR beeps, soft metal clink, gown rustle"
- Avoid: Cartoon sounds, excessive foley, musical stings
- SFX should feel naturalistic, not produced

**Music — DEFAULT TO NONE:**
- Most templates should specify: "None (ambient sound only)"
- If music is appropriate: "Optional light [genre] underscore"
- Never specify specific songs or artists
- Avoid dramatic scoring unless explicitly comedic

---

### 7. Direction Notes

Format:
```
#### 🎛 Direction Notes

* **Performance**: [Character-specific acting direction]
* **Camera**: [Movement and framing priorities]
* **Graphics**: [On-screen elements — usually minimal]
* **Color Grade**: [Mood and technical color direction]
```

#### Guidelines:

**Performance:**
- Reference specific emotional transitions
- Use physical direction: "sharp inhale," "long blink," "tiny eye-roll"
- Note timing: "confidence shift should be instant and complete"

**Camera:**
- Summarize the visual approach
- Note emphasis moments: "snap zoom on punchline"
- Reference handheld intensity: "minimal shake" vs "documentary energy"

**Graphics — CRITICAL:**
- DEFAULT: No on-screen text, captions, or overlays
- If any graphics: "Optional micro lower-third" or "Tiny red REC icon"
- NEVER include: Subtitles, caption burns, text overlays, emoji, stickers
- AI generators struggle with text rendering — avoid it

**Color Grade:**
- Reference mood: "Warm and saturated" vs "Cool and clinical"
- Note consistency: "Match lighting across all scenes"
- Keep direction simple: "Documentary clean, neutral whites"

---

## What NOT to Include

### Avoid These Elements:
1. **On-screen text or captions** — AI generators render text poorly
2. **Complex VFX** — Stick to practical, in-camera looks
3. **Rapid cuts** — Each cut requires consistency; minimize them
4. **More than 2 characters** — Consistency degrades with more people
5. **Specific music tracks** — Use genre direction only
6. **Detailed backgrounds** — Keep focus on foreground action
7. **Props that require reading** — No signs, labels, or text-heavy items
8. **Dramatic sound design** — Keep SFX naturalistic and sparse

### Avoid These Phrases:
- "Meanwhile..." (implies parallel action)
- "Later that day..." (AI can't handle time jumps)
- "Thinking about..." (internal states don't visualize)
- "The audience feels..." (tell us what we SEE)

---

## Quality Checklist

Before finalizing any template, verify:

- [ ] Every visual element is concrete and describable
- [ ] Character anchors include Look + Demeanor at minimum
- [ ] Duration matches platform (8s Veo, 10/15s Sora)
- [ ] Visual breakdown has one clear action per time segment
- [ ] Dialogue is short, punchy, and under 4 lines total
- [ ] SFX are ambient/environmental, not cartoon/produced
- [ ] Music is "None" or "Optional light underscore"
- [ ] Graphics section says "None" or specifies only minimal elements
- [ ] No on-screen text, captions, or subtitles anywhere
- [ ] Color grade direction is simple and mood-appropriate
- [ ] Total characters ≤ 2 (warn if more)

---

## Example Output

For reference, here is a complete template following all guidelines:

```
### 🎬 The Intentional Mistake

*Barista makes the wrong drink, then confidently pretends it was an intentional upgrade.*

**Character Anchor: Tired Tara**
* **Look**: Messy bun escaping from faded black cap, dark circles under eyes, coffee-stained green apron over wrinkled band tee, name tag pinned crooked
* **Demeanor**: Exhausted but professionally friendly; forced customer-service smile that doesn't reach her eyes; moves slowly until challenged, then snaps to false confidence
* **Role**: Barista who's been on shift too long and has stopped caring about order accuracy

**Character Anchor: Picky Pete**
* **Look**: AirPods in, designer athleisure, phone in hand, reusable cup with handwritten modification instructions
* **Demeanor**: Impatient, mildly entitled; speaks in specific coffee jargon; taps foot while waiting; sighs audibly but avoids confrontation
* **Role**: Regular customer with an impossibly complicated order

**Video Style:** Reality TV confessional hybrid; 16:9, handheld for counter shots, locked-off for talking head, **no music**.

#### 📍 Scene Setup

* **Aspect / Camera**: Horizontal 16:9, handheld with subtle snap-zooms for counter, static medium close-up for confessional
* **Setting**: Busy coffee shop counter; espresso machine steaming, cups stacked, warm morning light through windows
* **Lighting**: Warm cafe overheads; soft and inviting; slight contrast for confessional cutaway
* **Props**: • Complex drink order ticket • Wrong drink in hand • Sharpie on counter
* **Cast**: Tired Tara (exhausted → panicked → smoothly confident), Picky Pete (expectant → confused → uncertain)

#### 🎥 Visual Breakdown

| Time | Action & Framing |
|------|------------------|
| **0–2 s** | Medium on Tara reading long order ticket; slight eye twitch, exhale. |
| **2–4 s** | Quick over-shoulder: wrong milk grabbed, syrup pumps miscounted. |
| **4–6 s** | Medium two-shot; Tara hands drink over confidently: "Your Oat Honey Lavender Latte." |
| **6–8 s** | Close on Pete, confused: "I ordered almond..." Tara, unwavering: "Trust me on this one." |
| **8–10 s** | Smash cut to confessional; Tara to camera: "I have no idea what I made." |

#### 🔊 Audio Breakdown

* **Dialogue**
  "Your Oat Honey Lavender Latte."
  "I ordered almond with—"
  "Trust me on this one."
  [Confessional] "I have no idea what I made."
* **SFX**
  0–4 s – Espresso machine hiss, milk steaming, soft cafe chatter
  4–8 s – Cup placed on counter, register beep
  8–10 s – Quiet room tone for confessional
* **Music**
  None (ambient cafe sounds only).

#### 🎛 Direction Notes

* **Performance**: Tara's confidence shift at "Trust me" should be instant and complete — no hesitation. Pete should look genuinely uncertain whether to push back; lands on doubt.
* **Camera**: Handheld energy at counter; tiny snap-zoom on "Trust me." Confessional is static with micro zoom-in on punchline delivery.
* **Graphics**: None.
* **Color Grade**: Warm, slightly saturated cafe tones; confessional slightly cooler for contrast. Documentary clean.
```

---

## Version Notes

- Template structure v1.0
- Optimized for Veo (8s) and Sora (10s, 15s)
- Last updated: November 2024
