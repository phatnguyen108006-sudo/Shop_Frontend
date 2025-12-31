"use client";

import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "@/services/products"; // Import hàm từ Service (đã tạo ở bài trước)

export default function NewProductPage() {
  return (
    <ProductForm 
      title="Thêm sản phẩm mới"
      onSubmit={createProduct} 
    />
  );
}