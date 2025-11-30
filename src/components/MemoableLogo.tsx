import { cn } from "@/lib/utils";

interface MemoableLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function MemoableLogo({ className, size = "md" }: MemoableLogoProps) {
  const sizes = {
    sm: { bar: "w-4 h-1", gap: "gap-0.5", text: "text-base" },
    md: { bar: "w-5 h-1.5", gap: "gap-0.5", text: "text-lg" },
    lg: { bar: "w-6 h-2", gap: "gap-1", text: "text-xl" },
  };

  const { bar, gap, text } = sizes[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("flex flex-col", gap)}>
        <div className={cn(bar, "rounded-full bg-slate-700")} />
        <div className={cn(bar, "rounded-full bg-teal-500")} />
        <div className={cn(bar, "rounded-full bg-emerald-400")} />
      </div>
      <span className={cn("font-semibold text-slate-700", text)}>Memoable</span>
    </div>
  );
}
