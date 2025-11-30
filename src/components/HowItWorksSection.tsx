import { Play } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Describe your idea",
    description: "Type a one-sentence concept, choose a duration, and optionally add style, characters, and environment. Techy Memo uses this once instead of making you rewrite new prompts every time.",
    example: "Concept: 7s Bigfoot energy drink ad, bold and playful."
  },
  {
    number: "2",
    title: "Review the outline",
    description: "Techy Memo drafts a tight scene with timecodes, actions, and dialogue. You adjust the beats—once—and reuse that structure for future variations.",
    example: "0–2s: Bigfoot cracks can. 2–4s: Fizz + logo close-up."
  },
  {
    number: "3",
    title: "Export and reuse",
    description: "Copy the SceneBlock into your AI video tool or shoot it yourself—and use the matching infographic and image prompts for family portraits, marketing graphics, and research diagrams.",
    example: 'SceneBlock + "bold retro Bigfoot ad" infographic prompt.'
  }
];

const tutorials = [
  {
    title: "From idea to outline",
    subtitle: "Short walkthrough of Step 1 and Step 2."
  },
  {
    title: "Using SceneBlocks with AI video tools",
    subtitle: "How to paste prompts into Sora, Veo, or Runway."
  },
  {
    title: "Infographics, portraits & research visuals",
    subtitle: "Using Techy Memo's image and infographic prompts for family photos, marketing, and scientific figures."
  }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-muted/30 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            How it works
          </h2>
          <p className="text-muted-foreground">
            Three quick steps from rough idea to reusable prompt.
          </p>
        </div>

        {/* Step cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {steps.map((step) => (
            <div key={step.number} className="bg-card border border-border rounded-xl p-6">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {step.description}
              </p>
              <code className="block text-xs bg-muted px-3 py-2 rounded-lg text-foreground/80 font-mono">
                {step.example}
              </code>
            </div>
          ))}
        </div>

        {/* Tutorials section */}
        <div id="tutorials" className="pt-8">
          <p className="text-sm text-muted-foreground text-center mb-8">
            You'll also be able to watch short tutorials for each step.
          </p>

          <h3 className="text-lg font-semibold text-foreground text-center mb-6">
            Tutorials <span className="text-muted-foreground font-normal">(coming soon)</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {tutorials.map((tutorial, index) => (
              <div key={index} className="bg-card border border-border rounded-xl overflow-hidden">
                {/* Video placeholder */}
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-foreground/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Play className="w-5 h-5 text-foreground/40" />
                    </div>
                    <span className="text-xs text-muted-foreground">YouTube embed here</span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-foreground mb-1">{tutorial.title}</h4>
                  <p className="text-xs text-muted-foreground">{tutorial.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
