'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useXMBNavigation } from '@/hooks/useXMBNavigation';
import { useSwipe } from '@/hooks/useSwipe';
import XMBInterface from '../xmb/XMBInterface';
import IntroText from './IntroText';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useAudio } from '@/hooks/useAudio';
import { useTheme } from '@/hooks/useTheme';

// The mockup's SVG viewBox. Hit areas are expressed in these coordinates and
// converted to percentages, so they track the artwork at any size.
const MOCKUP_W = 1026;
const MOCKUP_H = 455;
const MOCKUP_ASPECT = MOCKUP_W / MOCKUP_H;

/** The screen cut-out's own rect inside psp-mockup.svg. */
const SCREEN_RECT = { x: 216, y: 41, w: 594, h: 340 };

/** The analog nub's own rect inside psp-mockup.svg. */
const NUB_RECT = { x: 86, y: 295.5, w: 75, h: 74 };

/**
 * The nub's waffle, drawn here rather than in the SVG so its cell stays a fixed
 * number of real pixels. Inside the artwork the cell scales with the mockup,
 * and on a phone the whole thing renders at about a third size, which puts the
 * cell near 1px and its strokes under a device pixel - the texture washes out
 * to a smudge. Pinning the cell to 4px keeps the bumps legible at any size; the
 * count across the disc changes instead, which reads as a waffle regardless.
 */
const NUB_WAFFLE = [
  'repeating-linear-gradient(45deg, rgba(255,255,255,0.16) 0 1px, rgba(0,0,0,0.46) 1px 2px, rgba(0,0,0,0) 2px 4px)',
  'repeating-linear-gradient(-45deg, rgba(255,255,255,0.11) 0 1px, rgba(0,0,0,0.4) 1px 2px, rgba(0,0,0,0) 2px 4px)',
].join(', ');

const pct = (value: number, total: number) => `${((value / total) * 100).toFixed(4)}%`;

/**
 * Room kept below the device for the gap, the intro copy, and the navigation
 * hints pinned to the bottom of the page. Too small and the copy runs into
 * those hints on short windows.
 */
const CONTENT_RESERVE_PX = 380;

/** Device width, clamped by height so the artwork is never letterboxed inside its box. */
const DEVICE_WIDTH = `min(90vw, calc((90vh - ${CONTENT_RESERVE_PX}px) * ${MOCKUP_ASPECT.toFixed(5)}))`;

/** Centres a hit area on a point in SVG coordinates, sized to the real control. */
function hitArea(cx: number, cy: number, w: number, h: number): React.CSSProperties {
  return {
    left: `${((cx / MOCKUP_W) * 100).toFixed(3)}%`,
    top: `${((cy / MOCKUP_H) * 100).toFixed(3)}%`,
    width: `${((w / MOCKUP_W) * 100).toFixed(3)}%`,
    height: `${((h / MOCKUP_H) * 100).toFixed(3)}%`,
    transform: 'translate(-50%, -50%)',
    WebkitTapHighlightColor: 'transparent',
  };
}

