import { create } from 'zustand';

export interface CaseStudy {
  id: string;
  title: string;
  tagline: string;
  categories: string[];
  thumbnail: string;
  backgroundImage?: string;
  content: {
    overview: string;
    role: string;
    duration: string;
    tools: string[];
    sections: {
      title: string;
      content: string;
      images?: string[];
    }[];
  };
}

export interface AboutItem {
  id: string;
  title: string;
  type: 'profile' | 'folder' | 'item';
  thumbnail?: string;
  description?: string;
  children?: AboutItem[];
  gifUrl?: string;
  bio?: string;
  photo?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  items: (CaseStudy | AboutItem | { id: string; title: string; type: string })[];
}

interface PortfolioState {
  // Navigation state
  currentCategory: number;
  currentItem: number;
  
  // UI state
  isBooting: boolean;
  expandedContent: CaseStudy | null;
  expandedAbout: AboutItem | null;
  isInSubfolder: boolean;
  subfolderItems: AboutItem[] | null;
  
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
  isBooting: true,
  expandedContent: null,
  expandedAbout: null,
  isInSubfolder: false,
  subfolderItems: null,
  isMuted: false,
  
  categories: [
    {
      id: 'case-studies',
      name: 'Case Studies',
      icon: 'gamepad',
      items: [
        {
          id: 'project-1',
          title: 'Project One',
          tagline: 'Designing the future of mobile gaming',
          categories: ['UX Design', 'Mobile'],
          thumbnail: '/images/umd-1.png',
          backgroundImage: '/images/bg-1.jpg',
          content: {
            overview: 'A comprehensive case study exploring mobile gaming UX.',
            role: 'Lead UX Designer',
            duration: '3 months',
            tools: ['Figma', 'Protopie', 'Unity'],
            sections: [
              {
                title: 'The Challenge',
                content: 'Creating an intuitive gaming experience for casual players.',
              },
              {
                title: 'The Solution',
                content: 'A gesture-based control system that adapts to player skill level.',
              },
            ],
          },
        },
        {
          id: 'project-2',
          title: 'Project Two',
          tagline: 'Reimagining social connectivity',
          categories: ['Product Design', 'Social'],
          thumbnail: '/images/umd-2.png',
          content: {
            overview: 'Building meaningful connections through design.',
            role: 'Product Designer',
            duration: '6 months',
            tools: ['Figma', 'Framer', 'React'],
            sections: [],
          },
        },
        {
          id: 'project-3',
          title: 'Project Three',
          tagline: 'E-commerce reimagined',
          categories: ['UI Design', 'E-commerce'],
          thumbnail: '/images/umd-3.png',
          content: {
            overview: 'Streamlining the online shopping experience.',
            role: 'UI/UX Designer',
            duration: '4 months',
            tools: ['Sketch', 'InVision', 'Zeplin'],
            sections: [],
          },
        },
        {
          id: 'project-4',
          title: 'Project Four',
          tagline: 'Healthcare at your fingertips',
          categories: ['UX Research', 'Healthcare'],
          thumbnail: '/images/umd-4.png',
          content: {
            overview: 'Making healthcare accessible through technology.',
            role: 'UX Researcher',
            duration: '5 months',
            tools: ['Figma', 'Maze', 'Dovetail'],
            sections: [],
          },
        },
        {
          id: 'project-5',
          title: 'Project Five',
          tagline: 'The future of work',
          categories: ['Product Design', 'SaaS'],
          thumbnail: '/images/umd-5.png',
          content: {
            overview: 'Designing productivity tools for the modern workplace.',
            role: 'Senior Product Designer',
            duration: '8 months',
            tools: ['Figma', 'Principle', 'Notion'],
            sections: [],
          },
        },
      ],
    },
    {
      id: 'about',
      name: 'About',
      icon: 'user',
      items: [
        {
          id: 'profile',
          title: 'Who I Am',
          type: 'profile',
          thumbnail: '/images/profile.jpg',
          photo: '/images/profile.jpg',
          description: 'Designer, creator, and problem solver.',
          bio: 'Add your bio here. Tell visitors about who you are, your background, and what drives you as a designer.',
        },
        {
          id: 'manifesto',
          title: 'Design Manifesto',
          type: 'folder',
          children: [
            {
              id: 'manifesto-1',
              title: 'Design with Purpose',
              type: 'item',
              description: 'Every pixel should serve a purpose.',
            },
            {
              id: 'manifesto-2',
              title: 'Embrace Constraints',
              type: 'item',
              description: 'Limitations breed creativity.',
            },
            {
              id: 'manifesto-3',
              title: 'Users First',
              type: 'item',
              description: 'Empathy is the foundation of great design.',
            },
          ],
        },
        {
          id: 'after-hours',
          title: '5-9 After My 9-5',
          type: 'folder',
          children: [
            {
              id: 'hobby-1',
              title: 'Photography',
              type: 'item',
              description: 'Capturing moments through the lens.',
              gifUrl: '/images/photography.gif',
            },
            {
              id: 'hobby-2',
              title: 'Gaming',
              type: 'item',
              description: 'Exploring virtual worlds.',
              gifUrl: '/images/gaming.gif',
            },
            {
              id: 'hobby-3',
              title: 'Music',
              type: 'item',
              description: 'Creating beats and melodies.',
              gifUrl: '/images/music.gif',
            },
          ],
        },
      ],
    },
    {
      id: 'resume',
      name: 'Resume',
      icon: 'document',
      items: [
        {
          id: 'resume-pdf',
          title: 'Download Resume',
          type: 'resume',
        },
      ],
    },
  ],
  
