import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Category, Work, Blog, Service, FAQ, Statistic, Partner } from '../types';
import { apiService } from '../utils/api';

interface DataContextType {
  categories: Category[];
  works: Work[];
  blogs: Blog[];
  partners: Partner[];
  services: Service[];
  faqs: FAQ[];
  statistics: Statistic[];
  loading: boolean;
  error: string | null;

  refreshAll: () => Promise<void>;

  addCategory: (item: Omit<Category, 'id' | 'createdAt'>) => Promise<void>;
  updateCategory: (id: number, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;

  addWork: (item: { 
    title: string; 
    category: string; 
    client: string; 
    status: 'active' | 'draft' | 'inactive'; 
    imageFile?: File | null;
    is_featured?: boolean;
    featured_description?: string;
    short_description?: string;
    featured_metric_1?: string;
    featured_metric_2?: string;
    featured_metric_3?: string;
    featured_cta_text?: string;
    featured_theme_color?: string;
    featured_priority?: number;
  }) => Promise<void>;
  updateWork: (id: number, updates: { 
    title?: string; 
    category?: string; 
    client?: string; 
    status?: 'active' | 'draft' | 'inactive'; 
    imageFile?: File | null; 
    removeImage?: boolean;
    is_featured?: boolean;
    featured_description?: string;
    short_description?: string;
    featured_metric_1?: string;
    featured_metric_2?: string;
    featured_metric_3?: string;
    featured_cta_text?: string;
    featured_theme_color?: string;
    featured_priority?: number;
  }) => Promise<void>;
  deleteWork: (id: number) => Promise<void>;

  addBlog: (item: { title: string; date: string; metaDescription: string; description: string; imageFiles?: File[] }) => Promise<void>;
  updateBlog: (id: number, updates: { title?: string; date?: string; metaDescription?: string; description?: string; imageFiles?: File[]; removeImages?: boolean }) => Promise<void>;
  deleteBlog: (id: number) => Promise<void>;

  addPartner: (item: { name: string; type: string; contact: string; status: 'active' | 'inactive'; logoFile?: File | null }) => Promise<void>;
  updatePartner: (id: number, updates: { name?: string; type?: string; contact?: string; status?: 'active' | 'inactive'; logoFile?: File | null; removeLogo?: boolean }) => Promise<void>;
  deletePartner: (id: number) => Promise<void>;

  addService: (item: Omit<Service, 'id'>) => Promise<void>;
  updateService: (id: number, updates: Partial<Service>) => Promise<void>;
  deleteService: (id: number) => Promise<void>;

  addFAQ: (item: Omit<FAQ, 'id'>) => Promise<void>;
  updateFAQ: (id: number, updates: Partial<FAQ>) => Promise<void>;
  deleteFAQ: (id: number) => Promise<void>;

  addStatistic: (item: Omit<Statistic, 'id'>) => Promise<void>;
  updateStatistic: (id: number, updates: Partial<Statistic>) => Promise<void>;
  deleteStatistic: (id: number) => Promise<void>;

  resetAllData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    // Only load if authenticated
    const token = sessionStorage.getItem('manzio_react_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [catsRes, worksRes, blogsRes, partnersRes, servicesRes, faqsRes, statsRes] = await Promise.all([
        apiService.categories.list(),
        apiService.works.list(),
        apiService.blogs.list(),
        apiService.partners.list(),
        apiService.services.list(),
        apiService.faqs.list(),
        apiService.statistics.list(),
      ]);

      setCategories(catsRes);
      setWorks(worksRes);
      setBlogs(blogsRes);
      setPartners(partnersRes);
      setServices(servicesRes);
      setFaqs(faqsRes);
      setStatistics(statsRes);
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Connection to backend failed. Please verify Django is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Helper to extract detailed validation error strings from Django REST responses
  const getErrorMessage = (err: any, defaultMsg: string): string => {
    if (err.response && err.response.data) {
      console.error("API Validation Failure Data:", err.response.data);
      console.error("API Status Code:", err.response.status);
      const data = err.response.data;
      if (typeof data === 'object') {
        const messages: string[] = [];
        for (const [key, value] of Object.entries(data)) {
          if (Array.isArray(value)) {
            messages.push(`${key}: ${value.join(', ')}`);
          } else if (typeof value === 'string') {
            messages.push(`${key}: ${value}`);
          }
        }
        if (messages.length > 0) {
          return messages.join(' | ');
        }
      }
    }
    return err.message || defaultMsg;
  };

  const refreshAll = async () => {
    await loadData();
  };

  // Categories CRUD
  const addCategory = async (item: Omit<Category, 'id' | 'createdAt'>) => {
    try {
      const newCat = await apiService.categories.create(item);
      setCategories(prev => [newCat, ...prev]);
    } catch (err: any) {
      const errMsg = getErrorMessage(err, 'Failed to create category');
      throw new Error(errMsg);
    }
  };

