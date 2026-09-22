'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useAudio } from '@/hooks/useAudio';

export default function CaseStudyModal() {
  const { expandedContent, setExpandedContent } = usePortfolioStore();
  const { playBack } = useAudio();

  const handleClose = () => {
    playBack();
    setExpandedContent(null);
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

  if (!expandedContent) return null;

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
          {/* Header with background image */}
          <div 
            className="relative h-48 md:h-64 bg-gradient-to-b from-psp-blue/30 to-transparent"
            style={{
              backgroundImage: expandedContent.backgroundImage 
                ? `url(${expandedContent.backgroundImage})` 
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title section */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex items-start gap-4">
                {/* UMD icon */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg viewBox="0 0 24 24" fill="white" className="w-10 h-10 opacity-80">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl md:text-3xl font-bold text-white font-rodin mb-2">
                    {expandedContent.title}
                  </h2>
                  <p className="text-white/70 text-sm md:text-base">
                    {expandedContent.tagline}
                  </p>
                  
                  {/* Category tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {expandedContent.categories.map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-xs"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(85vh-16rem)] xmb-scrollable">
            {/* Meta info */}
            <div className="grid grid-cols-3 gap-4 mb-8 pb-6 border-b border-white/10">
              <div>
                <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Role</div>
                <div className="text-white font-medium">{expandedContent.content.role}</div>
              </div>
              <div>
                <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Duration</div>
                <div className="text-white font-medium">{expandedContent.content.duration}</div>
              </div>
              <div>
                <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Tools</div>
                <div className="text-white font-medium text-sm">
                  {expandedContent.content.tools.join(', ')}
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-3 font-rodin">Overview</h3>
              <p className="text-white/70 leading-relaxed">
                {expandedContent.content.overview}
              </p>
            </div>

            {/* Sections */}
            {expandedContent.content.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-3 font-rodin">
                  {section.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {section.content}
                </p>
                
                {/* Section images */}
                {section.images && section.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {section.images.map((image, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="aspect-video bg-gray-800 rounded-lg overflow-hidden"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt={`${section.title} - Image ${imgIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Placeholder for more content */}
            <div className="text-center py-8 border-t border-white/10 mt-8">
              <p className="text-white/40 text-sm">
                More content coming soon...
              </p>
            </div>
          </div>

          {/* Bottom navigation hint */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 to-transparent">
            <div className="flex justify-center items-center gap-4 text-white/40 text-xs">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">ESC</kbd>
                Close
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">↑↓</kbd>
                Scroll
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}












