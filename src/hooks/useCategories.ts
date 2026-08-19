import { useState, useEffect } from 'react';
import { Category, CATEGORIES, getStoredCategories, saveStoredCategories } from '../data/categories';
import { categoryService } from '../services/categoryService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Database } from '../types/database.types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(() => getStoredCategories());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories();
      if (data && data.length > 0) {
        setCategories(data);
        saveStoredCategories(data);
      }
    } catch (err: any) {
      console.error('useCategories refresh error:', err);
      setError(err?.message || 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCategories();

    if (!isSupabaseConfigured || !supabase) return;
    const client = supabase;
    const channelId = `cat_rt_${Math.random().toString(36).substring(2, 9)}`;

    let channel: any;
    try {
      channel = client
        .channel(channelId)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'categories' },
          (payload: any) => {
            if (payload.eventType === 'INSERT' && payload.new) {
              const newCat = categoryService.mapRowToCategory(payload.new as Database['public']['Tables']['categories']['Row']);
              setCategories(prev => {
                const next = prev.some(c => c.id === newCat.id)
                  ? prev.map(c => (c.id === newCat.id ? newCat : c))
                  : [...prev, newCat];
                saveStoredCategories(next);
                return next;
              });
            } else if (payload.eventType === 'UPDATE' && payload.new) {
              const updatedCat = categoryService.mapRowToCategory(payload.new as Database['public']['Tables']['categories']['Row']);
              setCategories(prev => {
                const next = prev.map(c => (c.id === updatedCat.id ? updatedCat : c));
                saveStoredCategories(next);
                return next;
              });
            } else if (payload.eventType === 'DELETE' && payload.old) {
              const deletedId = payload.old.id;
              setCategories(prev => {
                const next = prev.filter(c => c.id !== deletedId);
                saveStoredCategories(next);
                return next;
              });
            }
          }
        )
        .subscribe();
    } catch (err) {
      console.warn('Categories realtime error:', err);
    }

    return () => {
      if (channel) {
        client.removeChannel(channel);
      }
    };
  }, []);

  const addCategory = async (categoryData: Partial<Category>) => {
    const slug = (categoryData.slug || categoryData.name || "category").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    const newCat: Category = {
      id: slug || `cat-${Date.now()}`,
      name: categoryData.name || "Nouvelle Catégorie",
      slug: slug || "nouvelle-categorie",
      description: categoryData.description || "",
      itemCount: 0,
      image: categoryData.image || "/wp-content/uploads/electronics-store-55.png",
      iconName: categoryData.iconName || "Tag"
    };

    setCategories(prev => {
      const next = [...prev.filter(c => c.id !== newCat.id), newCat];
      saveStoredCategories(next);
      return next;
    });

    await categoryService.saveCategory(newCat);
  };

  const updateCategory = async (id: string, updatedFields: Partial<Category>) => {
    let updatedCat: Category | null = null;
    setCategories(prev => {
      const next = prev.map(c => {
        if (c.id === id || c.slug === id) {
          updatedCat = { ...c, ...updatedFields };
          return updatedCat;
        }
        return c;
      });
      saveStoredCategories(next);
      return next;
    });

    if (updatedCat) {
      await categoryService.saveCategory(updatedCat);
    }
  };

  return {
    categories,
    isLoading,
    error,
    addCategory,
    updateCategory,
    refreshCategories
  };
}
