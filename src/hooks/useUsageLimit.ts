import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";

const STORAGE_KEY = "memoable_prompt_count";
const FREE_LIMIT = 5; // Soft UI limit for anonymous users

export function useUsageLimit() {
  const { user, profile } = useAuth();
  const [count, setCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    // Load count from localStorage for anonymous users
    // This is just for UI display - backend enforces the actual limit
    if (!user) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCount(parseInt(stored, 10) || 0);
      }
    } else {
      // Reset local count when user logs in
      setCount(0);
    }
  }, [user]);

  const canGenerate = useCallback(() => {
    // Logged-in users have unlimited access (backend will enforce subscription limits)
    if (user) {
      return true;
    }

    // Anonymous users have a soft UI limit
    // Backend enforces a stricter daily limit (10/day) but UI shows after 3
    return count < FREE_LIMIT;
  }, [user, count]);

  const incrementUsage = useCallback(() => {
    // Only track locally for anonymous users (for UI purposes)
    // Backend tracks the actual usage with IP hashing
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

  // Handle rate limit errors from backend
  const handleRateLimitError = useCallback(() => {
    setShowLimitModal(true);
  }, []);

  const remainingGenerations = user ? Infinity : Math.max(0, FREE_LIMIT - count);

  return {
    count,
    remainingGenerations,
    canGenerate: canGenerate(),
    checkAndIncrement,
    showLimitModal,
    setShowLimitModal,
    handleRateLimitError,
  };
}
