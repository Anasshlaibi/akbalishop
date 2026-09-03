import { CATEGORIES, normalizeCategorySlug, getCategoryCount } from '../data/categories';
import { useState, useEffect, useMemo } from 'react';
import { Product, ConditionFilter, SortOption, HeroSlide, getStoredSlides, saveStoredSlides } from '../types';
import { productService, MutationResult } from '../services/productService';
import { intelligentSearchService } from '../services/intelligentSearchService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Database } from '../types/database.types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [conditionFilter, setConditionFilter] = useState<ConditionFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Hero Slides State
  const [slides, setSlides] = useState<HeroSlide[]>(() => getStoredSlides());

  // Sync Cloud Slides on Mount & Realtime
  useEffect(() => {
    productService.fetchCloudSlides().then(cloudSlides => {
      if (cloudSlides && cloudSlides.length > 0) {
        setSlides(cloudSlides);
        saveStoredSlides(cloudSlides);
      }
    });

    if (!isSupabaseConfigured || !supabase) return;
    const client = supabase;
    const channelId = `slide_rt_${Math.random().toString(36).substring(2, 9)}`;

    let channel: any;
    try {
      channel = client
        .channel(channelId)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'hero_slides' },
          () => {
            productService.fetchCloudSlides().then(fresh => {
              if (fresh && fresh.length > 0) {
                setSlides(fresh);
                saveStoredSlides(fresh);
              }
            });
          }
        )
        .subscribe();
    } catch (err) {
      console.warn('Slide realtime error:', err);
    }

    return () => {
      if (channel) client.removeChannel(channel);
    };
  }, []);


  const addSlide = (slideData: Partial<HeroSlide>) => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      type: slideData.type || 'main',
      badge: slideData.badge || 'PROMO EXCLUSIVE',
      title: slideData.title || 'Nouveau Produit en Vedette',
      subtitle: slideData.subtitle || '',
      price: slideData.price || '0 DH',
      oldPrice: slideData.oldPrice || undefined,
      image: slideData.image || '/wp-content/uploads/SONY-FX6-jpg-300x300.webp',
      ctaText: slideData.ctaText || 'Profiter de l\'offre',
      productId: slideData.productId || undefined,
      stockBadge: slideData.stockBadge || 'Stock Marrakech',
      isActive: slideData.isActive !== false,
      sortOrder: slideData.sortOrder || slides.length + 1
    };

    setSlides(prev => {
      const next = [...prev, newSlide];
      saveStoredSlides(next);
      productService.saveCloudSlides(next);
      return next;
    });
  };

    const updateSlide = (id: string, updatedFields: Partial<HeroSlide>) => {
    setSlides(prev => {
      const next = prev.map(s => {
        if (s.id === id) {
          return { ...s, ...updatedFields, updatedAt: new Date().toISOString() };
        }
        return s;
      });
      saveStoredSlides(next);
      productService.saveCloudSlides(next);
      return next;
    });
  };

  const deleteSlide = (id: string) => {
    setSlides(prev => {
      const next = prev.filter(s => s.id !== id);
      saveStoredSlides(next);
      productService.saveCloudSlides(next);
      return next;
    });
  };

  const reorderSlides = (newSlides: HeroSlide[]) => {
    const updated = newSlides.map((s, idx) => ({ ...s, sortOrder: idx + 1 }));
    setSlides(updated);
    saveStoredSlides(updated);
    productService.saveCloudSlides(updated);
  };

  const refreshProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err: any) {
      console.error('useProducts refresh error:', err);
      setError(err?.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial Load & Realtime Supabase Subscription
  useEffect(() => {
    refreshProducts();

    if (!isSupabaseConfigured || !supabase) return;
    const client = supabase;
    const channelId = `prod_rt_${Math.random().toString(36).substring(2, 9)}`;

    let channel: any;
    try {
      channel = client
        .channel(channelId)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          (payload: any) => {
            if (payload.eventType === 'INSERT' && payload.new) {
              const newProd = productService.mapRowToProduct(payload.new as Database['public']['Tables']['products']['Row']);
              setProducts(prev => {
                const exists = prev.some(p => p.id === newProd.id);
                return exists ? prev.map(p => (p.id === newProd.id ? newProd : p)) : [newProd, ...prev];
              });
            } else if (payload.eventType === 'UPDATE' && payload.new) {
              const updatedProd = productService.mapRowToProduct(payload.new as Database['public']['Tables']['products']['Row']);
              setProducts(prev => prev.map(p => (p.id === updatedProd.id ? updatedProd : p)));
            } else if (payload.eventType === 'DELETE' && payload.old) {
              const deletedId = payload.old.id;
              setProducts(prev => prev.filter(p => p.id !== deletedId));
            }
          }
        )
        .subscribe();
    } catch (err) {
      console.warn('Realtime subscription error:', err);
    }

    return () => {
      if (channel) {
        client.removeChannel(channel);
      }
    };
  }, []);

  // Database-First Mutations: Send directly to Supabase via productService
  const addProduct = async (product: Product): Promise<MutationResult<Product>> => {
    const res = await productService.createProduct(product);
    if (res.success && res.data) {
      setProducts(prev => {
        const exists = prev.some(p => p.id === res.data!.id);
        return exists ? prev.map(p => (p.id === res.data!.id ? res.data! : p)) : [res.data!, ...prev];
      });
    }
    return res;
  };

  const updateProduct = async (product: Product): Promise<MutationResult<Product>> => {
    const res = await productService.updateProduct(product);
    if (res.success && res.data) {
      setProducts(prev => prev.map(p => (p.id === res.data!.id ? res.data! : p)));
    }
    return res;
  };

  const deleteProduct = async (id: string): Promise<MutationResult<string>> => {
    const res = await productService.deleteProduct(id);
    if (res.success) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
    return res;
  };

  const deactivateProduct = async (id: string): Promise<MutationResult<string>> => {
    const res = await productService.deactivateProduct(id);
    if (res.success) {
      setProducts(prev => prev.map(p => (p.id === id ? { ...p, isActive: false } : p)));
    }
    return res;
  };

  // Active products for public storefront
  const activeProducts = useMemo(() => {
    return products.filter(p => p.isActive !== false);
  }, [products]);

  // Derived categories from active catalog
  const availableCategories = useMemo(() => {
    return CATEGORIES.map(cat => ({
      category: cat.slug,
      count: getCategoryCount(cat.slug, activeProducts)
    }));
  }, [activeProducts]);

  // Derived brands from active catalog
  const availableBrands = useMemo(() => {
    const counts = new Map<string, number>();
    activeProducts.forEach(p => {
      const b = p.brand;
      counts.set(b, (counts.get(b) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([brand, count]) => ({ brand, count }));
  }, [activeProducts]);

  const filteredProducts = useMemo(() => {
    let list = activeProducts;

    // 1. Intelligent Search Filter & Rank if searchQuery is present
    if (searchQuery.trim()) {
      const searchResults = intelligentSearchService.searchProducts(searchQuery, list);
      list = searchResults.map(r => r.product);
    }

    // 2. Apply Category, Brand, and Condition Filters
    return list.filter(p => {
      if (selectedCategory) {
        const normSel = normalizeCategorySlug(selectedCategory);
        const normPCat = normalizeCategorySlug(p.category);

        if (normSel === 'occasions') {
          if (normPCat !== 'occasions' && !p.isOccasion && p.condition !== 'used') return false;
        } else if (normSel === 'location') {
          if (normPCat !== 'location' && !p.isRental && p.commercialMode !== 'rental' && p.commercialMode !== 'both') return false;
        } else {
          if (normPCat !== normSel) return false;
        }
      }
      if (selectedBrand) {
        const normSelectedBrand = selectedBrand.toLowerCase().trim();
        const pBrandNorm = (p.brand || '').toLowerCase().trim();
        const isMatch = pBrandNorm === normSelectedBrand ||
                        pBrandNorm.includes(normSelectedBrand) ||
                        normSelectedBrand.includes(pBrandNorm) ||
                        p.name.toLowerCase().includes(normSelectedBrand);
        if (!isMatch) return false;
      }
      if (conditionFilter === 'neuf' && !p.isNew && p.condition !== 'new') return false;
      if (conditionFilter === 'occasion' && !p.isOccasion && p.condition !== 'used') return false;
      if (conditionFilter === 'location' && !p.isRental && p.commercialMode !== 'rental' && p.commercialMode !== 'both') return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Keep intelligent search score order if searchQuery is active
      return 0;
    });
  }, [activeProducts, selectedCategory, selectedBrand, conditionFilter, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setConditionFilter('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return {
    products,
    activeProducts,
    filteredProducts,
    isLoading,
    error,
    slides,
    addSlide,
    updateSlide,
    deleteSlide,
    reorderSlides,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    conditionFilter,
    setConditionFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    availableCategories,
    availableBrands,
    addProduct,
    updateProduct,
    deleteProduct,
    deactivateProduct,
    refreshProducts,
    resetFilters
  };
}

