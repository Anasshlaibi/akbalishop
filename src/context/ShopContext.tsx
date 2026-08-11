import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, PRODUCTS as initialProducts } from '../data/products';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type ConditionFilter = 'all' | 'neuf' | 'occasion' | 'location';
export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
export type ActiveTab = 'home' | 'shop' | 'product' | 'contact' | 'about' | 'rental';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  paymentMethod: string;
  totalAmount: number;
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

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
  updateOrderStatus: (id: string, status: Order['status']) => void;

  resetFilters: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with static data immediately for instant render, then Supabase overwrites with authoritative prices
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(true);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('akabli_orders');
    return saved ? JSON.parse(saved) : [];
  });

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

  useEffect(() => {
    localStorage.setItem('akabli_orders', JSON.stringify(orders));
  }, [orders]);

  // Fetch Products Helper — deduplicates by ID and Supabase is always the authoritative source
  const fetchSupabaseProducts = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (data && data.length > 0 && !error) {
        // Deduplicate strictly by product ID
        const map = new Map<string, Product>();
        data.forEach((row: any) => {
          map.set(row.id, {
            id: row.id,
            name: row.name,
            brand: row.brand,
            category: row.category,
            price: Number(row.price),
            oldPrice: row.old_price ? Number(row.old_price) : undefined,
            rating: Number(row.rating || 5),
            reviewCount: Number(row.review_count || 0),
            inStock: Boolean(row.in_stock),
            isNew: Boolean(row.is_new),
            isOccasion: Boolean(row.is_occasion),
            isRental: Boolean(row.is_rental),
            rentalPricePerDay: row.rental_price_per_day ? Number(row.rental_price_per_day) : undefined,
            image: row.image,
            gallery: Array.isArray(row.gallery) ? row.gallery : [row.image],
            shortDescription: row.short_description || '',
            description: row.description || '',
            specs: row.specs || {},
            whatsInTheBox: row.whats_in_the_box || []
          });
        });
        // Only unique products from Supabase — no duplication
        setProducts(Array.from(map.values()));
      }
    } catch (e) {
      console.error('Error fetching Supabase products:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial Load & Realtime Supabase Subscription
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const client = supabase;

    fetchSupabaseProducts();

    // Channel subscription
    const channelId = `realtime_prod_${Math.random().toString(36).substr(2, 9)}`;
    const ordersChannelId = `realtime_ord_${Math.random().toString(36).substr(2, 9)}`;

    let channel: any;
    let ordersChannel: any;

    try {
      channel = client
        .channel(channelId)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
          fetchSupabaseProducts();
        })
        .subscribe();

      ordersChannel = client
        .channel(ordersChannelId)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
          client.from('orders').select('*').then(({ data }) => {
            if (data) {
              const dbOrders: Order[] = data.map((r: any) => ({
                id: r.id,
                customerName: r.customer_name,
                customerPhone: r.customer_phone,
                city: r.city,
                address: r.address,
                paymentMethod: r.payment_method,
                totalAmount: Number(r.total_amount),
                items: r.items || [],
                status: r.status || 'pending',
                createdAt: r.created_at
              }));
              setOrders(dbOrders);
            }
          });
        })
        .subscribe();
    } catch (err) {
      console.warn('Realtime subscription warning:', err);
    }

    return () => {
      if (channel) client.removeChannel(channel);
      if (ordersChannel) client.removeChannel(ordersChannel);
    };
  }, []);

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
    if (isSupabaseConfigured && supabase) {
      supabase.from('products').insert([{
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        old_price: product.oldPrice,
        in_stock: product.inStock,
        is_new: product.isNew,
        is_occasion: product.isOccasion,
        is_rental: product.isRental,
        image: product.image,
        gallery: product.gallery,
        short_description: product.shortDescription,
        description: product.description,
        specs: product.specs,
        whats_in_the_box: product.whatsInTheBox
      }]).then(({ error }) => {
        if (error) console.error('Supabase Insert Error:', error);
        fetchSupabaseProducts();
      });
    }
  };

  const updateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    if (selectedProduct?.id === product.id) {
      setSelectedProduct(product);
    }
    if (isSupabaseConfigured && supabase) {
      supabase.from('products').update({
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        old_price: product.oldPrice,
        in_stock: product.inStock,
        is_new: product.isNew,
        is_occasion: product.isOccasion,
        is_rental: product.isRental,
        image: product.image,
        short_description: product.shortDescription,
        description: product.description
      }).eq('id', product.id).then(({ error }) => {
        if (error) console.error('Supabase Update Error:', error);
        fetchSupabaseProducts();
      });
    }
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }
    if (isSupabaseConfigured && supabase) {
      supabase.from('products').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase Delete Error:', error);
        fetchSupabaseProducts();
      });
    }
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const id = 'AKABLI-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      ...orderData,
      id,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);

    if (isSupabaseConfigured && supabase) {
      supabase.from('orders').insert([{
        id,
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        city: orderData.city,
        address: orderData.address,
        payment_method: orderData.paymentMethod,
        total_amount: orderData.totalAmount,
        items: orderData.items,
        status: 'pending'
      }]).then(({ error }) => {
        if (error) console.error('Supabase Order Insert Error:', error);
      });
    }

    return id;
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    if (isSupabaseConfigured && supabase) {
      supabase.from('orders').update({ status }).eq('id', id).then(() => {});
    }
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setConditionFilter('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <ShopContext.Provider value={{
      products,
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
      setIsAdminOpen,
      addProduct,
      updateProduct,
      deleteProduct,
      orders,
      addOrder,
      updateOrderStatus,
      resetFilters
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
