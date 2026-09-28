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
    expandedPhoto,
  } = usePortfolioStore();
  
  const { playNavigate, playSelect, playBack, playCategory } = useAudio();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't navigate during boot or when modal is open
    if (isBooting) return;
    
    // With a panel or photo open, Escape / O close it and Up / Down scroll the
    // panel (the store routes them there); nothing else reaches the menu.
    if (expandedContent || expandedAbout || expandedPhoto) {
      if (e.key === 'Escape' || e.key === 'o' || e.key === 'O') {
        e.preventDefault();
        playBack();
        goBack();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (e.key === 'ArrowUp') navigateUp();
        else navigateDown();
      }
      return;
    }

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
    expandedPhoto,
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
