import { Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useUsageLimit } from "@/hooks/useUsageLimit";
import { useAuth } from "@/hooks/useAuth";

export function UsageCounter() {
  const { user } = useAuth();
  const { count, remainingGenerations } = useUsageLimit();

  // Don't show for logged-in users
  if (user) return null;

  // Don't show if no generations have been used yet
  if (count === 0) return null;

  const isNearLimit = remainingGenerations <= 2;
  const isAtLimit = remainingGenerations === 0;

  return (
    <div className="flex justify-center mt-4 animate-fade-in">
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-all ${
          isAtLimit
            ? "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
            : isNearLimit
            ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
            : "bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400"
        }`}
      >
        <Zap className="w-4 h-4" />
        <span className="font-medium">
          {isAtLimit ? (
            <>
              Free limit reached
              <Link
                to="/auth"
                className="ml-2 underline underline-offset-2 hover:no-underline"
              >
                Sign up free →
              </Link>
            </>
          ) : (
            <>
              {count} of 5 free generations used
              {isNearLimit && (
                <Link
                  to="/auth"
                  className="ml-2 text-xs opacity-80 hover:opacity-100 underline underline-offset-2"
                >
                  Sign up for more
                </Link>
              )}
            </>
          )}
        </span>
      </div>
    </div>
  );
}
