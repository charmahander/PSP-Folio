'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { usePortfolioStore } from '@/stores/portfolioStore';
import type { AboutItem } from '@/types/xmb';
import { useAudio } from '@/hooks/useAudio';

export default function AboutModal() {
  const { expandedAbout, setExpandedAbout } = usePortfolioStore();
  const { playBack } = useAudio();

  const handleClose = () => {
    playBack();
    setExpandedAbout(null);
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!expandedAbout) return null;

  // Profile view (Who I Am)
  if (expandedAbout.type === 'profile') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[85vh] bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="p-8 md:p-12 overflow-y-auto max-h-[85vh] xmb-scrollable">
              {/* Photo */}
              {expandedAbout.photo && (
                <div className="mb-8 flex justify-center">
                  <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                    <Image
                      src={expandedAbout.photo}
                      alt={expandedAbout.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold text-white font-rodin mb-4 text-center">
                {expandedAbout.title}
              </h2>

              {/* Bio */}
              {expandedAbout.bio && (
                <div className="mt-8">
                  <p className="text-white/80 leading-relaxed text-lg">
                    {expandedAbout.bio}
                  </p>
                </div>
              )}

              {/* Description */}
              {expandedAbout.description && (
                <div className="mt-6">
                  <p className="text-white/60 text-base italic">
                    {expandedAbout.description}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom navigation hint */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 to-transparent">
              <div className="flex justify-center items-center gap-4 text-white/40 text-xs">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">ESC</kbd>
                  Close
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Item with GIF (5-9 After 9-5)
  if (expandedAbout.type === 'item' && expandedAbout.gifUrl) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[85vh] bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="p-8 md:p-12 overflow-y-auto max-h-[85vh] xmb-scrollable">
              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold text-white font-rodin mb-4 text-center">
                {expandedAbout.title}
              </h2>

              {/* GIF */}
              {expandedAbout.gifUrl && (
                <div className="mt-8 mb-6 flex justify-center">
                  <div className="relative w-full max-w-2xl aspect-video rounded-lg overflow-hidden border-2 border-white/20 shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={expandedAbout.gifUrl}
                      alt={expandedAbout.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              {expandedAbout.description && (
                <div className="mt-6 text-center">
                  <p className="text-white/80 leading-relaxed text-lg">
                    {expandedAbout.description}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom navigation hint */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 to-transparent">
              <div className="flex justify-center items-center gap-4 text-white/40 text-xs">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">ESC</kbd>
                  Close
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Manifesto item (text only)
  if (expandedAbout.type === 'item') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[85vh] bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="p-8 md:p-12 overflow-y-auto max-h-[85vh] xmb-scrollable">
              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold text-white font-rodin mb-6 text-center">
                {expandedAbout.title}
              </h2>

              {/* Description */}
              {expandedAbout.description && (
                <div className="mt-6">
                  <p className="text-white/80 leading-relaxed text-xl text-center">
                    {expandedAbout.description}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom navigation hint */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 to-transparent">
              <div className="flex justify-center items-center gap-4 text-white/40 text-xs">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">ESC</kbd>
                  Close
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}
