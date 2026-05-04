import type { Product } from "@/types/product";

const COLLECTIONS = [
  "Aurora",
  "Celeste",
  "Lumiere",
  "Opaline",
  "Velvet Dawn",
  "Golden Hour",
  "Noir Muse",
  "Maison Pearl",
  "Silk Halo",
  "Rosette",
  "Solstice",
  "Moonline",
];

const PRODUCT_TYPES = [
  { singular: "Nhan", plural: "rings", sizeOptions: ["5", "6", "7", "8"] },
  { singular: "Day chuyen", plural: "necklaces", sizeOptions: ["40cm", "45cm", "50cm"] },
  { singular: "Vong tay", plural: "bracelets", sizeOptions: ["15cm", "16cm", "17cm"] },
  { singular: "Hoa tai", plural: "earrings", sizeOptions: ["Stud", "Drop", "Hoop"] },
  { singular: "Mat day chuyen", plural: "pendants", sizeOptions: ["Classic", "Mirror", "Matte"] },
  { singular: "Ghim cai ao", plural: "brooches", sizeOptions: ["Polished", "Brushed", "Satin"] },
];

const MATERIALS = ["Vang 18K", "Vang hong", "Bac 925", "Bach kim"];
const GEMSTONES = ["Ngoc trai", "Kim cuong", "Sapphire", "Emerald", "Moissanite", "Topaz"];
const FINISHES = ["Champagne", "Ivory", "Midnight", "Rose", "Honey", "Pearl"];
const BRANDS = ["Trang Sức Atelier", "Lustre House", "Maison Aura", "Vera Fine"];
const COLORS = ["Vang", "Hong", "Bac", "Trang ngoc"];
const IMAGE_SET = [
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1543295204-8e6d2d5fcb7a?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1617038260897-8e7d35f1b4f8?q=80&w=1200&auto=format&fit=crop",
];

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const PRODUCTS: Product[] = Array.from({ length: 300 }, (_, i) => {
  const n = i + 1;
  const collection = COLLECTIONS[i % COLLECTIONS.length];
  const type = PRODUCT_TYPES[i % PRODUCT_TYPES.length];
  const material = MATERIALS[i % MATERIALS.length];
  const gemstone = GEMSTONES[(i * 2) % GEMSTONES.length];
  const finish = FINISHES[(i * 3) % FINISHES.length];
  const brand = BRANDS[i % BRANDS.length];
  const title = `${type.singular} ${collection} ${gemstone} ${String(n).padStart(3, "0")}`;

  return {
    _id: `jewel-${String(n).padStart(3, "0")}`,
    title,
    slug: slugify(title),
    price: 1450000 + n * 85000,
    images: [IMAGE_SET[i % IMAGE_SET.length]],
    stock: n % 17 === 0 ? 0 : 4 + (n % 18),
    rating: 4 + ((n % 10) / 10),
    brand,
    variants: [
      { color: COLORS[i % COLORS.length], size: type.sizeOptions[i % type.sizeOptions.length] },
      { color: COLORS[(i + 1) % COLORS.length], size: type.sizeOptions[(i + 1) % type.sizeOptions.length] },
    ],
    description: `${type.singular} thuoc dong ${collection}, hoan thien ${material} voi diem nhan ${gemstone} va sac do ${finish}, phu hop cho phong cach thanh lich hien dai.`,
    category: type.plural,
  } satisfies Product;
});