export default function PSPScene() {
  useXMBNavigation();
  const { isBooting, hasStarted, start, adjustVolume, navigateLeft, navigateRight, navigateUp, navigateDown, selectItem, goBack } = usePortfolioStore();
  const { playNavigate, playSelect, playBack, playBoot } = useAudio();
  const theme = useTheme();
  const pspRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  // Swipe handlers for the screen (use mouse click sounds for touch interactions)
  const handleSwipeLeft = useCallback(() => {
    playNavigate();
    navigateRight(); // Swipe left = go right in menu
  }, [navigateRight, playNavigate]);

  const handleSwipeRight = useCallback(() => {
    playNavigate();
    navigateLeft(); // Swipe right = go left in menu
  }, [navigateLeft, playNavigate]);

  const handleSwipeUp = useCallback(() => {
    playNavigate();
    navigateDown(); // Swipe up = go down in menu
  }, [navigateDown, playNavigate]);

  const handleSwipeDown = useCallback(() => {
    playNavigate();
    navigateUp(); // Swipe down = go up in menu
  }, [navigateUp, playNavigate]);

  const swipeHandlers = useSwipe({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    onSwipeUp: handleSwipeUp,
    onSwipeDown: handleSwipeDown,
  }, 30);

  // Double-click/tap to select
  const lastClickTime = useRef(0);
  const handleScreenClick = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTime.current < 300) {
      // Double click - select item
      playSelect();
      selectItem();
    }
    lastClickTime.current = now;
  }, [selectItem, playSelect]);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      {/* PSP Mockup and Screen UI - 90% of screen */}
      <motion.div 
        ref={pspRef}
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          width: DEVICE_WIDTH,
          aspectRatio: `${MOCKUP_W} / ${MOCKUP_H}`,
        }}
      >
        <Image
          src="/psp-mockup.svg"
          alt="PSP 1000 Mockup"
          width={MOCKUP_W}
          height={MOCKUP_H}
          className="relative z-0 w-full h-full"
          style={{ display: 'block' }}
          priority
          unoptimized
        />

        <div
          aria-hidden
          className="absolute z-10 pointer-events-none"
          style={{
            left: pct(NUB_RECT.x, MOCKUP_W),
            top: pct(NUB_RECT.y, MOCKUP_H),
            width: pct(NUB_RECT.w, MOCKUP_W),
            height: pct(NUB_RECT.h, MOCKUP_H),
            borderRadius: '50%',
            backgroundImage: NUB_WAFFLE,
            backgroundSize: '4px 4px',
          }}
        />
        
        {/* Interactive button overlay. Geometry taken from psp-mockup.svg: the
            D-pad cross bars are 54 units wide, the action buttons are r=27.5. */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <button
            onClick={() => {
              playNavigate();
              navigateUp();
            }}
            className="absolute bg-transparent pointer-events-auto"
            style={hitArea(117, 142.75, 54, 52.5)}
            aria-label="Navigate Up"
          />

          <button
            onClick={() => {
              playNavigate();
              navigateDown();
            }}
            className="absolute bg-transparent pointer-events-auto"
            style={hitArea(117, 249.25, 54, 52.5)}
            aria-label="Navigate Down"
          />

          <button
            onClick={() => {
              playNavigate();
              navigateLeft();
            }}
            className="absolute bg-transparent pointer-events-auto"
            style={hitArea(64.5, 196, 51, 54)}
            aria-label="Navigate Left"
          />

          <button
            onClick={() => {
              playNavigate();
              navigateRight();
            }}
            className="absolute bg-transparent pointer-events-auto"
            style={hitArea(169, 196, 50, 54)}
            aria-label="Navigate Right"
          />

          <button
            onClick={() => {
              playSelect();
              selectItem();
            }}
            className="absolute bg-transparent rounded-full pointer-events-auto"
            style={hitArea(918, 254.5, 55, 55)}
            aria-label="Select (X)"
          />

          <button
            onClick={() => {
              playBack();
              goBack();
            }}
            className="absolute bg-transparent rounded-full pointer-events-auto"
            style={hitArea(977.5, 195.5, 55, 55)}
            aria-label="Back (Circle)"
          />

          {/* VOL - / + drive the master gain, the way the hardware does */}
          <button
            onClick={() => {
              adjustVolume(-0.1);
              playNavigate();
            }}
            className="absolute bg-transparent pointer-events-auto"
            style={{ ...hitArea(302.5, 410, 32, 23), cursor: 'pointer' }}
            aria-label="Volume down"
          />
          <button
            onClick={() => {
              adjustVolume(0.1);
              playNavigate();
            }}
            className="absolute bg-transparent pointer-events-auto"
            style={{ ...hitArea(371.5, 410, 32, 23), cursor: 'pointer' }}
            aria-label="Volume up"
          />

          {/* START: the control the gate prompt points at, so it has to work */}
          <button
            onClick={() => {
              if (hasStarted) return;
              playBoot();
              start();
            }}
            className="absolute bg-transparent pointer-events-auto"
            style={{ ...hitArea(802, 409.5, 59, 28), cursor: hasStarted ? 'default' : 'pointer' }}
            aria-label="Start"
          />
        </div>
        
        {/* XMB Screen Overlay - positioned to fill white rectangle (594x340px) */}
        {(
          <div
            ref={screenRef}
            className="absolute cursor-pointer select-none z-20"
            data-psp-screen=""
            style={{
              // Straight from the cut-out's own coordinates. It used to be a
              // 62% box nudged by a scale and a few fixed pixels, which drifted
              // off the artwork as the device shrank and let the placeholder
              // show through as a white seam on small screens.
              left: pct(SCREEN_RECT.x, MOCKUP_W),
              top: pct(SCREEN_RECT.y, MOCKUP_H),
              width: pct(SCREEN_RECT.w, MOCKUP_W),
              height: pct(SCREEN_RECT.h, MOCKUP_H),
              background: theme.background,
              overflow: 'hidden',
              boxShadow: `
                inset 0 2px 6px rgba(255, 255, 255, 0.15),
                inset 0 -2px 6px rgba(0, 0, 0, 0.5)
              `,
              // The XMB is laid out in `em` and is 31em wide, so dividing the
              // screen's share of the device by 31 keeps it locked to the case.
              fontSize: `calc(${DEVICE_WIDTH} * ${(SCREEN_RECT.w / MOCKUP_W / 31).toFixed(7)})`,
              WebkitTapHighlightColor: 'transparent',
            }}
            onClick={handleScreenClick}
            {...swipeHandlers}
          >
            {/* Screen reflection overlay for realism */}
            <div 
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.3) 100%)',
                mixBlendMode: 'overlay',
              }}
            />
            {/* Subtle scanline effect for CRT-like feel */}
            <div 
              className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
              }}
            />
            <XMBInterface />
          </div>
        )}
      </motion.div>


      <IntroText />
    </div>
  );
}
