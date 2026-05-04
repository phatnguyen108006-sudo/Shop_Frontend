"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  slug?: string;
};

type CartProductInput = {
  id?: string | number;
  _id?: string | number;
  name?: string;
  title?: string;
  price: number;
  image?: string;
  slug?: string;
  quantity?: number;
  maxStock?: number;
};

type CartContextType = {
  items: CartItem[];
  hydrated: boolean;
  addToCart: (product: CartProductInput) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("BTCK_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Lỗi đọc giỏ hàng", e);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("BTCK_cart", JSON.stringify(items));
  }, [items, hydrated]);

  const addToCart = (product: CartProductInput) => {
    setItems((prev) => {
      const productId = product.id || product._id;

      if (!productId) {
        console.error("Sản phẩm không có ID hợp lệ:", product);
        return prev;
      }

      const existing = prev.find((item) => item.id === productId);
      const quantityToAdd = product.quantity && product.quantity > 0 ? product.quantity : 1;

      if (existing) {
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + quantityToAdd } : item
        );
      }

      return [
        ...prev,
        {
          id: productId,
          name: product.name || product.title || "Sản phẩm",
          price: product.price,
          image: product.image,
          slug: product.slug,
          quantity: quantityToAdd,
        },
      ];
    });
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.id !== id);
      }

      return prev.map((item) => (item.id === id ? { ...item, quantity } : item));
    });
  };

  const removeFromCart = (id: string | number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("BTCK_cart");
  };

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, hydrated, addToCart, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
