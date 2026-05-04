"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/features/cart/cart-context";
import { ShoppingBag } from "lucide-react";
import { formatVND } from "@/lib/format";

export interface Product {
  _id?: string;
  id?: string;
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
  const { addToCart } = useCart();
  const { title, price, slug, images, stock, category, brand } = product;

  const productId = product._id || product.id;
  const imageSrc =
    Array.isArray(images) && images.length > 0 && images[0].startsWith("http")
      ? images[0]
      : "https://placehold.co/400x400?text=No+Image";

  const isOutOfStock = (stock ?? 0) <= 0;
  const href = `/shop/${slug || productId}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productId) {
      alert("Lỗi: sản phẩm này không có ID hợp lệ.");
      console.error("Missing ID for product:", product);
      return;
    }

    addToCart({
      id: productId,
      name: title,
      price,
      image: imageSrc,
      slug: slug || productId,
      quantity: 1,
    });
  };

  return (
    <div className="group luxury-panel luxury-shell flex h-full flex-col overflow-hidden rounded-[28px] border border-[var(--border-soft)]">
      <Link href={href} className="flex-1 block cursor-pointer">
        <div className="relative aspect-[4/5] overflow-hidden bg-[rgba(255,250,243,0.7)]">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
          <div className="absolute inset-x-4 top-4 flex items-center justify-between">
            <span className="rounded-full border border-white/70 bg-[rgba(255,250,243,0.72)] px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[var(--accent-deep)] backdrop-blur">
              {brand || "Trang Sức Select"}
            </span>
            {isOutOfStock && (
              <span className="rounded-full bg-[var(--foreground)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--background)]">
                Hết hàng
              </span>
            )}
          </div>
        </div>

        <div className="p-5 pb-0">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--muted)]">{category || "Trang sức"}</p>
          <h3 className="luxury-title min-h-[3rem] pt-2 text-2xl font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent-deep)]">
            {title}
          </h3>
          <p className="mt-3 text-lg font-semibold text-[var(--accent-deep)]">{formatVND(price)}</p>
        </div>
      </Link>

      <div className="mt-auto p-5 pt-4">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full rounded-full border px-4 py-3 text-sm uppercase tracking-[0.24em] transition-all duration-200 ${
            isOutOfStock
              ? "cursor-not-allowed border-[var(--border-soft)] bg-[rgba(255,250,243,0.55)] text-[var(--muted)]"
              : "border-[var(--border-strong)] bg-[var(--foreground)] text-[var(--background)] hover:-translate-y-0.5 hover:bg-[var(--accent-deep)]"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <ShoppingBag size={16} />
            {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
          </span>
        </button>
      </div>
    </div>
  );
}
