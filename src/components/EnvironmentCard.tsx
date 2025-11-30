import { ChevronDown, X, MapPin } from "lucide-react";
import { Environment } from "@/hooks/useEnvironmentLibrary";
import { cn } from "@/lib/utils";

interface EnvironmentCardProps {
  environment: Environment;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (field: keyof Environment, value: string) => void;
  onRemove: () => void;
}

export function EnvironmentCard({
  environment,
  isExpanded,
  onToggle,
  onUpdate,
  onRemove,
}: EnvironmentCardProps) {
  const hasContent = environment.name || environment.setting;

  return (
    <div className="group">
      <div
        className={cn(
          "p-4 cursor-pointer transition-colors",
          isExpanded ? "bg-teal-50/50" : "hover:bg-slate-50"
        )}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <span className={cn(
                "text-sm font-medium truncate block",
                environment.name ? "text-foreground" : "text-muted-foreground"
              )}>
                {environment.name || "Untitled Environment"}
              </span>
              {environment.setting && (
                <span className="text-xs text-muted-foreground truncate block">
                  {environment.setting.slice(0, 50)}...
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-100 rounded transition-all"
            >
              <X className="w-4 h-4 text-rose-500" />
            </button>
            <ChevronDown className={cn(
              "w-5 h-5 text-muted-foreground transition-transform",
              isExpanded && "rotate-180"
            )} />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 bg-teal-50/30 animate-fade-in" onClick={(e) => e.stopPropagation()}>
          <div>
            <label className="text-xs text-muted-foreground font-medium">Name</label>
            <input
              type="text"
              value={environment.name}
              onChange={(e) => onUpdate("name", e.target.value)}
              placeholder="e.g., Dystopian Cityscape"
              className="w-full mt-1 px-3 py-2 bg-white border border-border rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium">Setting</label>
            <textarea
              value={environment.setting}
              onChange={(e) => onUpdate("setting", e.target.value)}
              placeholder="Describe the location, architecture, key visual elements..."
              rows={2}
              className="w-full mt-1 px-3 py-2 bg-white border border-border rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium">Lighting</label>
            <input
              type="text"
              value={environment.lighting}
              onChange={(e) => onUpdate("lighting", e.target.value)}
              placeholder="e.g., Neon signs reflecting on wet pavement, harsh overhead fluorescents"
              className="w-full mt-1 px-3 py-2 bg-white border border-border rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium">Audio / Atmosphere</label>
            <input
              type="text"
              value={environment.audio}
              onChange={(e) => onUpdate("audio", e.target.value)}
              placeholder="e.g., Distant traffic, rain on metal, muffled bass from club"
              className="w-full mt-1 px-3 py-2 bg-white border border-border rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium">Props</label>
            <input
              type="text"
              value={environment.props}
              onChange={(e) => onUpdate("props", e.target.value)}
              placeholder="e.g., Dumpster, fire escape, neon sign, parked motorcycle"
              className="w-full mt-1 px-3 py-2 bg-white border border-border rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
      )}
    </div>
  );
}
