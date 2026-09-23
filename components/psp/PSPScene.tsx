'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useXMBNavigation } from '@/hooks/useXMBNavigation';
import { useSwipe } from '@/hooks/useSwipe';
import XMBInterface from '../xmb/XMBInterface';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useAudio } from '@/hooks/useAudio';
import { useTheme } from '@/hooks/useTheme';

// The mockup's SVG viewBox. Hit areas are expressed in these coordinates and
// converted to percentages, so they track the artwork at any size.
const MOCKUP_W = 1026;
const MOCKUP_H = 455;
const MOCKUP_ASPECT = MOCKUP_W / MOCKUP_H;

/** Device width, clamped by height so the artwork is never letterboxed inside its box. */
const DEVICE_WIDTH = `min(90vw, ${(90 * MOCKUP_ASPECT).toFixed(3)}vh)`;

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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export default function PSPScene() {
  useXMBNavigation();
  const isMobile = useIsMobile();
  const { isBooting, hasStarted, start, navigateLeft, navigateRight, navigateUp, navigateDown, selectItem, goBack } = usePortfolioStore();
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
    <div className="w-full h-full relative flex items-center justify-center">
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
            style={{
              // Positioned to match the white rectangle in the mockup
              top: '45.5%',
              left: '50%',
              transform: 'translate(-50%, calc(-50% + 5px)) scale(0.95)',
              transformOrigin: 'center center',
              // Scale to fill white rectangle
              width: '62%',
              height: 'calc(79% + 2px)',
              aspectRatio: '594 / 340',
              background: theme.background,
              borderRadius: '2px',
              overflow: 'hidden',
              boxShadow: `
                inset 0 2px 6px rgba(255, 255, 255, 0.15),
                inset 0 -2px 6px rgba(0, 0, 0, 0.5)
              `,
              border: '1px solid rgba(0, 0, 0, 0.3)',
              // The XMB is laid out in `em` and is 31em wide; the screen is 62%
              // of the device, so 0.62/31 = 0.02 keeps it locked to the device.
              fontSize: `calc(${DEVICE_WIDTH} * 0.02)`,
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

      {/* Mobile touch controls - optional, swipe also works now */}
      {isMobile && <MobileTouchControls />}
    </div>
  );
}

function MobileTouchControls() {
  const { 
    navigateLeft, 
    navigateRight, 
    navigateUp, 
    navigateDown, 
    selectItem, 
    goBack 
  } = useXMBNavigation();

  return (
    <div className="absolute bottom-20 left-0 right-0 flex justify-center items-center gap-4 z-30">
      <div className="relative w-24 h-24">
        <button onClick={navigateUp} className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <button onClick={navigateDown} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <button onClick={navigateLeft} className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <button onClick={navigateRight} className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="flex gap-3">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center">
          <span className="text-white/70 text-lg">○</span>
        </button>
        <button onClick={selectItem} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center">
          <span className="text-white/70 text-lg">✕</span>
        </button>
      </div>
    </div>
  );
}
