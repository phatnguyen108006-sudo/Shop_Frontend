import type { Product } from "@/types/product";

const COLORS = ["Đen", "Trắng", "Xanh", "Be", "Nâu"];
const SIZES = ["S", "M", "L", "XL"];
const BRANDS = ["NaggiHunter", "SatNhanDaDen", "QuaiVatDaMau", "Nige"];
const sp=["Áo","Quần"];
export const PRODUCTS: Product[] = Array.from({ length: 30 }, (_, i) => {
  const n = i + 1;
  return {
    _id: `p${n}`,
    title: sp[n % sp.length],
    slug: `san-pham-${n}`,
    price: 99000 + n * 10000,
    images: [`/IMAGES/${i + 1 <= 4 ? i + 1 : 1}.png`],    
    stock: n % 7 === 0 ? 0 : ((n * 3) % 21) + 1,
    rating: (n % 5) + 1,
    brand: BRANDS[n % BRANDS.length],
    variants: [{ color: COLORS[n % COLORS.length], size: SIZES[n % SIZES.length] }],
    description: "Tự tìm hiểu",
    category: n % 2 ? "fashion" : "accessories",
  } satisfies Product;
});