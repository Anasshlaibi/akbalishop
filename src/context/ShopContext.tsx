import React, { createContext, useContext, useState, useMemo } from 'react';
import { Product, ConditionFilter, SortOption, Order, OrderStatus } from '../types';
import { CATEGORIES, Category, getStoredCategories, saveStoredCategories } from '../data/categories';
import { useProducts } from '../hooks/useProducts';
import { useOrders } from '../hooks/useOrders';
import { MutationResult } from '../services/productService';

export type { ConditionFilter, SortOption, Product, Order };
export type ActiveTab = 'home' | 'shop' | 'product' | 'contact' | 'about' | 'rental';

interface ShopContextType {
  categories: Category[];
  updateCategory: (id: string, updated: Partial<Category>) => void;
  products: Product[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  selectedBrand: string | null;
  setSelectedBrand: (brand: string | null) => void;
  conditionFilter: ConditionFilter;
  setConditionFilter: (cond: ConditionFilter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  
  // Single Source of Truth for Selected & QuickView Products
  selectedProduct: Product | null;
  setSelectedProduct: (prod: Product | string | null) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (prod: Product | string | null) => void;

  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;

  // Product CRUD (return Supabase MutationResult so callers can display errors)
  addProduct: (product: Product) => Promise<MutationResult<Product>>;
  updateProduct: (product: Product) => Promise<MutationResult<Product>>;
  deleteProduct: (id: string) => Promise<MutationResult<string>>;

  // Order Management
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => string;
  updateOrderStatus: (id: string, status: OrderStatus) => void;

  resetFilters: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(() => getStoredCategories());

  const updateCategory = (id: string, updatedFields: Partial<Category>) => {
    setCategories(prev => {
      const next = prev.map(c => (c.id === id || c.slug === id ? { ...c, ...updatedFields } : c));
      saveStoredCategories(next);
      return next;
    });
  };
  const productState = useProducts();
  const orderState = useOrders(productState.products);

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Store target IDs to ensure selected & quickView products always resolve dynamically from productState.products
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Derived selected product from synchronized products state
  const selectedProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return productState.products.find(p => p.id === selectedProductId || p.slug === selectedProductId) || null;
  }, [selectedProductId, productState.products]);

  const setSelectedProduct = (prod: Product | string | null) => {
    if (!prod) {
      setSelectedProductId(null);
    } else if (typeof prod === 'string') {
      setSelectedProductId(prod);
    } else {
      setSelectedProductId(prod.id);
    }
  };

  // Derived quickView product from synchronized products state
  const quickViewProduct = useMemo(() => {
    if (!quickViewProductId) return null;
    return productState.products.find(p => p.id === quickViewProductId || p.slug === quickViewProductId) || null;
  }, [quickViewProductId, productState.products]);

  const setQuickViewProduct = (prod: Product | string | null) => {
    if (!prod) {
      setQuickViewProductId(null);
    } else if (typeof prod === 'string') {
      setQuickViewProductId(prod);
    } else {
      setQuickViewProductId(prod.id);
    }
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): string => {
    const tempId = `AKABLI-${Math.floor(100000 + Math.random() * 900000)}`;
    orderState.createOrder({
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      city: orderData.city,
      address: orderData.address,
      paymentMethod: orderData.paymentMethod,
      items: orderData.items.map(i => ({ id: i.id, quantity: i.quantity }))
    }).catch(err => {
      console.error('Order creation error:', err);
    });
    return tempId;
  };

  return (
    <ShopContext.Provider value={{
      categories,
      updateCategory,
      products: productState.products,
      activeTab,
      setActiveTab,
      selectedCategory: productState.selectedCategory,
      setSelectedCategory: productState.setSelectedCategory,
      selectedBrand: productState.selectedBrand,
      setSelectedBrand: productState.setSelectedBrand,
      conditionFilter: productState.conditionFilter,
      setConditionFilter: productState.setConditionFilter,
      searchQuery: productState.searchQuery,
      setSearchQuery: productState.setSearchQuery,
      sortBy: productState.sortBy,
      setSortBy: productState.setSortBy,
      viewMode,
      setViewMode,
      selectedProduct,
      setSelectedProduct,
      quickViewProduct,
      setQuickViewProduct,
      isCheckoutOpen,
      setIsCheckoutOpen,
      isSearchModalOpen,
      setIsSearchModalOpen,
      isMobileFilterOpen,
      setIsMobileFilterOpen,
      isAdminOpen,
      setIsAdminOpen,
      addProduct: productState.addProduct,
      updateProduct: productState.updateProduct,
      deleteProduct: productState.deleteProduct,
      orders: orderState.orders,
      addOrder,
      updateOrderStatus: orderState.updateOrderStatus,
      resetFilters: productState.resetFilters
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};
