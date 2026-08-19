import { useState, useEffect, useMemo } from 'react';
import { Product, ConditionFilter, SortOption } from '../types';
import { productService, MutationResult } from '../services/productService';
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
    const counts = new Map<string, number>();
    activeProducts.forEach(p => {
      const cat = p.category.toLowerCase();
      counts.set(cat, (counts.get(cat) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([category, count]) => ({ category, count }));
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
    return activeProducts.filter(p => {
      if (selectedCategory) {
        const sel = selectedCategory.toLowerCase();
        const pCat = (p.category || '').toLowerCase();

        if (sel === 'stabilisateurs' || sel === 'stabilizers') {
          const isStab = pCat === 'stabilisateurs' || 
                         pCat === 'stabilizers' || 
                         pCat === 'gimbal' || 
                         p.name.toLowerCase().includes('stabilisat') || 
                         p.name.toLowerCase().includes('ronin') || 
                         p.name.toLowerCase().includes('gimbal') || 
                         (p.shortDescription || '').toLowerCase().includes('stabilisat') || 
                         (p.shortDescription || '').toLowerCase().includes('gimbal');
          if (!isStab) return false;
        } else if (sel === 'objectifs' || sel === 'lenses' || sel === 'lens') {
          const isLens = pCat === 'objectifs' || pCat === 'lenses' || pCat === 'lens' || p.name.toLowerCase().includes('objectif');
          if (!isLens) return false;
        } else if (sel === 'cameras' || sel === 'appareils-photo') {
          const isCam = pCat === 'cameras' || pCat === 'appareils-photo' || p.name.toLowerCase().includes('caméra') || p.name.toLowerCase().includes('camera') || p.name.toLowerCase().includes('boîtier');
          if (!isCam) return false;
        } else if (pCat !== sel) {
          return false;
        }
      }
      if (selectedBrand && p.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
      if (conditionFilter === 'neuf' && !p.isNew && p.condition !== 'new') return false;
      if (conditionFilter === 'occasion' && !p.isOccasion && p.condition !== 'used') return false;
      if (conditionFilter === 'location' && !p.isRental && p.commercialMode !== 'rental' && p.commercialMode !== 'both') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesDesc = p.shortDescription.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCat && !matchesDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
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
