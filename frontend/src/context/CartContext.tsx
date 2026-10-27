import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, quantity?: number, shade?: string) => void;
  removeFromCart: (productId: string, shade?: string) => void;
  updateQuantity: (productId: string, quantity: number, shade?: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bbs_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [promoCode, setPromoCode] = useState<string>(() => localStorage.getItem('bbs_promo_code') || '');
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('bbs_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1, shade?: string) => {
    const selectedShade = shade || product.shade;
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.shade === selectedShade
      );

      if (existingIndex > -1) {
        const nextCart = [...prev];
        const newQty = Math.min(product.stock, nextCart[existingIndex].quantity + quantity);
        nextCart[existingIndex] = {
          ...nextCart[existingIndex],
          quantity: newQty
        };
        return nextCart;
      } else {
        return [...prev, { product, quantity: Math.min(product.stock, quantity), shade: selectedShade }];
      }
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string, shade?: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.shade === shade)));
  };

  const updateQuantity = (productId: string, quantity: number, shade?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, shade);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId && item.shade === shade) {
          const maxAvailable = item.product.stock;
          return { ...item, quantity: Math.min(quantity, maxAvailable) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode('');
    setDiscount(0);
    localStorage.removeItem('bbs_cart');
    localStorage.removeItem('bbs_promo_code');
  };

  const applyPromoCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'SALMA10' || cleanCode === 'BBS10') {
      setPromoCode(cleanCode);
      localStorage.setItem('bbs_promo_code', cleanCode);
      return true;
    } else if (cleanCode === 'BEAUTE15') {
      setPromoCode(cleanCode);
      localStorage.setItem('bbs_promo_code', cleanCode);
      return true;
    }
    return false;
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscount(0);
    localStorage.removeItem('bbs_promo_code');
  };

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce((total, item) => {
    const price = item.product.promoPrice || item.product.price;
    return total + price * item.quantity;
  }, 0);

  // Calculate discount based on active promo code
  useEffect(() => {
    if (promoCode === 'SALMA10' || promoCode === 'BBS10') {
      setDiscount(Math.round(subtotal * 0.10));
    } else if (promoCode === 'BEAUTE15') {
      setDiscount(Math.round(subtotal * 0.15));
    } else {
      setDiscount(0);
    }
  }, [subtotal, promoCode]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        toggleCart: () => setIsOpen(prev => !prev),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        discount,
        promoCode,
        applyPromoCode,
        removePromoCode
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
