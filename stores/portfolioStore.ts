import { create } from 'zustand';
import type { Category, XMBChildItem, XMBItem, CaseStudy, AboutItem } from '@/types/xmb';

interface PortfolioState {
  // Navigation state
  currentCategory: number;
  currentItem: number;
  
  // UI state
  hasStarted: boolean;
  isBooting: boolean;
  themeIndex: number;
  expandedContent: CaseStudy | null;
  expandedAbout: AboutItem | null;
  isInSubfolder: boolean;
  subfolderItems: XMBChildItem[] | null;
  activeFolderIndex: number | null;
  activeFolderTitle: string | null;
  
  // Audio state
  isMuted: boolean;
  
  // Actions
  setCategory: (index: number) => void;
  setItem: (index: number) => void;
  navigateLeft: () => void;
  navigateRight: () => void;
  navigateUp: () => void;
  navigateDown: () => void;
  selectItem: () => void;
  goBack: () => void;
  start: () => void;
  setTheme: (index: number) => void;
  finishBooting: () => void;
  setExpandedContent: (content: CaseStudy | null) => void;
  setExpandedAbout: (content: AboutItem | null) => void;
  toggleMute: () => void;
  enterSubfolder: (items: AboutItem[]) => void;
  exitSubfolder: () => void;
  
  // Data
  categories: Category[];
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  currentCategory: 0,
  currentItem: 0,
  hasStarted: false,
  isBooting: true,
  themeIndex: 0,
  expandedContent: null,
  expandedAbout: null,
  isInSubfolder: false,
  subfolderItems: null,
  activeFolderIndex: null,
  activeFolderTitle: null,
  isMuted: false,
  
