export type CategoryId =
  | 'image'
  | 'pdf'
  | 'text'
  | 'developer'
  | 'seo'
  | 'color'
  | 'css'
  | 'html'
  | 'javascript'
  | 'json'
  | 'base64'
  | 'qr-code'
  | 'password'
  | 'random'
  | 'unit-converter'
  | 'calculator'
  | 'date-time'
  | 'finance'
  | 'education'
  | 'utility'
  | 'security';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  badgeColor: string;
  count: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  metaDescription?: string;
  category: CategoryId;
  iconName: string;
  tags: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  isTrending?: boolean;
  rating: number; // e.g. 4.9
  usesCount: number;
  
  // Detailed SEO content
  introduction?: string;
  howToUse?: string[];
  benefits?: string[];
  features?: string[];
  faqs?: FAQItem[];

  seoContent?: {
    h1?: string;
    introduction?: string;
    howTo?: string[];
    benefits?: string[];
    features?: string[];
    faqs?: { q: string; a: string }[];
  };
  
  // Custom tool runner type identifier
  runnerType: string;
}

export interface HistoryEntry {
  id: string;
  toolId: string;
  toolSlug: string;
  toolTitle: string;
  timestamp: number;
  summary?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string; // Markdown or HTML content
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  tags: string[];
  relatedToolSlugs: string[];
}
