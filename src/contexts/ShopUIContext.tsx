import React, { createContext, useContext, useState } from 'react';
import { Product, ConditionFilter, SortOption } from '../types';

export type ActiveTab = 'home' | 'shop' | 'product' | 'contact' | 'about' | 'rental';

interface ShopUIContextType {
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
}

const ShopUIContext = createContext<ShopUIContextType | undefined>(undefined);

export const ShopUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [conditionFilter, setConditionFilter] = useState<ConditionFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <ShopUIContext.Provider value={{
      activeTab,
      setActiveTab,
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
      setIsAdminOpen
    }}>
      {children}
    </ShopUIContext.Provider>
  );
};

export const useShopUI = () => {
  const context = useContext(ShopUIContext);
  if (!context) {
    throw new Error('useShopUI must be used within a ShopUIProvider');
  }
  return context;
};
