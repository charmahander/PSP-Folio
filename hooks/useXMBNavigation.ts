'use client';

import { useEffect, useCallback } from 'react';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useAudio } from './useAudio';

export function useXMBNavigation() {
  const {
    navigateLeft,
    navigateRight,
    navigateUp,
    navigateDown,
    selectItem,
    goBack,
    isBooting,
    expandedContent,
    expandedAbout,
  } = usePortfolioStore();
  
  const { playNavigate, playSelect, playBack, playCategory } = useAudio();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't navigate during boot or when modal is open
    if (isBooting) return;
    
    // Allow escape to close modal
    if ((expandedContent || expandedAbout) && e.key === 'Escape') {
      playBack();
      goBack();
      return;
    }
    
    if (expandedContent || expandedAbout) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        playNavigate();
        navigateLeft();
        break;
      case 'ArrowRight':
        e.preventDefault();
        playNavigate();
        navigateRight();
        break;
      case 'ArrowUp':
        e.preventDefault();
        playNavigate();
        navigateUp();
        break;
      case 'ArrowDown':
        e.preventDefault();
        playNavigate();
        navigateDown();
        break;
      case 'Enter':
      case 'x':
      case 'X':
        e.preventDefault();
        playSelect();
        selectItem();
        break;
      case 'Escape':
      case 'o':
      case 'O':
        e.preventDefault();
        playBack();
        goBack();
        break;
    }
  }, [
    isBooting,
    expandedContent,
    expandedAbout,
    navigateLeft,
    navigateRight,
    navigateUp,
    navigateDown,
    selectItem,
    goBack,
    playNavigate,
    playSelect,
    playBack,
    playCategory,
  ]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    navigateLeft,
    navigateRight,
    navigateUp,
    navigateDown,
    selectItem,
    goBack,
  };
}
