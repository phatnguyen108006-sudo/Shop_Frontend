"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getProductBySlug, updateProduct } from "@/services/products"; 

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (params.id) {
        const data = await getProductBySlug(params.id as string);
        setProduct(data);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [params.id]);

  if (loading) return <div className="text-center p-10 text-gray-500">Đang tải dữ liệu...</div>;
  if (!product) return <div className="text-center p-10 text-red-500">Không tìm thấy sản phẩm.</div>;

  return (
    <ProductForm 
      title="Chỉnh sửa sản phẩm"
      initialData={product} 
      onSubmit={(data) => updateProduct(params.id as string, data)} 
    />
  );
}