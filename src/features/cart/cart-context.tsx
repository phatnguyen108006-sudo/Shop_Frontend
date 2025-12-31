"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Định nghĩa kiểu dữ liệu sản phẩm trong giỏ
export type CartItem = {
  id: string | number; 
  name: string;
  price: number;
  image?: string;
  quantity: number;
  slug?: string;
};

// Định nghĩa những gì Context cung cấp
type CartContextType = {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
  totalPrice: number;    
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load từ localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("BTCK_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Lỗi đọc giỏ hàng", e);
      }
    }
  }, []);

  // Lưu vào localStorage
  useEffect(() => {
    localStorage.setItem("BTCK_cart", JSON.stringify(items));
  }, [items]);

  // 👇👇👇 HÀM ĐÃ SỬA LỖI 👇👇👇
  const addToCart = (product: any) => {
    setItems((prev) => {
      // 1. CHUẨN HÓA ID:
      // Sản phẩm từ API MongoDB thường có _id, trong khi giỏ hàng dùng id.
      // Ta ưu tiên lấy id, nếu không có thì lấy _id làm id.
      const productId = product.id || product._id;

      if (!productId) {
        console.error("Sản phẩm không có ID hợp lệ:", product);
        return prev;
      }

      // 2. Tìm xem sản phẩm đã có trong giỏ chưa (so sánh bằng ID chuẩn hóa)
      const existing = prev.find((item) => item.id === productId);

      if (existing) {
        // Nếu đã có -> Tăng số lượng
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      // 3. Nếu chưa có -> Thêm mới (và nhớ gán thuộc tính id chính thức)
      return [
        ...prev, 
        { 
            ...product, 
            id: productId, // Quan trọng: Gán id chuẩn để lần sau so sánh
            quantity: 1 
        }
      ];
    });
  };
  // 👆👆👆 KẾT THÚC SỬA LỖI 👆👆👆

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
      value={{ items, addToCart, removeFromCart, clearCart, totalPrice, totalItems }}
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