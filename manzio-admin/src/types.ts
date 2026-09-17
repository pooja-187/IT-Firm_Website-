export interface Category {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'inactive';
  createdAt: string;
}

export interface Work {
  id: number;
  title: string;
  category: string;
  client: string;
  imageUrl?: string;
  status: 'active' | 'draft' | 'inactive';
  createdAt: string;
  is_featured: boolean;
  featured_description?: string;
  short_description?: string;
  featured_metric_1?: string;
  featured_metric_2?: string;
  featured_metric_3?: string;
  featured_cta_text?: string;
  featured_theme_color?: string;
  featured_priority?: number;
}

export interface Blog {
  id: number;
  title: string;
  date: string;
  metaDescription: string;
  description: string;
  images: string[];
}

export interface Partner {
  id: number;
  name: string;
  type: string;
  contact: string;
  logoUrl?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export type SectionType = 'dashboard' | 'categories' | 'works' | 'blogs' | 'services' | 'faq' | 'statistics' | 'partners' | 'settings';

export interface Service {
  id: number;
  number: string;
  title: string;
  heading: string;
  description: string;
  glowColor: string; // mapped from glow_color in backend API
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface Statistic {
  id: number;
  number: number;
  suffix: string;
  label: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error';
}

