'use client';

import { useCallback, useEffect } from 'react';
import { Howl } from 'howler';
import { usePortfolioStore } from '@/stores/portfolioStore';

const SOUND_FILES = {
  boot: '/audio/startup.mp3',
  nav: '/audio/navigate.mp3',
  back: '/audio/cancel.mp3',
  ok: '/audio/system-ok.mp3',
} as const;

const VOLUMES = { boot: 0.6, nav: 0.3, back: 0.3, ok: 0.4 } as const;

type SoundKey = keyof typeof SOUND_FILES;

/**
 * One Howl per file, shared by every caller. Previously each useAudio() built
 * its own set and unloaded them on unmount, so whichever component started the
 * boot jingle silenced it again the moment it unmounted.
 */
const howls: Partial<Record<SoundKey, Howl>> = {};

function getSound(key: SoundKey): Howl | undefined {
  if (typeof window === 'undefined') return undefined;
  if (!howls[key]) {
    howls[key] = new Howl({
      src: [SOUND_FILES[key]],
      volume: VOLUMES[key],
      preload: true,
      html5: key === 'boot',
    });
  }
  return howls[key];
}

let bootPlayed = false;

export function useAudio() {
  const { isMuted } = usePortfolioStore();

  useEffect(() => {
    (Object.keys(SOUND_FILES) as SoundKey[]).forEach(getSound);
  }, []);

  const play = useCallback(
    (key: SoundKey) => {
      if (isMuted) return;
      getSound(key)?.play();
    },
    [isMuted]
  );

  const playNavigate = useCallback(() => play('nav'), [play]);
  const playBack = useCallback(() => play('back'), [play]);
  const playSelect = useCallback(() => play('ok'), [play]);

  const playBoot = useCallback(() => {
    if (isMuted || bootPlayed) return;
    bootPlayed = true;
    getSound('boot')?.play();
  }, [isMuted]);

  return {
    playNavigate,
    playCursor: playNavigate,
    playCategory: playNavigate,
    playDecide: playNavigate,
    playSelect,
    playBack,
    playCancel: playBack,
    playBoot,
  };
}
