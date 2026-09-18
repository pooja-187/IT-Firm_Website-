import axios from 'axios';
import type { Category, Work, Blog, Service, FAQ, Statistic, Partner } from '../types';

const getDefaultApiUrl = () => {
  return '/api/';
};

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || getDefaultApiUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to attach standard DRF Token Authentication
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('manzio_react_token');
    if (token && config.headers) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry / authorization failure
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Invalidate session on unauthorized
      sessionStorage.clear();
      window.location.hash = '';
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Helper to convert DRF blog item to react blog item
const mapBlogFromApi = (data: any): Blog => ({
  id: data.id,
  title: data.title,
  date: data.date,
  metaDescription: data.meta_description || '',
  description: data.description || '',
  images: data.images || [],
});

// Helper to convert DRF project/work item to react work item
const mapWorkFromApi = (item: any): Work => ({
  id: item.id,
  title: item.title,
  category: item.category_name || item.category || 'UI/UX Designing',
  client: item.client || '',
  imageUrl: item.imageUrl || item.thumbnail_image || item.image || undefined,
  status: item.status,
  createdAt: item.createdAt || '',
  is_featured: item.is_featured === true || item.is_featured === 'true',
  featured_description: item.featured_description || '',
  short_description: item.short_description || '',
  featured_metric_1: item.featured_metric_1 || '',
  featured_metric_2: item.featured_metric_2 || '',
  featured_metric_3: item.featured_metric_3 || '',
  featured_cta_text: item.featured_cta_text || '',
  featured_theme_color: item.featured_theme_color || '',
  featured_priority: item.featured_priority || 0,
});

// Helper to convert DRF service item to react service item
const mapServiceFromApi = (data: any): Service => ({
  id: data.id,
  number: data.number,
  title: data.title,
  heading: data.heading,
  description: data.description,
  glowColor: data.glow_color || 'rgba(139,92,246,0.07)',
});

// API Operations
export const apiService = {
  // Authentication API endpoints
  auth: {
    login: async (credentials: any) => {
      const response = await api.post('auth/token/', credentials);
      return response.data; // token, user_id, username, email, is_staff
    },
    logout: async () => {
      return await api.post('auth/logout/');
    },
  },

  // Categories API endpoints
  categories: {
    list: async (): Promise<Category[]> => {
      const response = await api.get('categories/');
      return response.data;
    },
    create: async (data: Omit<Category, 'id' | 'createdAt'>): Promise<Category> => {
      const response = await api.post('categories/', data);
      return response.data;
    },
    update: async (id: number, data: Partial<Category>): Promise<Category> => {
      const response = await api.put(`categories/${id}/`, data);
      return response.data;
    },
    delete: async (id: number): Promise<void> => {
      await api.delete(`categories/${id}/`);
    },
  },

  // Works / Projects API endpoints (supporting multipart file upload)
  works: {
    list: async (): Promise<Work[]> => {
      const response = await api.get('projects/');
      return response.data.map(mapWorkFromApi);
    },
    create: async (formData: FormData): Promise<Work> => {
      const response = await api.post('projects/', formData);
      return mapWorkFromApi(response.data);
    },
    update: async (id: number, formData: FormData): Promise<Work> => {
      const response = await api.put(`projects/${id}/`, formData);
      return mapWorkFromApi(response.data);
    },
    delete: async (id: number): Promise<void> => {
      await api.delete(`projects/${id}/`);
    },
  },

  // Blogs API endpoints
  blogs: {
    list: async (): Promise<Blog[]> => {
      const response = await api.get('blogs/');
      return response.data.map(mapBlogFromApi);
    },
    create: async (formData: FormData): Promise<Blog> => {
      const response = await api.post('blogs/', formData);
      return mapBlogFromApi(response.data);
    },
    update: async (id: number, formData: FormData): Promise<Blog> => {
      const response = await api.put(`blogs/${id}/`, formData);
      return mapBlogFromApi(response.data);
    },
    delete: async (id: number): Promise<void> => {
      await api.delete(`blogs/${id}/`);
    },
  },

  // Services API endpoints
  services: {
    list: async (): Promise<Service[]> => {
      const response = await api.get('services/');
      return response.data.map(mapServiceFromApi);
    },
    create: async (data: Omit<Service, 'id'>): Promise<Service> => {
      const apiData = {
        number: data.number,
        title: data.title,
        heading: data.heading,
        description: data.description,
        glow_color: data.glowColor,
      };
      const response = await api.post('services/', apiData);
      return mapServiceFromApi(response.data);
    },
    update: async (id: number, data: Partial<Service>): Promise<Service> => {
      const apiData: any = {};
      if (data.number !== undefined) apiData.number = data.number;
      if (data.title !== undefined) apiData.title = data.title;
      if (data.heading !== undefined) apiData.heading = data.heading;
      if (data.description !== undefined) apiData.description = data.description;
      if (data.glowColor !== undefined) apiData.glow_color = data.glowColor;

      const response = await api.put(`services/${id}/`, apiData);
      return mapServiceFromApi(response.data);
    },
    delete: async (id: number): Promise<void> => {
      await api.delete(`services/${id}/`);
    },
  },

  // FAQs API endpoints
  faqs: {
    list: async (): Promise<FAQ[]> => {
      const response = await api.get('faqs/');
      return response.data;
    },
    create: async (data: Omit<FAQ, 'id'>): Promise<FAQ> => {
      const response = await api.post('faqs/', data);
      return response.data;
    },
    update: async (id: number, data: Partial<FAQ>): Promise<FAQ> => {
      const response = await api.put(`faqs/${id}/`, data);
      return response.data;
    },
    delete: async (id: number): Promise<void> => {
      await api.delete(`faqs/${id}/`);
    },
  },

  // Statistics API endpoints
  statistics: {
    list: async (): Promise<Statistic[]> => {
      const response = await api.get('statistics/');
      return response.data;
    },
    create: async (data: Omit<Statistic, 'id'>): Promise<Statistic> => {
      const response = await api.post('statistics/', data);
      return response.data;
    },
    update: async (id: number, data: Partial<Statistic>): Promise<Statistic> => {
      const response = await api.put(`statistics/${id}/`, data);
      return response.data;
    },
    delete: async (id: number): Promise<void> => {
      await api.delete(`statistics/${id}/`);
    },
  },

  // Partners / Clients API endpoints
  partners: {
    list: async (): Promise<Partner[]> => {
      const response = await api.get('partners/');
      return response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        type: item.type || 'Corporate',
        contact: item.contact || '',
        logoUrl: item.logoUrl || undefined,
        status: item.status,
        createdAt: item.createdAt || '',
      }));
    },
    create: async (formData: FormData): Promise<Partner> => {
      const response = await api.post('partners/', formData);
      const item = response.data;
      return {
        id: item.id,
        name: item.name,
        type: item.type || 'Corporate',
        contact: item.contact || '',
        logoUrl: item.logoUrl || undefined,
        status: item.status,
        createdAt: item.createdAt || '',
      };
    },
    update: async (id: number, formData: FormData): Promise<Partner> => {
      const response = await api.put(`partners/${id}/`, formData);
      const item = response.data;
      return {
        id: item.id,
        name: item.name,
        type: item.type || 'Corporate',
        contact: item.contact || '',
        logoUrl: item.logoUrl || undefined,
        status: item.status,
        createdAt: item.createdAt || '',
      };
    },
    delete: async (id: number): Promise<void> => {
      await api.delete(`partners/${id}/`);
    },
  },
};
