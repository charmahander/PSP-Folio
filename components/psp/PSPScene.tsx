'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useXMBNavigation } from '@/hooks/useXMBNavigation';
import { useSwipe } from '@/hooks/useSwipe';
import XMBInterface from '../xmb/XMBInterface';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useAudio } from '@/hooks/useAudio';

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
  const { isBooting, navigateLeft, navigateRight, navigateUp, navigateDown, selectItem, goBack } = usePortfolioStore();
  const { playNavigate, playSelect, playBack } = useAudio();
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
          width: '90vw',
          maxHeight: '90vh',
        }}
      >
        <Image
          src="/psp-mockup.svg"
          alt="PSP 1000 Mockup"
          width={2052}
          height={910}
          className="relative z-0 w-full h-auto"
          style={{
            maxHeight: '90vh',
            objectFit: 'contain',
          }}
          priority
          unoptimized
        />
        
        {/* Interactive PSP Buttons Overlay - positioned to match actual button locations */}
        {/* SVG is 1026x455, D-pad center: x=117 y=196 r=80.5, Action buttons center: x=918 y=195 r=68.5 */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          {/* D-pad buttons (left side) - center at 11.4%, 43% */}
          {/* D-pad Up */}
          <button
            onClick={() => {
              playNavigate();
              navigateUp();
            }}
            className="absolute w-[4%] h-[10%] bg-transparent hover:bg-white/5 active:bg-white/10 rounded transition-colors pointer-events-auto"
            style={{ left: '11.4%', top: '28%', transform: 'translate(-50%, -50%)' }}
            aria-label="Navigate Up"
          />
          
          {/* D-pad Down */}
          <button
            onClick={() => {
              playNavigate();
              navigateDown();
            }}
            className="absolute w-[4%] h-[10%] bg-transparent hover:bg-white/5 active:bg-white/10 rounded transition-colors pointer-events-auto"
            style={{ left: '11.4%', top: '58%', transform: 'translate(-50%, -50%)' }}
            aria-label="Navigate Down"
          />
          
          {/* D-pad Left */}
          <button
            onClick={() => {
              playNavigate();
              navigateLeft();
            }}
            className="absolute w-[4%] h-[10%] bg-transparent hover:bg-white/5 active:bg-white/10 rounded transition-colors pointer-events-auto"
            style={{ left: '4%', top: '43%', transform: 'translate(-50%, -50%)' }}
            aria-label="Navigate Left"
          />
          
          {/* D-pad Right */}
          <button
            onClick={() => {
              playNavigate();
              navigateRight();
            }}
            className="absolute w-[4%] h-[10%] bg-transparent hover:bg-white/5 active:bg-white/10 rounded transition-colors pointer-events-auto"
            style={{ left: '19%', top: '43%', transform: 'translate(-50%, -50%)' }}
            aria-label="Navigate Right"
          />
          
          {/* X button (bottom of diamond) - center at 89.5%, 43% */}
          <button
            onClick={() => {
              playSelect();
              selectItem();
            }}
            className="absolute w-[3.5%] h-[8%] bg-transparent hover:bg-white/5 active:bg-white/10 rounded-full transition-colors pointer-events-auto"
            style={{ left: '89.5%', top: '58%', transform: 'translate(-50%, -50%)' }}
            aria-label="Select (X)"
          />
          
          {/* Circle/O button (right of diamond) */}
          <button
            onClick={() => {
              playBack();
              goBack();
            }}
            className="absolute w-[3.5%] h-[8%] bg-transparent hover:bg-white/5 active:bg-white/10 rounded-full transition-colors pointer-events-auto"
            style={{ left: '96%', top: '43%', transform: 'translate(-50%, -50%)' }}
            aria-label="Back (Circle)"
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
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              borderRadius: '2px',
              overflow: 'hidden',
              boxShadow: `
                inset 0 2px 6px rgba(255, 255, 255, 0.15),
                inset 0 -2px 6px rgba(0, 0, 0, 0.5)
              `,
              border: '1px solid rgba(0, 0, 0, 0.3)',
              // Dynamic font size - scales continuously with viewport width
              fontSize: '1.4vw',
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