  categories: [
    {
      id: 'game',
      name: 'Games',
      icon: 'game',
      items: [
        {
          id: 'project-1',
          title: 'PaidPiper',
          type: 'caseStudy',
          tagline: 'Music business co-pilot for indie artists',
          categories: ['UX Design', 'Mobile'],
          thumbnail: '/images/projects/project-1.png',
          backgroundImage: '/images/bg-1.jpg',
          content: {
            overview: 'A comprehensive case study exploring mobile gaming UX.',
            role: 'Lead UX Designer',
            duration: '3 months',
            tools: ['Figma', 'Protopie', 'Unity'],
            sections: [
              { title: 'The Challenge', content: 'Creating an intuitive gaming experience for casual players.' },
              { title: 'The Solution', content: 'A gesture-based control system that adapts to player skill level.' },
            ],
          },
        } as XMBItem,
        {
          id: 'project-2',
          title: 'BMW Group x SCADpro',
          type: 'caseStudy',
          tagline: 'Intrapreneurial innovation strategy',
          categories: ['Product Design', 'Social'],
          thumbnail: '/images/projects/project-2.png',
          content: {
            overview: 'Building meaningful connections through design.',
            role: 'Product Designer',
            duration: '6 months',
            tools: ['Figma', 'Framer', 'React'],
            sections: [],
          },
        } as XMBItem,
        {
          id: 'project-3',
          title: 'BMW M x SCADpro',
          type: 'caseStudy',
          tagline: 'Innovative M-Driving Experience',
          categories: ['UI Design', 'E-commerce'],
          thumbnail: '/images/projects/project-3.png',
          content: {
            overview: 'Streamlining the online shopping experience.',
            role: 'UI/UX Designer',
            duration: '4 months',
            tools: ['Sketch', 'InVision', 'Zeplin'],
            sections: [],
          },
        } as XMBItem,
        {
          id: 'project-4',
          title: 'Billify',
          type: 'caseStudy',
          tagline: 'Personal finance manager',
          categories: ['UX Research', 'Healthcare'],
          thumbnail: '/images/projects/project-4.png',
          content: {
            overview: 'Making healthcare accessible through technology.',
            role: 'UX Researcher',
            duration: '5 months',
            tools: ['Figma', 'Maze', 'Dovetail'],
            sections: [],
          },
        } as XMBItem,
      ],
    },
    {
      id: 'about',
      name: 'About',
      icon: 'about',
      items: [
        {
          id: 'origin-story',
          title: 'The origin story',
          type: 'item',
          description: 'Foundational background and journey.',
        },
        {
          id: 'design-manifesto',
          title: 'Design Manifesto',
          type: 'folder',
          children: [
            { id: 'manifesto-1', title: '1', type: 'item', description: 'Principle 1' },
            { id: 'manifesto-2', title: '2', type: 'item', description: 'Principle 2' },
            { id: 'manifesto-3', title: '3', type: 'item', description: 'Principle 3' },
            { id: 'manifesto-4', title: '4', type: 'item', description: 'Principle 4' },
            { id: 'manifesto-5', title: '5', type: 'item', description: 'Principle 5' },
            { id: 'manifesto-6', title: '6', type: 'item', description: 'Principle 6' },
          ],
        },
        {
          id: 'skills',
          title: 'Skills',
          type: 'folder',
          children: [
            { id: 'skill-1', title: '1', type: 'item', description: 'Skill area 1' },
            { id: 'skill-2', title: '2', type: 'item', description: 'Skill area 2' },
            { id: 'skill-3', title: '3', type: 'item', description: 'Skill area 3' },
            { id: 'skill-4', title: '4', type: 'item', description: 'Skill area 4' },
            { id: 'skill-5', title: '5', type: 'item', description: 'Skill area 5' },
            { id: 'skill-6', title: '6', type: 'item', description: 'Skill area 6' },
          ],
        },
        {
          id: 'testimonials',
          title: 'Testimonials',
          type: 'folder',
          children: [
            { id: 'testimonial-1', title: '1', type: 'item', description: 'Testimonial 1' },
            { id: 'testimonial-2', title: '2', type: 'item', description: 'Testimonial 2' },
            { id: 'testimonial-3', title: '3', type: 'item', description: 'Testimonial 3' },
            { id: 'testimonial-4', title: '4', type: 'item', description: 'Testimonial 4' },
            { id: 'testimonial-5', title: '5', type: 'item', description: 'Testimonial 5' },
            { id: 'testimonial-6', title: '6', type: 'item', description: 'Testimonial 6' },
          ],
        },
      ],
    },
    {
      id: 'resume',
      name: 'Resume',
      icon: 'resume',
      items: [
        {
          id: 'resume-pdf',
          title: 'Download Resume',
          type: 'resume',
          subtitle: 'Open PDF in new tab',
        },
      ],
    },
    {
      id: 'music',
      name: 'Music',
      icon: 'music',
      items: [
        { id: 'song-1', title: 'Song 1', type: 'item' },
        { id: 'song-2', title: 'Song 2', type: 'item' },
        { id: 'song-3', title: 'Song 3', type: 'item' },
        { id: 'song-4', title: 'Song 4', type: 'item' },
        { id: 'song-5', title: 'Song 5', type: 'item' },
        { id: 'song-6', title: 'Song 6', type: 'item' },
        { id: 'song-7', title: 'Song 7', type: 'item' },
        { id: 'song-8', title: 'Song 8', type: 'item' },
        { id: 'song-9', title: 'Song 9', type: 'item' },
        { id: 'song-10', title: 'Song 10', type: 'item' },
      ],
    },
    {
      id: 'gallery',
      name: 'Gallery',
      icon: 'gallery',
      items: [
        { id: 'gallery-1', title: 'Photo/Video 1', type: 'item' },
        { id: 'gallery-2', title: 'Photo/Video 2', type: 'item' },
        { id: 'gallery-3', title: 'Photo/Video 3', type: 'item' },
        { id: 'gallery-4', title: 'Photo/Video 4', type: 'item' },
        { id: 'gallery-5', title: 'Photo/Video 5', type: 'item' },
        { id: 'gallery-6', title: 'Photo/Video 6', type: 'item' },
        { id: 'gallery-7', title: 'Photo/Video 7', type: 'item' },
        { id: 'gallery-8', title: 'Photo/Video 8', type: 'item' },
        { id: 'gallery-9', title: 'Photo/Video 9', type: 'item' },
        { id: 'gallery-10', title: 'Photo/Video 10', type: 'item' },
      ],
    },
  ] as Category[],
  
  setCategory: (index) => {
    const { categories } = get();
    if (categories.length === 0) return;
    const nextIndex = (index + categories.length) % categories.length;
    set({ currentCategory: nextIndex, currentItem: 0, activeFolderIndex: null, activeFolderTitle: null, isInSubfolder: false, subfolderItems: null });
  },
  
  setItem: (index) => {
    const { categories, currentCategory, isInSubfolder, subfolderItems } = get();
    const items = isInSubfolder ? subfolderItems : categories[currentCategory]?.items;
    if (!items || items.length === 0) return;
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    set({ currentItem: clamped });
  },
  
