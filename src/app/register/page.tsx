"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Thêm Image
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterValues } from "@/app/features/auth/schemas";
// Import Icons cho đẹp
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

// Lấy URL từ biến môi trường
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export default function RegisterPage() {
  const router = useRouter();
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  
  // State để quản lý ẩn/hiện mật khẩu
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ 
    resolver: zodResolver(registerSchema), 
    mode: "onChange" 
  });

  async function onSubmit(values: RegisterValues) {
    setServerMsg(null);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error("Lỗi phản hồi từ Server (Không phải JSON)");
      }

      if (!res.ok) {
        const errorMsg = data.message || data.error?.message || "Đăng ký thất bại";
        setServerMsg(errorMsg);
        return;
      }

      // THÀNH CÔNG
      alert("Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.");
      router.push("/login");

    } catch (error: any) {
      console.error(error);
      setServerMsg("Không thể kết nối đến Server. Vui lòng kiểm tra lại đường truyền.");
    }
  }

  return (
    // Container chính: Trừ đi Header (80px) để vừa khít màn hình
    <div className="min-h-[calc(100vh-80px)] flex bg-white font-sans">
      
      {/* 🔴 CỘT TRÁI: HÌNH ẢNH (Ẩn trên Mobile) */}
      <div className="hidden lg:block w-1/2 relative bg-gray-100">
        <Image 
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop" 
          alt="Fashion Register" 
          fill 
          className="object-cover" 
          priority
        />
        {/* Lớp phủ tối để chữ dễ đọc */}
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="absolute bottom-16 left-16 text-white max-w-lg z-10">
          <blockquote className="text-3xl md:text-4xl font-sans font-bold leading-tight mb-6 drop-shadow-lg">
            "Thời trang có thể phai tàn, nhưng phong cách là mãi mãi."
          </blockquote>
          
          <div className="flex items-center gap-3">
             <div className="h-0.5 w-10 bg-white"></div>
             <p className="font-bold text-base uppercase drop-shadow-md">Yves Saint Laurent</p>
          </div>
        </div>
      </div>

      {/* 🟢 CỘT PHẢI: FORM ĐĂNG KÝ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 animate-in slide-in-from-right-10 duration-700">
        <div className="w-full max-w-md space-y-6">
          
          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Tạo tài khoản mới</h2>
            <p className="text-gray-500 text-lg">
              Trở thành thành viên của BTCK Club ngay hôm nay.
            </p>
          </div>

          {/* Thông báo lỗi Server */}
          {serverMsg && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-pulse">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-red-600 rotate-45" />
              <span>{serverMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Họ tên */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">Họ và tên</label>
              <div className="relative group">
                <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  disabled={isSubmitting}
                  className={`block w-full rounded-xl border pl-12 pr-4 py-3.5 outline-none transition-all
                    ${errors.name 
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                      : "border-transparent bg-gray-50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                    }`}
                  {...register("name")}
                />
              </div>
              {errors.name && <p className="ml-1 text-sm text-red-600 font-medium">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  disabled={isSubmitting}
                  className={`block w-full rounded-xl border pl-12 pr-4 py-3.5 outline-none transition-all
                    ${errors.email 
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                      : "border-transparent bg-gray-50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                    }`}
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="ml-1 text-sm text-red-600 font-medium">{errors.email.message}</p>}
            </div>

            {/* Mật khẩu */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">Mật khẩu</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className={`block w-full rounded-xl border pl-12 pr-12 py-3.5 outline-none transition-all
                    ${errors.password 
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                      : "border-transparent bg-gray-50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                    }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-black transition-colors"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="ml-1 text-sm text-red-600 font-medium">{errors.password.message}</p>}
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">Xác nhận mật khẩu</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className={`block w-full rounded-xl border pl-12 pr-12 py-3.5 outline-none transition-all
                    ${errors.confirmPassword 
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                      : "border-transparent bg-gray-50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                    }`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-black transition-colors"
                >
                  {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="ml-1 text-sm text-red-600 font-medium">{errors.confirmPassword.message}</p>}
            </div>

            {/* Button Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" /> Đang xử lý...
                </>
              ) : (
                <>Đăng Ký Ngay <ArrowRight size={20} /></>
              )}
            </button>

            {/* Footer Link */}
            <div className="text-center text-sm pt-2">
              <span className="text-gray-500">Đã có tài khoản? </span>
              <Link href="/login" className="font-bold text-black hover:underline underline-offset-4">
                Đăng nhập ngay
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}