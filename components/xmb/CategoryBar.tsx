'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useAudio } from '@/hooks/useAudio';

// Map category icon keys to PNG files
const categoryIconPaths: { [key: string]: string } = {
  gamepad: '/icons/video game.png',
  user: '/icons/about.png',
  document: '/icons/work.png',
};

export default function CategoryBar() {
  const { categories, currentCategory, setCategory, isInSubfolder } = usePortfolioStore();
  const { playCategory } = useAudio();

  const handleCategoryClick = (index: number) => {
    if (index !== currentCategory && !isInSubfolder) {
      playCategory();
      setCategory(index);
    }
  };

  return (
    <div className="relative h-full flex flex-col items-start justify-center" style={{ paddingLeft: '2.25em' }}>
      <div className="flex flex-col items-start" style={{ gap: '1.5em' }}>
        <AnimatePresence mode="popLayout">
          {categories.map((category, index) => {
            const isSelected = index === currentCategory;
            const distance = Math.abs(index - currentCategory);
            
            // Show all categories but fade distant ones
            return (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isSelected ? 1 : distance === 1 ? 0.5 : 0.3,
                  scale: isSelected ? 1 : 0.85,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
                className={`flex flex-row items-center cursor-pointer ${
                  isInSubfolder ? 'pointer-events-none' : ''
                }`}
                style={{ gap: '0.75em' }}
                onClick={() => handleCategoryClick(index)}
              >
                {/* Category icon */}
                <motion.div
                  className="relative"
                  style={{ width: isSelected ? '3em' : '2.25em', height: isSelected ? '3em' : '2.25em' }}
                  animate={{
                    filter: isSelected ? 'drop-shadow(0 0 12px rgba(255,255,255,0.6))' : 'none',
                  }}
                >
                  <Image
                    src={categoryIconPaths[category.icon] || '/icons/home.png'}
                    alt={category.name}
                    fill
                    className="object-contain"
                  />
                </motion.div>
                
                {/* Category name - show for selected, fade for others */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isSelected ? 1 : 0 }}
                  className="text-white font-medium tracking-wide whitespace-nowrap"
                  style={{ fontSize: '0.75em' }}
                >
                  {category.name}
                </motion.span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
