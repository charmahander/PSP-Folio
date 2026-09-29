export type XMBNodeType =
  | 'caseStudy'
  | 'profile'
  | 'folder'
  | 'resume'
  | 'link'
  | 'setting'
  | 'action'
  | 'item';

export interface CaseStudySection {
  title: string;
  content: string;
  images?: string[];
}

export interface CaseStudyContent {
  overview: string;
  role: string;
  duration: string;
  /** Shown in the detail panel's Skills / Timeline rows. */
  skills?: string;
  timeline?: string;
  tools: string[];
  sections: CaseStudySection[];
}

export interface CaseStudy {
  id: string;
  title: string;
  tagline: string;
  categories: string[];
  thumbnail: string;
  /** Full-screen art shown behind the menu, and first image in the drawer. */
  backgroundImage?: string;
  /** Further images shown in the drawer, in order, after the first. */
  gallery?: string[];
  content: CaseStudyContent;
}

export interface AboutItem {
  id: string;
  title: string;
  type: 'profile' | 'folder' | 'item';
  subtitle?: string;
  thumbnail?: string;
  description?: string;
  children?: AboutItem[];
  gifUrl?: string;
  bio?: string;
  photo?: string;
  /** Body of the in-screen detail panel. */
  detail?: AboutDetail;
}

/**
 * Prose for narrative entries, a list for ones that are a set of separate
 * points - the panel lays each out to suit.
 */
export type AboutDetail =
  | { kind: 'paragraphs'; body: string[] }
  | { kind: 'list'; items: { title: string; body: string }[] };

export interface ViewedPhoto {
  src: string;
  title: string;
}

export interface XMBChildItem {
  id: string;
  title: string;
  type: XMBNodeType;
  subtitle?: string;
  description?: string;
  url?: string;
  icon?: string;
  thumbnail?: string;
}

// `type` and `children` are omitted from the inherited AboutItem shape because
// this interface widens both, and an interface cannot widen what it extends.
export interface XMBItem
  extends Partial<CaseStudy>,
    Partial<Omit<AboutItem, 'type' | 'children'>> {
  id: string;
  title: string;
  type: XMBNodeType;
  subtitle?: string;
  description?: string;
  url?: string;
  iconOverride?: string;
  children?: XMBChildItem[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  items: XMBItem[];
}










