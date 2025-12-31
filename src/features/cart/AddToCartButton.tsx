"use client";

import { useCart } from "@/features/cart/cart-context";

interface ProductInput {
  _id: string; // Lưu ý: Backend bạn trả về _id hay id thì sửa ở đây cho khớp
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
  
  // 1. SỬA: Lấy hàm addToCart thay vì dispatch
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài (nếu nút nằm trong thẻ Link)
    
    if (disabled) return;

    // 2. Chuẩn bị dữ liệu (Map từ ProductInput sang CartItem)
    const cartItem = {
      id: product._id,       // CartContext cần 'id'
      name: product.title,   // CartContext cần 'name'
      price: product.price,
      image: product.images?.[0] || "", 
      quantity: 1,
      slug: product.slug,
    };

    // 3. SỬA: Gọi hàm trực tiếp
    addToCart(cartItem);

    // (Tùy chọn) Thêm thông báo hoặc hiệu ứng rung nhẹ ở đây nếu muốn
    // alert("Đã thêm sản phẩm vào giỏ!");
  };

  const base = "h-10 text-sm rounded-md border hover:bg-gray-50 disabled:opacity-40 transition-colors font-medium";
  const width = fullWidth ? "w-full" : "px-4";

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