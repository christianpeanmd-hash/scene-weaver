import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";

const STORAGE_KEY = "memoable_prompt_count";
const FREE_LIMIT = 3;

export function useUsageLimit() {
  const { user, profile } = useAuth();
  const [count, setCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    // Load count from localStorage for anonymous users
    if (!user) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCount(parseInt(stored, 10) || 0);
      }
    }
  }, [user]);

  const canGenerate = useCallback(() => {
    // Logged-in users with paid plans have unlimited (for now)
    if (user) {
      // Could check profile.subscription_tier here for paid plans
      return true;
    }

    // Anonymous users have a limit
    return count < FREE_LIMIT;
  }, [user, count]);

  const incrementUsage = useCallback(() => {
    if (!user) {
      const newCount = count + 1;
      setCount(newCount);
      localStorage.setItem(STORAGE_KEY, newCount.toString());
    }
  }, [user, count]);

  const checkAndIncrement = useCallback((): boolean => {
    if (canGenerate()) {
      incrementUsage();
      return true;
    } else {
      setShowLimitModal(true);
      return false;
    }
  }, [canGenerate, incrementUsage]);

  const remainingGenerations = user ? Infinity : Math.max(0, FREE_LIMIT - count);

  return {
    count,
    remainingGenerations,
    canGenerate: canGenerate(),
    checkAndIncrement,
    showLimitModal,
    setShowLimitModal,
  };
}
