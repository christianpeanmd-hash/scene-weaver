import { X, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IllustrationStyle } from "@/data/illustration-styles";
import { cn } from "@/lib/utils";

interface StyleComparisonPanelProps {
  styles: IllustrationStyle[];
  previewImages: Record<string, string>;
  onSelect: (style: IllustrationStyle) => void;
  onRemove: (styleId: string) => void;
  onClose: () => void;
}

export function StyleComparisonPanel({
  styles,
  previewImages,
  onSelect,
  onRemove,
  onClose,
}: StyleComparisonPanelProps) {
  if (styles.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-fade-in">
      <div className="container mx-auto max-w-6xl h-full flex flex-col p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h2 className="text-xl font-semibold text-foreground">
              Compare Styles ({styles.length}/3)
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Comparison Grid */}
        <div className={cn(
          "flex-1 grid gap-4 md:gap-6",
          styles.length === 1 && "grid-cols-1 max-w-md mx-auto",
          styles.length === 2 && "grid-cols-1 md:grid-cols-2",
          styles.length === 3 && "grid-cols-1 md:grid-cols-3"
        )}>
          {styles.map((style) => {
            const previewImage = previewImages[style.id];
            
            return (
              <div
                key={style.id}
                className="flex flex-col bg-card rounded-xl border border-border overflow-hidden shadow-sm"
              >
                {/* Preview Image */}
                <div className="relative aspect-[4/3] bg-muted">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt={style.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20" />
                  )}
                  <button
                    onClick={() => onRemove(style.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Style Details */}
                <div className="flex-1 p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{style.name}</h3>
                    <span className="text-xs text-muted-foreground capitalize">
                      {style.category.replace("-", " ")}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground font-medium">Look:</span>
                      <p className="text-foreground mt-0.5 text-xs leading-relaxed">
                        {style.look}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground font-medium">Best for:</span>
                      <p className="text-foreground mt-0.5 text-xs">
                        {style.useCase}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Select Button */}
                <div className="p-4 pt-0">
                  <Button
                    onClick={() => onSelect(style)}
                    className="w-full"
                    variant="default"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Select This Style
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty slots hint */}
        {styles.length < 3 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Add up to {3 - styles.length} more style{styles.length < 2 ? "s" : ""} to compare
          </p>
        )}
      </div>
    </div>
  );
}
