import React, { createContext, useContext, useState } from 'react';
import { Product, ConditionFilter, SortOption, Order, OrderStatus } from '../types';
import { useProducts } from '../hooks/useProducts';
import { useOrders } from '../hooks/useOrders';

export type { ConditionFilter, SortOption, Product, Order };
export type ActiveTab = 'home' | 'shop' | 'product' | 'contact' | 'about' | 'rental';

interface ShopContextType {
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
  selectedProduct: Product | null;
  setSelectedProduct: (prod: Product | null) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (prod: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;

  // Product CRUD
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Order Management
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => string;
  updateOrderStatus: (id: string, status: OrderStatus) => void;

  resetFilters: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const productState = useProducts();
  const orderState = useOrders(productState.products);

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

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
