"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/features/cart/cart-context";

// Hàm format tiền tệ (nên đưa vào thư viện chung sau này)
function formatVND(n: number) {
  return n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export default function CartPage() {
  // 1. Dùng các hàm từ Context
  const { items, removeFromCart, addToCart, clearCart, totalPrice } = useCart();
   
  // 2. Xử lý Hydration
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null; // Hoặc một component Loading đẹp mắt

  const shipping = 0; // Miễn phí vận chuyển
  const finalTotal = totalPrice + shipping;

  return (
    <main className="max-w-6xl mx-auto py-10 px-4 font-sans min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Giỏ hàng của bạn</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <p className="text-xl text-gray-500 mb-6 font-medium">Giỏ hàng đang trống trơn.</p>
          <Link 
            className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition font-medium shadow-md hover:shadow-lg" 
            href="/shop"
          >
            Mua sắm ngay →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           
          {/* DANH SÁCH SẢN PHẨM */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((it) => (
              <div key={it.id} className="flex gap-4 border p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow relative group">
                 
                {/* Ảnh sản phẩm */}
                <div className="relative w-24 h-24 flex-shrink-0 border rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={it.image && it.image.startsWith("http") ? it.image : "/placeholder.png"}
                    alt={it.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Thông tin */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 pr-8">
                      <Link href={`/shop/${it.slug || "#"}`} className="font-semibold text-lg hover:text-blue-600 line-clamp-2 text-gray-800">
                        {it.name}
                      </Link>
                    </div>
                    <p className="text-blue-600 font-bold text-base mt-1">{formatVND(it.price)}</p>
                  </div>

                  {/* Bộ chỉnh số lượng */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      {/* 👇 NÚT TRỪ: Tạm thời disable khi số lượng = 1 */}
                      <button 
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        // onClick={() => decreaseQuantity(it.id)} // Sau này sẽ dùng hàm này
                        disabled={it.quantity <= 1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                        </svg>
                      </button>
                      <span className="w-10 text-center text-sm font-semibold bg-white text-gray-800">{it.quantity}</span>
                      {/* NÚT CỘNG */}
                      <button 
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
                        onClick={() => addToCart(it)} // Hàm này sẽ tự động cộng dồn
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                        </svg>
                      </button>
                    </div>
                    
                    <p className="font-bold text-gray-800">
                       {formatVND(it.price * it.quantity)}
                    </p>
                  </div>
                </div>

                {/* Nút Xóa (X) nằm góc trên phải */}
                <button 
                   onClick={() => removeFromCart(it.id)}
                   className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition p-1 bg-gray-50 rounded-full hover:bg-red-50"
                   title="Xóa sản phẩm"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                   </svg>
                </button>

              </div>
            ))}
          </div>

          {/* TÓM TẮT ĐƠN HÀNG */}
          <aside className="h-fit border rounded-xl p-6 bg-white shadow-sm sticky top-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Tóm tắt đơn hàng</h2>
             
            <div className="space-y-3 text-gray-600 mb-6 border-b border-gray-100 pb-6">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span className="font-medium text-gray-900">{formatVND(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-green-600">Miễn phí</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-800">Tổng cộng</span>
              <span className="text-2xl font-bold text-blue-600">{formatVND(finalTotal)}</span>
            </div>

            {/* Nút Thanh toán */}
            <Link href="/checkout" className="block w-full">
              <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg transform active:scale-[0.99] flex justify-center items-center gap-2">
                TIẾN HÀNH THANH TOÁN
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </button>
            </Link>

            <button 
              className="mt-4 w-full text-gray-500 text-sm hover:text-red-600 hover:underline transition flex justify-center items-center gap-1"
              onClick={() => {
                if(confirm("Bạn có chắc muốn xóa hết giỏ hàng?")) {
                    clearCart();
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Xóa toàn bộ giỏ hàng
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}