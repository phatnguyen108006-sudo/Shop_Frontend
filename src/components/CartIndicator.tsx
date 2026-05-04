"use client";

import Link from "next/link";
import { useCart } from "@/features/cart/cart-context";

export default function CartIndicator() {
  const { totalItems, hydrated } = useCart();
  const count = hydrated ? totalItems : 0;

  return (
    <Link href="/cart" className="relative rounded-lg px-3 py-2 hover:underline">
      Cart
      <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-xs text-white">
        {count}
      </span>
    </Link>
  );
}
