import { ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type StepKey = "setup" | "template" | "scenes";

interface Step {
  key: StepKey;
  label: string;
}

const steps: Step[] = [
  { key: "setup", label: "Setup" },
  { key: "template", label: "Review" },
  { key: "scenes", label: "Scenes" },
];

interface ProgressStepsProps {
  currentStep: StepKey;
  hasTemplate: boolean;
  onStepClick: (step: StepKey) => void;
  onReset?: () => void;
}

export function ProgressSteps({ currentStep, hasTemplate, onStepClick, onReset }: ProgressStepsProps) {
  const canNavigate = (stepKey: StepKey): boolean => {
    if (stepKey === "setup") return true;
    if (stepKey === "template" && hasTemplate) return true;
    if (stepKey === "scenes" && currentStep === "scenes") return true;
    return false;
  };

  return (
    <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center gap-3">
          <button
            onClick={() => canNavigate(step.key) && onStepClick(step.key)}
            disabled={!canNavigate(step.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              currentStep === step.key
                ? "bg-card text-teal-700 shadow-sm border border-teal-200"
                : "text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <span
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                currentStep === step.key
                  ? "gradient-primary text-primary-foreground"
                  : "bg-slate-200 text-slate-500"
              )}
            >
              {i + 1}
            </span>
            {step.label}
          </button>
          {i < steps.length - 1 && (
            <ChevronRight className="w-4 h-4 text-slate-300" />
          )}
        </div>
      ))}
      
      {/* Start New Button */}
      {hasTemplate && onReset && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="ml-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Start New
        </Button>
      )}
    </div>
  );
}
