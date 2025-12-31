"use client";

import {useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 1. Schema Validation (Giữ nguyên của bạn)
const formSchema = z.object({
  title: z.string().min(1, "Tên sản phẩm không được để trống"),
  price: z.coerce.number().min(1000, "Giá phải lớn hơn 1000đ"),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  imageLink: z.string().url("Link ảnh không hợp lệ"),
  description: z.string().optional(),
  stock: z.coerce.number().min(0, "Kho không được âm").default(0),
});

type FormValues = z.infer<typeof formSchema>;

// Định nghĩa Props để tái sử dụng
interface ProductFormProps {
  initialData?: any;          // Dữ liệu cũ (nếu sửa)
  onSubmit: (data: any) => Promise<boolean>; // Hàm xử lý API
  title: string;              // Tiêu đề trang
}

export default function ProductForm({ initialData, onSubmit, title }: ProductFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  // 2. Khởi tạo Form (Có xử lý dữ liệu cũ)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      price: initialData?.price || 0,
      category: initialData?.category || "Quần áo",
      imageLink: initialData?.images?.[0] || "",   
      description: initialData?.description || "",
      stock: initialData?.stock || 10,
    },
  });

  // 3. Xử lý Submit
  const onFormSubmit = async (values: FormValues) => {
    setServerError("");
    
    // Chuẩn hóa dữ liệu để gửi lên Server
    const payload = {
      ...values,
      images: [values.imageLink], // Backend cần mảng images
    };

    const success = await onSubmit(payload);

    if (success) {
      alert(`✅ ${initialData ? "Cập nhật" : "Thêm"} thành công!`);
      router.push("/admin/products");
      router.refresh();
    } else {
      setServerError("Có lỗi xảy ra khi lưu dữ liệu.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="p-2 bg-white border rounded-lg hover:bg-gray-50 transition">
           <ArrowLeft size={20}/>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        
        {/* Tên sản phẩm */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
          <input
            {...register("title")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Ví dụ: Áo thun Basic"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Giá */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ)</label>
            <input
              type="number"
              {...register("price")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
          </div>

          {/* Tồn kho */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho</label>
            <input
              type="number"
              {...register("stock")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
          </div>
        </div>

        {/* Danh mục */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
          <select
            {...register("category")}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Quần áo">Quần áo</option>
            <option value="Giày dép">Giày dép</option>
            <option value="Phụ kiện">Phụ kiện</option>
            <option value="Điện tử">Điện tử</option>
            <option value="Khác">Khác</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>

        {/* Link ảnh */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Link ảnh (URL)</label>
          <input
            {...register("imageLink")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="https://i.imgur.com/..."
          />
          <p className="text-xs text-gray-400 mt-1">* Copy link ảnh trên mạng dán vào đây</p>
          {errors.imageLink && <p className="text-red-500 text-sm mt-1">{errors.imageLink.message}</p>}
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
          <textarea
            {...register("description")}
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Mô tả về sản phẩm..."
          />
        </div>

        {/* Nút Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all flex justify-center items-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? "Đang xử lý..." : <><Save size={20}/> {initialData ? "Lưu thay đổi" : "Thêm sản phẩm"}</>}
        </button>

        {serverError && <p className="text-center text-red-600 font-medium bg-red-50 p-3 rounded-lg">{serverError}</p>}
      </form>
    </div>
  );
}