"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight, Truck, RefreshCw, Headset, Star } from "lucide-react";
import { useCart } from "@/features/cart/cart-context"; 
import { apiFetch } from "@/lib/api"; 

// Format tiền tệ
const formatVND = (n: number) => n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

// Định nghĩa kiểu dữ liệu Product
interface Product {
  _id: string;
  id?: string; // Dự phòng trường hợp backend trả về id thay vì _id
  title: string;
  price: number;
  images: string[];
  category: string;
  slug: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data: any = await apiFetch("/products?limit=4&sort=-createdAt");
        if (data.data) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#F3F4F6] rounded-3xl overflow-hidden mx-auto max-w-7xl mt-4 sm:mt-8">
        <div className="container px-6 py-16 md:py-24 mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 text-center md:text-left animate-in slide-in-from-left-8 duration-700">
            <span className="inline-block px-4 py-1.5 bg-black text-white rounded-full text-xs font-bold tracking-widest uppercase mb-2">
              New Collection 2024
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Định hình <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                Phong cách riêng
              </span>
            </h1>
            <p className="text-lg text-gray-500 max-w-lg mx-auto md:mx-0">
              Khám phá bộ sưu tập Thu-Đông mới nhất. Chất liệu cao cấp, thiết kế tối giản nhưng đầy tinh tế.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <Link href="/shop" className="px-8 py-4 bg-black text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                Mua sắm ngay <ArrowRight size={20} />
              </Link>
            </div>
          </div>
          <div className="flex-1 relative animate-in zoom-in duration-700">
            <div className="relative w-full aspect-[4/5] md:aspect-square">
              <Image 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop" 
                alt="Fashion Model" fill className="object-cover rounded-2xl shadow-2xl" priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES */}
      <section className="py-16 container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard icon={<Truck size={32} className="text-black" />} title="Miễn phí vận chuyển" desc="Cho đơn hàng từ 500k" />
          <FeatureCard icon={<RefreshCw size={32} className="text-black" />} title="Đổi trả miễn phí" desc="Trong vòng 30 ngày" />
          <FeatureCard icon={<Star size={32} className="text-black" />} title="Chất lượng cam kết" desc="Vải cao cấp 100%" />
          <FeatureCard icon={<Headset size={32} className="text-black" />} title="Hỗ trợ 24/7" desc="Tư vấn size & phối đồ" />
        </div>
      </section>

      {/* 3. SẢN PHẨM TỪ BACKEND */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Sản phẩm Trending</h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            Những mẫu thiết kế được yêu thích nhất vừa cập bến kho BTCK.
          </p>

          {/* Loading State */}
          {loading && (
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
             </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              Hiện chưa có sản phẩm nào. Hãy thêm từ Admin Panel.
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div key={product._id || product.id || index} className="group cursor-pointer">
                <Link href={`/shop/${product.slug || product._id}`}>
                  <div className="relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-4">
                    <Image 
                      src={product.images?.[0] || "/placeholder.png"} 
                      alt={product.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                           id: product._id || product.id || "",
                           name: product.title,
                           price: product.price,
                           image: product.images?.[0] || "",
                           quantity: 1,
                           maxStock: 99
                        });
                        alert("Đã thêm vào giỏ!");
                      }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full text-sm font-bold shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 w-[90%] whitespace-nowrap hover:bg-black hover:text-white"
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </Link>

                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide truncate">{product.category}</p>
                <Link href={`/shop/${product.slug || product._id}`}>
                  <h3 className="font-bold text-gray-900 truncate text-lg hover:text-blue-600 transition">{product.title}</h3>
                </Link>
                <p className="text-gray-900 font-medium mt-1">{formatVND(product.price)}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/shop" className="inline-block px-10 py-3 bg-white border-2 border-black text-black rounded-full font-bold hover:bg-black hover:text-white transition-all uppercase tracking-wide text-sm">
              Xem toàn bộ
            </Link>
          </div>
        </div>
      </section>

      {/* 4. PROMO BANNER */}
      <section className="py-10 container mx-auto max-w-7xl px-4 mb-10">
        <div className="bg-black rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-yellow-400 font-bold tracking-widest uppercase text-sm mb-2 block">Ưu đãi giới hạn</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-serif italic">Tham gia BTCK Club</h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8 text-lg">
              Đăng ký ngay để nhận voucher <span className="text-white font-bold border-b border-white">giảm giá 15%</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input type="email" placeholder="Email của bạn" className="px-6 py-4 rounded-full flex-1 focus:outline-none text-black" />
              <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors uppercase text-sm tracking-wider">
                Đăng ký
              </button>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <Image src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000" alt="Background" fill className="object-cover grayscale"/>
          </div>
        </div>
      </section>

    </div>
  );
}

// Sub Component: FeatureCard
function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="p-3 bg-gray-50 rounded-full text-black">{icon}</div>
      <div>
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
  );
}