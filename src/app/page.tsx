"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, Gem, ShieldCheck, Sparkles, Gift } from "lucide-react";
import { useCart } from "@/features/cart/cart-context";
import { apiFetch } from "@/lib/api";
import NewsletterSignup from "@/components/NewsletterSignup";

const formatVND = (n: number) => n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

interface Product {
  _id: string;
  id?: string;
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
    <div className="pb-12">
      <section className="mx-auto mt-4 max-w-7xl px-4 sm:mt-8">
        <div className="luxury-panel luxury-shell overflow-hidden rounded-[40px] px-6 py-8 md:px-10 md:py-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-2xl space-y-6">
              <span className="inline-flex rounded-full border border-[var(--border-strong)] bg-[rgba(255,250,243,0.72)] px-4 py-2 text-[11px] uppercase tracking-[0.42em] text-[var(--accent-deep)]">
                Không gian trang sức cao cấp
              </span>
              <h1 className="luxury-title text-5xl font-semibold leading-none text-[var(--foreground)] md:text-7xl">
                Tinh hoa trang sức dành cho phong cách sống sang trọng.
              </h1>
              <p className="max-w-xl text-base leading-8 text-[var(--muted)] md:text-lg">
                Khám phá bộ sưu tập nhẫn, dây chuyền và vòng tay được chọn lọc để tôn lên nét thanh lịch, nửa cổ điển nửa đương đại.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.26em] text-[var(--background)] hover:-translate-y-0.5 hover:bg-[var(--accent-deep)]"
                >
                  Khám phá bộ sưu tập <ArrowRight size={18} />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--border-strong)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.26em] text-[var(--foreground)] hover:bg-[rgba(157,122,69,0.08)]"
                >
                  Câu chuyện atelier
                </Link>
              </div>
              <div className="grid gap-4 pt-4 sm:grid-cols-3">
                <StatCard value="500+" label="Thiết kế được tuyển chọn" />
                <StatCard value="18K" label="Chất liệu vàng cao cấp" />
                <StatCard value="1:1" label="Tư vấn riêng theo lịch" />
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[32px]">
                <Image
                  src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1200&auto=format&fit=crop"
                  alt="Không gian trưng bày trang sức sang trọng"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,19,15,0.3)] via-transparent to-transparent" />
              </div>
              <div className="luxury-panel absolute -bottom-6 -left-4 max-w-xs rounded-[28px] p-5 md:-left-8">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--accent-deep)]">Tuyển chọn biên tập</p>
                <h2 className="luxury-title mt-3 text-3xl text-[var(--foreground)]">Golden Hour Capsule</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Những thiết kế tối giản được nhấn bằng hoàn thiện vàng champagne và đá sáng tôn da.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <FeatureCard icon={<Gem size={26} />} title="Đá quý tuyển chọn" desc="Mỗi mẫu được chọn để đạt độ sáng và màu sắc đồng đều." />
          <FeatureCard icon={<ShieldCheck size={26} />} title="Chứng nhận rõ ràng" desc="Thông tin chất liệu và bảo hành được cung cấp minh bạch." />
          <FeatureCard icon={<Sparkles size={26} />} title="Hoàn thiện thủ công" desc="Đánh bóng tinh xảo để mang lại cảm giác cao cấp khi đeo." />
          <FeatureCard icon={<Gift size={26} />} title="Gói quà sang trọng" desc="Hộp quà và thiệp chúc mừng được thiết kế cho dịp đặc biệt." />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="luxury-panel rounded-[36px] p-8 md:p-10">
            <p className="text-[11px] uppercase tracking-[0.42em] text-[var(--accent-deep)]">Triết lý thiết kế</p>
            <h2 className="luxury-title mt-4 text-4xl font-semibold text-[var(--foreground)] md:text-5xl">
              Nét đẹp không cần phát biểu lớn vẫn để lại ấn tượng.
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--muted)]">
              Chúng tôi theo đuổi ngôn ngữ thiết kế tiết chế, tập trung vào tỉ lệ, ánh kim ấm và khả năng phối cùng trang phục thường ngày.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--border-soft)]" />
              <span className="text-[11px] uppercase tracking-[0.35em] text-[var(--muted)]">Quiet luxury</span>
              <div className="h-px flex-1 bg-[var(--border-soft)]" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <EditorialCard
              title="Nâng tầm quà tặng"
              desc="Chọn những món quà tinh tế cho sinh nhật, kỷ niệm và những khoảnh khắc cá nhân."
              image="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop"
            />
            <EditorialCard
              title="Đeo hằng ngày"
              desc="Những thiết kế mỏng nhẹ, dễ phối và giữ được vẻ thanh lịch trong mỗi ngày."
              image="https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1000&auto=format&fit=crop"
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <p className="text-[11px] uppercase tracking-[0.42em] text-[var(--accent-deep)]">Thiết kế được yêu thích</p>
            <h2 className="luxury-title mt-4 text-4xl font-semibold text-[var(--foreground)] md:text-5xl">
              Tuyển chọn nổi bật dành cho gu thẩm mỹ tinh tế
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
              Những mẫu thiết kế nổi bật với tỉ lệ đẹp, tông màu ấm và khả năng phối hợp với nhiều phong cách.
            </p>
          </div>

          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-[28px] bg-[rgba(157,122,69,0.12)] animate-pulse" />
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="py-10 text-center text-[var(--muted)]">Hiện chưa có sản phẩm nào. Hãy thêm từ trang quản trị.</div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <div key={product._id || product.id || index} className="group cursor-pointer">
                <Link href={`/shop/${product.slug || product._id}`}>
                  <div className="luxury-panel overflow-hidden rounded-[28px] p-3">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[22px]">
                      <Image
                        src={product.images?.[0] || "/placeholder.png"}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
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
                            maxStock: 99,
                          });
                          window.alert("Đã thêm vào giỏ!");
                        }}
                        className="absolute inset-x-4 bottom-4 rounded-full bg-[rgba(255,250,243,0.88)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--foreground)] opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100"
                      >
                        Thêm vào giỏ
                      </button>
                    </div>
                    <div className="px-2 pb-2 pt-4">
                      <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--muted)]">{product.category}</p>
                      <h3 className="luxury-title mt-2 text-2xl text-[var(--foreground)]">{product.title}</h3>
                      <p className="mt-2 text-base font-semibold text-[var(--accent-deep)]">{formatVND(product.price)}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-8 py-3 text-sm font-semibold uppercase tracking-[0.26em] text-[var(--foreground)] hover:bg-[rgba(157,122,69,0.08)]"
            >
              Xem toàn bộ <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8">
        <div className="overflow-hidden rounded-[40px] bg-[#1a130f] px-6 py-12 text-center md:px-12">
          <p className="text-[11px] uppercase tracking-[0.45em] text-[#a98a61]">Bản tin riêng tư</p>
          <h2 className="luxury-title mt-4 text-4xl font-semibold text-[#fff6e7] md:text-5xl">
            Nhận lookbook và lời mời xem bộ sưu tập mới
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#d8c5aa]">
            Đăng ký để nhận các gợi ý phong cách, bộ sưu tập mới và lịch hẹn xem riêng tại atelier.
          </p>
          <NewsletterSignup dark />
        </div>
      </section>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[26px] border border-[var(--border-soft)] bg-[rgba(255,250,243,0.58)] px-5 py-4">
      <p className="luxury-title text-3xl text-[var(--foreground)]">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.26em] text-[var(--muted)]">{label}</p>
    </div>
  );
}

function EditorialCard({ title, desc, image }: { title: string; desc: string; image: string }) {
  return (
    <div className="luxury-panel overflow-hidden rounded-[32px]">
      <div className="relative aspect-[4/5]">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-6">
        <h3 className="luxury-title text-3xl text-[var(--foreground)]">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{desc}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="luxury-panel rounded-[28px] p-6">
      <div className="mb-5 inline-flex rounded-full border border-[var(--border-soft)] bg-[rgba(255,250,243,0.7)] p-3 text-[var(--accent-deep)]">{icon}</div>
      <h3 className="luxury-title text-3xl text-[var(--foreground)]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{desc}</p>
    </div>
  );
}
