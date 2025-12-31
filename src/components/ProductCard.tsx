"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/features/cart/cart-context"; // 1. Import Context
import { ShoppingCart } from "lucide-react"; // Import Icon giỏ hàng

// Giữ nguyên định dạng tiền tệ
import { formatVND } from "@/lib/format"; 

export interface Product {
  _id?: string; // Đánh dấu là optional để tránh lỗi TypeScript nếu thiếu
  id?: string;  // Thêm trường id dự phòng
  title: string;
  price: number;
  images: string[];
  category: string;
  slug: string;
  stock?: number;
  brand?: string;
  rating?: number;
  description?: string;
}

export type ProductCardProps = { product: Product };

export default function ProductCard({ product }: ProductCardProps) {
  // 2. Lấy hàm addToCart từ Context
  const { addToCart } = useCart();
  
  const { title, price, slug, images, stock } = product;

  // 🔥 QUAN TRỌNG: Lấy ID một cách an toàn nhất (ưu tiên _id, nếu không có thì lấy id)
  const productId = product._id || product.id; 
  
  const imageSrc = (Array.isArray(images) && images.length > 0 && images[0].startsWith("http"))
    ? images[0] 
    : "https://placehold.co/400x400?text=No+Image";

  const isOutOfStock = (stock ?? 0) <= 0;
  
  // Sửa href: Nếu không có slug thì dùng ID
  const href = `/shop/${slug || productId}`; 

  // 3. Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn không cho thẻ Link chạy
    e.stopPropagation();

    if (!productId) {
      alert("Lỗi: Sản phẩm này không có ID hợp lệ!");
      console.error("Missing ID for product:", product);
      return;
    }

    addToCart({
      id: productId,           // ✅ Dùng ID đã chuẩn hóa
      name: title,             
      price: price,
      image: imageSrc,
      slug: slug || productId, // Dùng ID làm slug dự phòng nếu thiếu
      quantity: 1
    });
  };

  return (
    <div className="group border rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 flex flex-col h-full relative">
      <Link href={href} className="flex-1 block cursor-pointer">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image 
            src={imageSrc} 
            alt={title} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={true} 
          />
          {isOutOfStock && (
            <span className="absolute left-2 top-2 text-xs font-bold bg-gray-900 text-white px-2 py-1 rounded z-10 opacity-90">
              Hết hàng
            </span>
          )}
        </div>

        <div className="p-3 pb-0">
          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="mt-2 font-bold text-lg text-gray-900">
            {typeof formatVND === 'function' 
              ? formatVND(price) 
              : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
            }
          </p>
        </div>
      </Link>

      {/* 4. Nút Thêm vào giỏ hàng trực tiếp */}
      <div className="p-3 mt-auto">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-200 ${
            isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800 active:scale-[0.98]"
          }`}
        >
          <ShoppingCart size={18} />
          {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
        </button>
      </div>
    </div>
  );
}