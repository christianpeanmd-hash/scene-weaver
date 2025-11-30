import { cn } from "@/lib/utils";

interface MemoableLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function MemoableLogo({ className, size = "md" }: MemoableLogoProps) {
  const sizes = {
    sm: { 
      bar: "w-4 h-1", 
      gap: "gap-0.5", 
      text: "text-base",
      logoSize: "w-5 h-5"
    },
    md: { 
      bar: "w-5 h-1.5", 
      gap: "gap-0.5", 
      text: "text-lg",
      logoSize: "w-6 h-6"
    },
    lg: { 
      bar: "w-7 h-2", 
      gap: "gap-1", 
      text: "text-2xl md:text-3xl",
      logoSize: "w-8 h-8"
    },
  };

  const { bar, gap, text, logoSize } = sizes[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className={cn("flex flex-col", gap, logoSize, "relative")}>
        <div className={cn(bar, "rounded-full bg-slate-700 transition-transform hover:scale-110")} />
        <div className={cn(bar, "rounded-full bg-teal-500 transition-transform hover:scale-110")} style={{ animationDelay: '0.1s' }} />
        <div className={cn(bar, "rounded-full bg-emerald-400 transition-transform hover:scale-110")} style={{ animationDelay: '0.2s' }} />
      </div>
      <span className={cn("font-bold tracking-tight", text)}>
        <span className="text-slate-700">Memo</span>
        <span className="gradient-text">able</span>
      </span>
    </div>
  );
}