  const updateCategory = async (id: number, updates: Partial<Category>) => {
    try {
      const updatedCat = await apiService.categories.update(id, updates);
      setCategories(prev => prev.map(c => c.id === id ? updatedCat : c));
    } catch (err: any) {
      const errMsg = getErrorMessage(err, 'Failed to update category');
      throw new Error(errMsg);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await apiService.categories.delete(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      const errMsg = getErrorMessage(err, 'Failed to delete category');
      throw new Error(errMsg);
    }
  };

  // Works CRUD
  const addWork = async (item: { 
    title: string; 
    category: string; 
    client: string; 
    status: 'active' | 'draft' | 'inactive'; 
    imageFile?: File | null;
    is_featured?: boolean;
    featured_description?: string;
    short_description?: string;
    featured_metric_1?: string;
    featured_metric_2?: string;
    featured_metric_3?: string;
    featured_cta_text?: string;
    featured_theme_color?: string;
    featured_priority?: number;
  }) => {
    try {
      console.log('Sending addWork payload title:', item.title, 'category:', item.category);
      const formData = new FormData();
      
      // Standard schema fields
      formData.append('title', item.title);
      formData.append('category', item.category);
      formData.append('category_name', item.category);
      formData.append('client', item.client || '');
      formData.append('status', item.status);
      
      // User specified schema fields (slug, short_description, full_description, technologies, featured, thumbnail_image)
      const slug = item.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      formData.append('slug', slug);
      
      formData.append('short_description', item.short_description || item.client || item.title);
      formData.append('full_description', item.featured_description || item.client || item.title);
      formData.append('technologies', item.category);
      formData.append('featured', String(item.status === 'active'));

      // New Featured Work Fields
      formData.append('is_featured', String(!!item.is_featured));
      formData.append('featured_description', item.featured_description || '');
      formData.append('featured_metric_1', item.featured_metric_1 || '');
      formData.append('featured_metric_2', item.featured_metric_2 || '');
      formData.append('featured_metric_3', item.featured_metric_3 || '');
      formData.append('featured_cta_text', item.featured_cta_text || '');
      formData.append('featured_theme_color', item.featured_theme_color || '');
      formData.append('featured_priority', String(item.featured_priority || 0));

      if (item.imageFile) {
        formData.append('image', item.imageFile);
        formData.append('thumbnail_image', item.imageFile);
      }

      // Log full FormData payload for transparent debugging
      console.log('Sending FormData keys:');
      for (const [key, value] of (formData as any).entries()) {
        console.log(`  [FormData] ${key}:`, value instanceof File ? `File (${value.name}, ${value.size} bytes)` : value);
      }

      const newWork = await apiService.works.create(formData);
      setWorks(prev => [newWork, ...prev]);
    } catch (err: any) {
      if (err.response && err.response.data) {
        console.error("API Validation Failure Data inside addWork:", err.response.data);
      }
      const errMsg = getErrorMessage(err, 'Failed to add work');
      throw new Error(errMsg);
    }
  };

  const updateWork = async (id: number, updates: { 
    title?: string; 
    category?: string; 
    client?: string; 
    status?: 'active' | 'draft' | 'inactive'; 
    imageFile?: File | null; 
    removeImage?: boolean;
    is_featured?: boolean;
    featured_description?: string;
    short_description?: string;
    featured_metric_1?: string;
    featured_metric_2?: string;
    featured_metric_3?: string;
    featured_cta_text?: string;
    featured_theme_color?: string;
    featured_priority?: number;
  }) => {
    try {
      console.log('Sending updateWork ID:', id, 'updates:', updates);
      const formData = new FormData();
      
      // Map title and slug
      if (updates.title !== undefined) {
        formData.append('title', updates.title);
        const slug = updates.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        formData.append('slug', slug);
      }
      
      // Map category and technologies
      if (updates.category !== undefined) {
        formData.append('category', updates.category);
        formData.append('category_name', updates.category);
        formData.append('technologies', updates.category);
      }
      
      // Map client and descriptions
      if (updates.client !== undefined) {
        formData.append('client', updates.client);
      }
      
      if (updates.short_description !== undefined) {
        formData.append('short_description', updates.short_description);
      } else if (updates.client !== undefined || updates.title !== undefined) {
        formData.append('short_description', updates.client || updates.title || '');
      }

      if (updates.featured_description !== undefined) {
        formData.append('featured_description', updates.featured_description);
        formData.append('full_description', updates.featured_description);
      } else if (updates.client !== undefined || updates.title !== undefined) {
        formData.append('full_description', updates.client || updates.title || '');
      }
      
      // Map status and featured
      if (updates.status !== undefined) {
        formData.append('status', updates.status);
        formData.append('featured', String(updates.status === 'active'));
      }

      // Map new Featured fields
      if (updates.is_featured !== undefined) {
        formData.append('is_featured', String(!!updates.is_featured));
      }
      if (updates.featured_metric_1 !== undefined) {
        formData.append('featured_metric_1', updates.featured_metric_1);
      }
      if (updates.featured_metric_2 !== undefined) {
        formData.append('featured_metric_2', updates.featured_metric_2);
      }
      if (updates.featured_metric_3 !== undefined) {
        formData.append('featured_metric_3', updates.featured_metric_3);
      }
      if (updates.featured_cta_text !== undefined) {
        formData.append('featured_cta_text', updates.featured_cta_text);
      }
      if (updates.featured_theme_color !== undefined) {
        formData.append('featured_theme_color', updates.featured_theme_color);
      }
      if (updates.featured_priority !== undefined) {
        formData.append('featured_priority', String(updates.featured_priority));
      }
      
      // Map images
      if (updates.imageFile) {
        formData.append('image', updates.imageFile);
        formData.append('thumbnail_image', updates.imageFile);
      } else if (updates.removeImage) {
        formData.append('image', '');
        formData.append('thumbnail_image', '');
      }

      // Log full FormData payload for transparent debugging
      console.log('Sending FormData keys for Update:');
      for (const [key, value] of (formData as any).entries()) {
        console.log(`  [FormData] ${key}:`, value instanceof File ? `File (${value.name}, ${value.size} bytes)` : value);
      }

      const updatedWork = await apiService.works.update(id, formData);
      setWorks(prev => prev.map(w => w.id === id ? updatedWork : w));
    } catch (err: any) {
      if (err.response && err.response.data) {
        console.error("API Validation Failure Data inside updateWork:", err.response.data);
      }
      const errMsg = getErrorMessage(err, 'Failed to update work');
      throw new Error(errMsg);
    }
  };

  const deleteWork = async (id: number) => {
    try {
      await apiService.works.delete(id);
      setWorks(prev => prev.filter(w => w.id !== id));
    } catch (err: any) {
      const errMsg = getErrorMessage(err, 'Failed to delete work');
      throw new Error(errMsg);
    }
  };

  // Blogs CRUD
  const addBlog = async (item: { title: string; date: string; metaDescription: string; description: string; imageFiles?: File[] }) => {
    try {
      const formData = new FormData();
      formData.append('title', item.title);
      formData.append('date', item.date);
      formData.append('meta_description', item.metaDescription);
      formData.append('description', item.description);
      
      if (item.imageFiles && item.imageFiles.length > 0) {
        item.imageFiles.forEach(file => {
          formData.append('uploaded_images', file);
        });
      }

      const newBlog = await apiService.blogs.create(formData);
      setBlogs(prev => [newBlog, ...prev]);
    } catch (err: any) {
      const errMsg = getErrorMessage(err, 'Failed to add blog');
      throw new Error(errMsg);
    }
  };

  const updateBlog = async (id: number, updates: { title?: string; date?: string; metaDescription?: string; description?: string; imageFiles?: File[]; removeImages?: boolean }) => {
    try {
      const formData = new FormData();
      if (updates.title !== undefined) formData.append('title', updates.title);
      if (updates.date !== undefined) formData.append('date', updates.date);
      if (updates.metaDescription !== undefined) formData.append('meta_description', updates.metaDescription);
      if (updates.description !== undefined) formData.append('description', updates.description);

      if (updates.imageFiles && updates.imageFiles.length > 0) {
        updates.imageFiles.forEach(file => {
          formData.append('uploaded_images', file);
        });
      } else if (updates.removeImages) {
        formData.append('uploaded_images', '');
      }

      const updatedBlog = await apiService.blogs.update(id, formData);
      setBlogs(prev => prev.map(b => b.id === id ? updatedBlog : b));
    } catch (err: any) {
      const errMsg = getErrorMessage(err, 'Failed to update blog');
      throw new Error(errMsg);
    }
  };

  const deleteBlog = async (id: number) => {
    try {
      await apiService.blogs.delete(id);
      setBlogs(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      const errMsg = getErrorMessage(err, 'Failed to delete blog');
      throw new Error(errMsg);
    }
  };

  // Partners CRUD
  const addPartner = async (item: { name: string; type: string; contact: string; status: 'active' | 'inactive'; logoFile?: File | null }) => {
    try {
      const formData = new FormData();
      formData.append('name', item.name);
      formData.append('type', item.type);
      formData.append('contact', item.contact);
      formData.append('status', item.status);
      if (item.logoFile) {
        formData.append('logo', item.logoFile);
      }

      const newPartner = await apiService.partners.create(formData);
      setPartners(prev => [newPartner, ...prev]);
    } catch (err: any) {
      const errMsg = getErrorMessage(err, 'Failed to add partner');
      throw new Error(errMsg);
    }
  };

  const updatePartner = async (id: number, updates: { name?: string; type?: string; contact?: string; status?: 'active' | 'inactive'; logoFile?: File | null; removeLogo?: boolean }) => {
    try {
      const formData = new FormData();
      if (updates.name !== undefined) formData.append('name', updates.name);
      if (updates.type !== undefined) formData.append('type', updates.type);
      if (updates.contact !== undefined) formData.append('contact', updates.contact);
      if (updates.status !== undefined) formData.append('status', updates.status);

      if (updates.logoFile) {
        formData.append('logo', updates.logoFile);
      } else if (updates.removeLogo) {
        formData.append('logo', '');
      }

      const updatedPartner = await apiService.partners.update(id, formData);
      setPartners(prev => prev.map(p => p.id === id ? updatedPartner : p));
    } catch (err: any) {
      const errMsg = getErrorMessage(err, 'Failed to update partner');
      throw new Error(errMsg);
    }
  };

  const deletePartner = async (id: number) => {
    try {
      await apiService.partners.delete(id);
      setPartners(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      const errMsg = getErrorMessage(err, 'Failed to delete partner');
      throw new Error(errMsg);
    }
  };

  // Services CRUD
  const addService = async (item: Omit<Service, 'id'>) => {
    try {
      const newService = await apiService.services.create(item);
      setServices(prev => [...prev, newService]);
    } catch (err: any) {
      const errMsg = getErrorMessage(err, 'Failed to add service');
      throw new Error(errMsg);
    }
  };

  const updateService = async (id: number, updates: Partial<Service>) => {
    try {
      const updatedService = await apiService.services.update(id, updates);
      setServices(prev => prev.map(s => s.id === id ? updatedService : s));
    } catch (err: any) {
      const errMsg = getErrorMessage(err, 'Failed to update service');
      throw new Error(errMsg);
    }
  };

  const deleteService = async (id: number) => {
    try {
      await apiService.services.delete(id);
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      const errMsg = getErrorMessage(err, 'Failed to delete service');
      throw new Error(errMsg);
    }
  };

  // FAQs CRUD
  const addFAQ = async (item: Omit<FAQ, 'id'>) => {
    try {
      const newFaq = await apiService.faqs.create(item);
      setFaqs(prev => [...prev, newFaq]);
    } catch (err: any) {
      const errMsg = getErrorMessage(err, 'Failed to add FAQ');
      throw new Error(errMsg);
    }
  };

  const updateFAQ = async (id: number, updates: Partial<FAQ>) => {
    try {
      const updatedFaq = await apiService.faqs.update(id, updates);
      setFaqs(prev => prev.map(f => f.id === id ? updatedFaq : f));
    } catch (err: any) {
      const errMsg = getErrorMessage(err, 'Failed to update FAQ');
      throw new Error(errMsg);
    }
  };

  const deleteFAQ = async (id: number) => {
    try {
      await apiService.faqs.delete(id);
      setFaqs(prev => prev.filter(f => f.id !== id));
    } catch (err: any) {
      const errMsg = getErrorMessage(err, 'Failed to delete FAQ');
      throw new Error(errMsg);
    }
  };

  // Statistics CRUD
  const addStatistic = async (item: Omit<Statistic, 'id'>) => {
    try {
      const newStat = await apiService.statistics.create(item);
      setStatistics(prev => [...prev, newStat]);
    } catch (err: any) {
      const errMsg = getErrorMessage(err, 'Failed to add statistic');
      throw new Error(errMsg);
    }
  };

  const updateStatistic = async (id: number, updates: Partial<Statistic>) => {
    try {
      const updatedStat = await apiService.statistics.update(id, updates);
      setStatistics(prev => prev.map(s => s.id === id ? updatedStat : s));
    } catch (err: any) {
      const errMsg = getErrorMessage(err, 'Failed to update statistic');
      throw new Error(errMsg);
    }
  };

  const deleteStatistic = async (id: number) => {
    try {
      await apiService.statistics.delete(id);
      setStatistics(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      const errMsg = getErrorMessage(err, 'Failed to delete statistic');
      throw new Error(errMsg);
    }
  };

  const resetAllData = async () => {
    await loadData();
  };

  return (
    <DataContext.Provider value={{
      categories,
      works,
      blogs,
      partners,
      services,
      faqs,
      statistics,
      loading,
      error,
      refreshAll,
      addCategory,
      updateCategory,
      deleteCategory,
      addWork,
      updateWork,
      deleteWork,
      addBlog,
      updateBlog,
      deleteBlog,
      addPartner,
      updatePartner,
      deletePartner,
      addService,
      updateService,
      deleteService,
      addFAQ,
      updateFAQ,
      deleteFAQ,
      addStatistic,
      updateStatistic,
      deleteStatistic,
      resetAllData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
