'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { usePortfolioStore } from '@/stores/portfolioStore';

// Central sound map to avoid repeated loads
const SOUND_FILES = {
  boot: '/audio/startup.mp3',
  nav: '/audio/navigate.mp3',
  back: '/audio/cancel.mp3',
  ok: '/audio/system-ok.mp3', // 09 SFX System Ok.mp3
};

// One-time unlock so audio works after first user gesture (browser autoplay policy).
// Must run in response to user gesture; survives React Strict Mode double-mount.
let audioUnlockAttached = false;
function attachAudioUnlock() {
  if (typeof window === 'undefined' || audioUnlockAttached) return;
  audioUnlockAttached = true;
  const unlock = () => {
    document.removeEventListener('click', unlock, true);
    document.removeEventListener('touchstart', unlock, true);
    document.removeEventListener('keydown', unlock, true);
    const Howler = (window as unknown as { Howler?: { ctx?: AudioContext } }).Howler;
    if (Howler?.ctx && typeof Howler.ctx.resume === 'function') {
      Howler.ctx.resume().catch(() => {});
    }
  };
  document.addEventListener('click', unlock, true);
  document.addEventListener('touchstart', unlock, true);
  document.addEventListener('keydown', unlock, true);
}

export function useAudio() {
  const { isMuted } = usePortfolioStore();
  const soundsRef = useRef<{
    boot: Howl | null;
    nav: Howl | null;
    back: Howl | null;
    ok: Howl | null;
  }>({
    boot: null,
    nav: null,
    back: null,
    ok: null,
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

    soundsRef.current.ok = new Howl({
      src: [SOUND_FILES.ok],
      volume: 0.4,
      preload: true,
    });

    // Ensure unlock listeners are attached so first click/tap/key unlocks audio
    attachAudioUnlock();

    return () => {
      soundsRef.current.boot?.unload();
      soundsRef.current.nav?.unload();
      soundsRef.current.back?.unload();
      soundsRef.current.ok?.unload();
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

  // Select / OK sound
  const playSelect = useCallback(() => {
    if (isMuted) return;
    soundsRef.current.ok?.play();
  }, [isMuted]);

  // Boot sound — ensure it can only fire once per session
  const bootPlayedRef = useRef(false);
  const playBoot = useCallback(() => {
    if (isMuted) return;
    if (bootPlayedRef.current) return;
    bootPlayedRef.current = true;
    soundsRef.current.boot?.play();
  }, [isMuted]);

  return {
    // Navigation sounds
    playNavigate,
    playCursor: playNavigate,
    playCategory: playNavigate,
    playDecide: playNavigate,
    // Confirm / enter sound
    playSelect,
    // Back sounds
    playBack,
    playCancel: playBack,
    // Boot
    playBoot,
  };
}
