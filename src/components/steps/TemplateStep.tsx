import { Copy, Check, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIToolLinks } from "@/components/AIToolLinks";

interface TemplateStepProps {
  template: string;
  copied: boolean;
  onCopy: () => void;
  onEdit: () => void;
  onApprove: () => void;
}

export function TemplateStep({ template, copied, onCopy, onEdit, onApprove }: TemplateStepProps) {
  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <span className="text-foreground font-medium">Production Template</span>
          <button
            onClick={onCopy}
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
        <div className="p-5 max-h-[400px] overflow-y-auto bg-slate-50">
          <pre className="text-muted-foreground text-sm whitespace-pre-wrap font-mono leading-relaxed">
            {template}
          </pre>
        </div>
        <div className="p-4 border-t border-border/50 bg-card">
          <AIToolLinks type="video" />
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onEdit}>
          Edit Setup
        </Button>
        <Button variant="hero" className="flex-1" onClick={onApprove}>
          <CheckCircle className="w-5 h-5" />
          Approve & Add Scenes
        </Button>
      </div>
    </div>
  );
}
