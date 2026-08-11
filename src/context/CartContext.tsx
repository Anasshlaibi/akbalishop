import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useShop } from './ShopContext';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: number;
  subtotal: number;
  freeShippingThreshold: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { products } = useShop();

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('akabli_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter(item => item && item.product && typeof item.product.id === 'string' && typeof item.product.price === 'number');
      }
      return [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('akabli_wishlist');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(id => typeof id === 'string') : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Synchronize cart item product details with live Supabase products state
  useEffect(() => {
    if (products && products.length > 0 && cart.length > 0) {
      setCart(prevCart => {
        let hasChanges = false;
        const updated = prevCart
          .filter(item => item && item.product && item.product.id)
          .map(item => {
            const liveProd = products.find(p => p.id === item.product.id);
            if (liveProd && (liveProd.price !== item.product.price || liveProd.name !== item.product.name || liveProd.image !== item.product.image)) {
              hasChanges = true;
              return { ...item, product: liveProd };
            }
            return item;
          });
        return hasChanges ? updated : prevCart;
      });
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('akabli_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('akabli_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const addToCart = (product: Product, quantity = 1) => {
    if (!product || !product.id) return;
    const liveProduct = (products && products.find(p => p.id === product.id)) || product;
    setCart(prev => {
      const validPrev = prev.filter(item => item && item.product && item.product.id);
      const existingIndex = validPrev.findIndex(item => item.product.id === liveProduct.id);
      if (existingIndex > -1) {
        const updated = [...validPrev];
        updated[existingIndex].quantity += quantity;
        updated[existingIndex].product = liveProduct;
        return updated;
      }
      return [...validPrev, { product: liveProduct, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item && item.product && item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => (item && item.product && item.product.id === productId) ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    if (!productId) return;
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => Boolean(productId && wishlist.includes(productId));

  const totalItems = cart.reduce((acc, item) => acc + (item && item.quantity ? item.quantity : 0), 0);
  const subtotal = cart.reduce((acc, item) => acc + (item && item.product && typeof item.product.price === 'number' ? item.product.price * (item.quantity || 1) : 0), 0);
  const freeShippingThreshold = 2000; // Free delivery in Morocco for orders > 2000 DH

  return (
    <CartContext.Provider value={{
      cart,
      wishlist,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      isInWishlist,
      totalItems,
      subtotal,
      freeShippingThreshold
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
