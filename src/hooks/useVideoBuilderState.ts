import { useState, useEffect, useCallback } from 'react';
import { Character, Scene, Environment } from '@/types/prompt-builder';

const STORAGE_KEY = 'video-builder-state';

interface VideoBuilderState {
  step: 'setup' | 'template' | 'scenes';
  characters: Character[];
  environments: Environment[];
  concept: string;
  videoStyle: string;
  duration: number | null;
  template: string;
  scenes: Scene[];
}

const defaultState: VideoBuilderState = {
  step: 'setup',
  characters: [],
  environments: [],
  concept: '',
  videoStyle: '',
  duration: null,
  template: '',
  scenes: [],
};

export function useVideoBuilderState() {
  const [state, setState] = useState<VideoBuilderState>(() => {
    // Load from localStorage on initial mount
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultState, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load video builder state:', e);
    }
    return defaultState;
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save video builder state:', e);
    }
  }, [state]);

  const updateState = useCallback((updates: Partial<VideoBuilderState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetState = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    ...state,
    updateState,
    resetState,
  };
}
