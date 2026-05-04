"use client";

import { useCart } from "@/features/cart/cart-context";

interface ProductInput {
  _id: string;
  title: string;
  price: number;
  images: string[];
  slug: string;
  category?: string;
  stock?: number;
}

interface AddToCartButtonProps {
  product: ProductInput;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export default function AddToCartButton({
  product,
  disabled,
  fullWidth = true,
  className = "",
}: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    addToCart({
      id: product._id,
      name: product.title,
      price: product.price,
      image: product.images?.[0] || "",
      quantity: 1,
      slug: product.slug,
    });
  };

  const base =
    "rounded-full border border-[var(--border-strong)] bg-[var(--foreground)] text-[var(--background)] hover:-translate-y-0.5 hover:bg-[var(--accent-deep)] disabled:cursor-not-allowed disabled:border-[var(--border-soft)] disabled:bg-[rgba(255,250,243,0.55)] disabled:text-[var(--muted)] transition-all font-semibold uppercase tracking-[0.24em]";
  const width = fullWidth ? "w-full" : "px-6";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleAddToCart}
      className={`${base} ${width} ${className}`}
      aria-disabled={disabled}
    >
      {disabled ? "Hết hàng" : "Thêm vào giỏ"}
    </button>
  );
}
