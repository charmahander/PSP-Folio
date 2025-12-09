'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore, type CaseStudy, type AboutItem } from '@/stores/portfolioStore';
import { useAudio } from '@/hooks/useAudio';

// Map item types to PNG icon paths
const itemIconPaths: { [key: string]: string } = {
  umd: '/icons/umd.png',
  folder: '/icons/saved_filled.png',
  profile: '/icons/users.png',
  document: '/icons/work.png',
  item: '/icons/settings.png',
  music: '/icons/music.png',
  video: '/icons/video.png',
  camera: '/icons/camera.png',
};

// Specific icon overrides for certain items
const itemIconOverrides: { [key: string]: string } = {
  'profile': '/icons/users.png',           // Who I Am
  'manifesto': '/icons/web.png',           // Design Manifesto  
  'after-hours': '/icons/home.png',        // 5-9 After 9-5
};

function getItemIconPath(item: CaseStudy | AboutItem | { id: string; title: string; type: string }): string {
  // Check for specific item ID overrides first
  if (item.id && itemIconOverrides[item.id]) {
    return itemIconOverrides[item.id];
  }
  
  if ('content' in item) return itemIconPaths.umd;
  if ('type' in item) {
    switch (item.type) {
      case 'folder': return itemIconPaths.folder;
      case 'profile': return itemIconPaths.profile;
      case 'resume': return itemIconPaths.document;
      default: return itemIconPaths.item;
    }
  }
  return itemIconPaths.item;
}

function getItemSubtext(item: CaseStudy | AboutItem | { id: string; title: string; type: string }) {
  if ('tagline' in item) return item.tagline;
  if ('description' in item && item.description) return item.description;
  if ('type' in item && item.type === 'folder') return 'Open folder';
  if ('type' in item && item.type === 'resume') return 'View & Download';
  return '';
}

export default function ItemList() {
  const { 
    categories, 
    currentCategory, 
    currentItem, 
    setItem, 
    selectItem,
    isInSubfolder,
    subfolderItems,
    goBack,
  } = usePortfolioStore();
  const { playNavigate, playSelect, playBack } = useAudio();

  const items = isInSubfolder ? subfolderItems : categories[currentCategory]?.items;
  
  if (!items || items.length === 0) return null;

  const handleItemClick = (index: number) => {
    const clickedItem = items?.[index];
    
    // If clicking on a folder, always open it (even if not selected)
    if (clickedItem && 'type' in clickedItem && clickedItem.type === 'folder' && 'children' in clickedItem) {
      playSelect();
      selectItem(); // This will open the folder
      return;
    }
    
    // If clicking the selected item, select/open it
    if (index === currentItem) {
      playSelect();
      selectItem();
    } else {
      // Otherwise navigate to that item
      playNavigate();
      setItem(index);
    }
  };

  const handleBackClick = () => {
    playBack();
    goBack();
  };

  return (
    <div className="relative flex-1 flex flex-col items-start overflow-hidden" style={{ paddingLeft: '1.5em' }}>
      {/* Back button when in subfolder */}
      {isInSubfolder && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleBackClick}
          className="absolute left-0 text-white/60 hover:text-white flex items-center z-10"
          style={{ top: '0.5em', gap: '0.25em', fontSize: '0.75em' }}
        >
          <svg style={{ width: '1em', height: '1em' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back
        </motion.button>
      )}
      
      {/* Items list - PSP style: vertical list on right */}
      <div className="w-full flex flex-col items-start justify-center h-full relative" style={{ paddingTop: '1.5em', paddingBottom: '1.5em' }}>
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => {
            const isSelected = index === currentItem;
            const distance = Math.abs(index - currentItem);
            
            // Show all items but fade distant ones
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: isSelected ? 1 : distance === 1 ? 0.5 : 0.3,
                  scale: isSelected ? 1 : 0.9,
                }}
                exit={{ opacity: 0, x: 20 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 35,
                }}
                onClick={() => handleItemClick(index)}
                className={`
                  relative flex items-center rounded cursor-pointer w-full
                  ${isSelected ? 'bg-white/15' : 'bg-transparent'}
                  transition-colors duration-200
                `}
                style={{ 
                  gap: '1em', 
                  padding: '0.75em 1em',
                  marginBottom: isSelected ? '1em' : '0.5em',
                }}
              >
                {/* Item icon */}
                <div 
                  className={`relative flex-shrink-0 ${isSelected ? 'opacity-100' : 'opacity-60'}`}
                  style={{ width: isSelected ? '2.5em' : '1.75em', height: isSelected ? '2.5em' : '1.75em' }}
                >
                  <Image
                    src={getItemIconPath(item)}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                
                {/* Item content */}
                <div className="flex-1 min-w-0">
                  <div 
                    className={`text-white font-medium truncate ${isSelected ? '' : 'opacity-70'}`}
                    style={{ fontSize: isSelected ? '0.875em' : '0.75em' }}
                  >
                    {item.title}
                  </div>
                  {isSelected && getItemSubtext(item) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      className="text-white truncate"
                      style={{ fontSize: '0.625em', marginTop: '0.25em' }}
                    >
                      {getItemSubtext(item)}
                    </motion.div>
                  )}
                </div>
                
                {/* Selection indicator - PSP style arrow */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, x: -10 }}
                    animate={{ scale: 1, x: 0 }}
                    className="flex-shrink-0"
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: '0.375em solid transparent',
                      borderBottom: '0.375em solid transparent',
                      borderRight: '0.5em solid white',
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
    </div>
  );
}
