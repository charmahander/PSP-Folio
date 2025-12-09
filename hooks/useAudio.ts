'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { usePortfolioStore } from '@/stores/portfolioStore';

// Only 3 unique sounds - simplified to avoid caching issues
const SOUND_FILES = {
  boot: '/audio/startup.mp3',
  nav: '/audio/navigate.mp3',
  back: '/audio/cancel.mp3',
};

export function useAudio() {
  const { isMuted } = usePortfolioStore();
  const soundsRef = useRef<{ boot: Howl | null; nav: Howl | null; back: Howl | null }>({
    boot: null,
    nav: null,
    back: null,
  });

  useEffect(() => {
    // Load only 3 unique sounds
    soundsRef.current.boot = new Howl({
      src: [SOUND_FILES.boot],
      volume: 0.6,
      preload: true,
      html5: true,
    });
    
    soundsRef.current.nav = new Howl({
      src: [SOUND_FILES.nav],
      volume: 0.3,
      preload: true,
    });
    
    soundsRef.current.back = new Howl({
      src: [SOUND_FILES.back],
      volume: 0.3,
      preload: true,
    });

    return () => {
      soundsRef.current.boot?.unload();
      soundsRef.current.nav?.unload();
      soundsRef.current.back?.unload();
    };
  }, []);

  // Single navigation sound for ALL navigation (keyboard, mouse, category, etc.)
  const playNavigate = useCallback(() => {
    if (isMuted) return;
    soundsRef.current.nav?.play();
  }, [isMuted]);

  // Back/cancel sound
  const playBack = useCallback(() => {
    if (isMuted) return;
    soundsRef.current.back?.play();
  }, [isMuted]);

  // Boot sound
  const playBoot = useCallback(() => {
    if (isMuted) return;
    soundsRef.current.boot?.play();
  }, [isMuted]);

  return {
    // All these use the SAME nav sound
    playNavigate,
    playSelect: playNavigate,
    playCursor: playNavigate,
    playCategory: playNavigate,
    playDecide: playNavigate,
    // Back sounds
    playBack,
    playCancel: playBack,
    // Boot
    playBoot,
  };
}
