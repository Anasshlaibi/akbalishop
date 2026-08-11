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
    const saved = localStorage.getItem('akabli_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('akabli_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Synchronize cart item product details with live Supabase products state
  useEffect(() => {
    if (products && products.length > 0 && cart.length > 0) {
      setCart(prevCart => {
        let hasChanges = false;
        const updated = prevCart.map(item => {
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
    localStorage.setItem('akabli_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('akabli_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Product, quantity = 1) => {
    const liveProduct = products.find(p => p.id === product.id) || product;
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === liveProduct.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        updated[existingIndex].product = liveProduct;
        return updated;
      }
      return [...prev, { product: liveProduct, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
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
