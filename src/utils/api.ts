import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/";
const BACKEND_BASE_HOST = "http://127.0.0.1:8000";

// Reusable Axios client
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to make any relative media URL absolute
export function ensureAbsoluteUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  // If relative path starts with /, prepend backend base host
  if (url.startsWith("/")) {
    return `${BACKEND_BASE_HOST}${url}`;
  }
  return `${BACKEND_BASE_HOST}/${url}`;
}

// Interfaces aligned with backend models and frontend rendering needs
export interface Statistic {
  id: number;
  number: number;
  suffix: string;
  label: string;
}

export interface Service {
  id: number;
  number: string;
  title: string;
  heading: string;
  description: string;
  glowColor: string;
}

export interface Partner {
  id: number;
  name: string;
  type: string;
  contact: string;
  logoUrl?: string;
  status: string;
}

export interface Work {
  id: number;
  title: string;
  category: string;
  client: string;
  imageUrl?: string;
  status: string;
  is_featured?: boolean;
  featured_description?: string;
  short_description?: string;
  featured_metric_1?: string;
  featured_metric_2?: string;
  featured_metric_3?: string;
  featured_cta_text?: string;
  featured_theme_color?: string;
  featured_priority?: number;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface Blog {
  id: number;
  title: string;
  date: string;
  metaDescription: string;
  description: string;
  images: string[];
}

export const apiService = {
  // 1. Statistics API
  getStatistics: async (): Promise<Statistic[]> => {
    const response = await api.get("statistics/");
    return response.data;
  },

  // 2. Services API
  getServices: async (): Promise<Service[]> => {
    const response = await api.get("services/");
    return response.data.map((item: any) => ({
      id: item.id,
      number: item.number,
      title: item.title,
      heading: item.heading,
      description: item.description,
      glowColor: item.glow_color || "rgba(139,92,246,0.07)",
    }));
  },

  // 3. Partners / Clients API
  getPartners: async (): Promise<Partner[]> => {
    const response = await api.get("clients/");
    return response.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      type: item.type || "Corporate",
      contact: item.contact || "",
      logoUrl: ensureAbsoluteUrl(item.logoUrl),
      status: item.status,
    }));
  },

  // 4. Works / Projects API
  getWorks: async (): Promise<Work[]> => {
    const response = await api.get("projects/");
    return response.data.map((item: any) => ({
      id: item.id,
      title: item.title,
      category: item.category_name || item.category || "UI/UX Designing",
      client: item.client || "",
      imageUrl: ensureAbsoluteUrl(item.imageUrl),
      status: item.status,
      is_featured: item.is_featured,
      featured_description: item.featured_description,
      short_description: item.short_description,
      featured_metric_1: item.featured_metric_1,
      featured_metric_2: item.featured_metric_2,
      featured_metric_3: item.featured_metric_3,
      featured_cta_text: item.featured_cta_text,
      featured_theme_color: item.featured_theme_color,
      featured_priority: item.featured_priority,
    }));
  },

  // 5. FAQ API
  getFAQs: async (): Promise<FAQItem[]> => {
    const response = await api.get("faq/");
    return response.data;
  },

  // 6. Blogs API
  getBlogs: async (): Promise<Blog[]> => {
    const response = await api.get("blogs/");
    return response.data.map((item: any) => ({
      id: item.id,
      title: item.title,
      date: item.date,
      metaDescription: item.meta_description || "",
      description: item.description || "",
      images: (item.images || []).map((imgUrl: string) => ensureAbsoluteUrl(imgUrl) as string),
    }));
  },
};
