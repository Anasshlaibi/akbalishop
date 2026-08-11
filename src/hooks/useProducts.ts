import { useState, useEffect, useMemo } from 'react';
import { Product, ConditionFilter, SortOption } from '../types';
import { productService, MutationResult } from '../services/productService';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [conditionFilter, setConditionFilter] = useState<ConditionFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const refreshProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('useProducts refresh error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const addProduct = async (product: Product): Promise<MutationResult<Product>> => {
    const res = await productService.createProduct(product);
    if (res.success && res.data) {
      setProducts(prev => [res.data!, ...prev]);
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

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
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
  }, [products, selectedCategory, selectedBrand, conditionFilter, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setConditionFilter('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return {
    products,
    filteredProducts,
    isLoading,
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
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    resetFilters
  };
}