  setCategory: (index) => {
    const { categories } = get();
    if (index >= 0 && index < categories.length) {
      set({ currentCategory: index, currentItem: 0 });
    }
  },
  
  setItem: (index) => {
    const { categories, currentCategory, isInSubfolder, subfolderItems } = get();
    const items = isInSubfolder ? subfolderItems : categories[currentCategory]?.items;
    if (items && index >= 0 && index < items.length) {
      set({ currentItem: index });
    }
  },
  
  navigateLeft: () => {
    const { currentCategory, isInSubfolder } = get();
    
    // If in subfolder, go back to main category
    if (isInSubfolder) {
      set({ isInSubfolder: false, subfolderItems: null, currentItem: 0 });
      return;
    }
    
    // Otherwise navigate to previous category
    if (currentCategory > 0) {
      set({ currentCategory: currentCategory - 1, currentItem: 0 });
    }
  },
  
  navigateRight: () => {
    const { currentCategory, categories, isInSubfolder, currentItem } = get();
    
    // If in subfolder, don't navigate categories
    if (isInSubfolder) return;
    
    // Check if current item is a folder - if so, open it
    const items = categories[currentCategory]?.items;
    const item = items?.[currentItem];
    
    if (item && 'type' in item && item.type === 'folder' && 'children' in item) {
      // Open the folder
      set({ 
        isInSubfolder: true, 
        subfolderItems: item.children as AboutItem[], 
        currentItem: 0 
      });
      return;
    }
    
    // Otherwise navigate to next category
    if (currentCategory < categories.length - 1) {
      set({ currentCategory: currentCategory + 1, currentItem: 0 });
    }
  },
  
  navigateUp: () => {
    const { currentItem, isInSubfolder, subfolderItems, currentCategory, categories } = get();
    
    // If in subfolder, navigate within subfolder items
    if (isInSubfolder && subfolderItems) {
      if (currentItem > 0) {
        set({ currentItem: currentItem - 1 });
      }
      return;
    }
    
    // Otherwise navigate in main category items
    if (currentItem > 0) {
      set({ currentItem: currentItem - 1 });
    }
  },
  
  navigateDown: () => {
    const { currentItem, currentCategory, categories, isInSubfolder, subfolderItems } = get();
    const items = isInSubfolder ? subfolderItems : categories[currentCategory]?.items;
    
    if (items && currentItem < items.length - 1) {
      set({ currentItem: currentItem + 1 });
    }
  },
  
  selectItem: () => {
    const { currentCategory, currentItem, categories, isInSubfolder, subfolderItems } = get();
    const items = isInSubfolder ? subfolderItems : categories[currentCategory]?.items;
    const item = items?.[currentItem];
    
    if (!item) return;
    
    // Handle case studies
    if ('content' in item && item.content) {
      set({ expandedContent: item as CaseStudy });
      return;
    }
    
    // Handle folders
    if ('type' in item && item.type === 'folder' && 'children' in item) {
      set({ 
        isInSubfolder: true, 
        subfolderItems: item.children as AboutItem[], 
        currentItem: 0 
      });
      return;
    }
    
    // Handle profile items
    if ('type' in item && item.type === 'profile') {
      set({ expandedAbout: item as AboutItem });
      return;
    }
    
    // Handle resume download
    if ('type' in item && item.type === 'resume') {
      window.open('/Mahanetran Murali Narayanan_Resume.pdf', '_blank');
      return;
    }
    
    // Handle items (manifesto items, 5-9 After 9-5 items, etc.)
    if ('type' in item && item.type === 'item') {
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