  navigateLeft: () => {
    const { currentCategory, isInSubfolder, categories } = get();
    if (isInSubfolder) {
      set({ isInSubfolder: false, subfolderItems: null, currentItem: 0, activeFolderIndex: null, activeFolderTitle: null });
      return;
    }
    const prev = (currentCategory - 1 + categories.length) % categories.length;
    set({ currentCategory: prev, currentItem: 0, activeFolderIndex: null, activeFolderTitle: null, subfolderItems: null });
  },
  
  navigateRight: () => {
    const { currentCategory, categories, isInSubfolder, currentItem } = get();
    
    // If in subfolder, don't navigate categories
    if (isInSubfolder) return;
    
    const items = categories[currentCategory]?.items;
    const item = items?.[currentItem];
    
    if (item && item.type === 'folder' && item.children) {
      set({ 
        isInSubfolder: true, 
        subfolderItems: item.children as XMBChildItem[], 
        currentItem: 0,
        activeFolderIndex: currentItem,
        activeFolderTitle: item.title,
      });
      return;
    }
    
    const next = (currentCategory + 1) % categories.length;
    set({ currentCategory: next, currentItem: 0, activeFolderIndex: null, activeFolderTitle: null, subfolderItems: null });
  },
  
  navigateUp: () => {
    const { currentItem, isInSubfolder, subfolderItems, currentCategory, categories } = get();
    const items = isInSubfolder ? subfolderItems : categories[currentCategory]?.items;
    if (!items || items.length === 0) return;
    if (currentItem > 0) {
      set({ currentItem: currentItem - 1 });
    }
  },
  
  navigateDown: () => {
    const { currentItem, currentCategory, categories, isInSubfolder, subfolderItems } = get();
    const items = isInSubfolder ? subfolderItems : categories[currentCategory]?.items;
    if (!items || items.length === 0) return;
    if (currentItem < items.length - 1) {
      set({ currentItem: currentItem + 1 });
    }
  },
  
  selectItem: () => {
    const { currentCategory, currentItem, categories, isInSubfolder, subfolderItems, activeFolderIndex } = get();
    const items = isInSubfolder ? subfolderItems : categories[currentCategory]?.items;
    const item = items?.[currentItem];
    
    if (!item) return;
    
    // Case study content
    if (item.type === 'caseStudy' && 'content' in item && item.content) {
      set({ expandedContent: item as CaseStudy });
      return;
    }
    
    // Folders
    if (item.type === 'folder' && 'children' in item && item.children) {
      const parentIndex = isInSubfolder ? activeFolderIndex : currentItem;
      set({ 
        isInSubfolder: true, 
        subfolderItems: item.children as XMBChildItem[], 
        currentItem: 0,
        activeFolderIndex: parentIndex ?? currentItem,
        activeFolderTitle: item.title,
      });
      return;
    }
    
    // Profile items
    if (item.type === 'profile') {
      set({ expandedAbout: item as AboutItem });
      return;
    }
    
    // Resume download
    if (item.type === 'resume') {
      window.open('/Mahanetran Murali Narayanan_Resume.pdf', '_blank');
      return;
    }

    // Links
    if (item.type === 'link' && item.url) {
      window.open(item.url, '_blank');
      return;
    }

    // Action toggles (e.g., mute)
    if (item.type === 'action') {
      if (item.id === 'toggle-audio') {
        set((state) => ({ isMuted: !state.isMuted }));
      }
      return;
    }
    
    // Generic items
    if (item.type === 'item' || item.type === 'setting') {
      set({ expandedAbout: item as AboutItem });
      return;
    }
  },
  
  goBack: () => {
    const { expandedContent, expandedAbout, isInSubfolder } = get();
    
    if (expandedContent) {
      set({ expandedContent: null });
      return;
    }
    
    if (expandedAbout) {
      set({ expandedAbout: null });
      return;
    }
    
    if (isInSubfolder) {
      set({ isInSubfolder: false, subfolderItems: null, currentItem: 0 });
      return;
    }
  },
  
  start: () => set({ hasStarted: true }),

  setTheme: (index) => set({ themeIndex: index }),

  finishBooting: () => set({ isBooting: false }),
  
  setExpandedContent: (content) => set({ expandedContent: content }),
  
  setExpandedAbout: (content) => set({ expandedAbout: content }),
  
  toggleMute: () => {
    // Use functional update to prevent unnecessary re-renders
    set((state) => ({ isMuted: !state.isMuted }));
  },
  
  enterSubfolder: (items) => set({ isInSubfolder: true, subfolderItems: items, currentItem: 0 }),
  
  exitSubfolder: () => set({ isInSubfolder: false, subfolderItems: null, currentItem: 0 }),
}));
