const steps = [
  {
    number: "1",
    title: "Describe your idea",
    description: "Type a one-sentence concept, choose a duration, and optionally add style, characters, and environment.",
    example: "Concept: 7s Bigfoot energy drink ad, bold and playful."
  },
  {
    number: "2",
    title: "Review the outline",
    description: "We draft a tight scene with timecodes, actions, and dialogue. Adjust the beats once, reuse that structure for future variations.",
    example: "0–2s: Bigfoot cracks can. 2–4s: Fizz + logo close-up."
  },
  {
    number: "3",
    title: "Export and reuse",
    description: "Copy the SceneBlock into your AI video tool or shoot it yourself—and use matching image prompts for portraits, marketing, and diagrams.",
    example: 'SceneBlock + "bold retro Bigfoot ad" image prompt.'
  }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-muted/30 py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4">
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
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="bg-card border border-border rounded-xl p-6 shadow-sm">
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
      </div>
    </section>
  );
}
