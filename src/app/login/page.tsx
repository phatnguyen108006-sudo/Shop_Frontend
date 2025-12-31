"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "@/app/features/auth/schemas";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react"; 
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ 
    resolver: zodResolver(loginSchema), 
    mode: "onChange" 
  });

  async function onSubmit(values: LoginValues) {
    setServerMsg(null);
    
    try {
      const data: any = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      });

      // Nếu chạy đến đây nghĩa là đăng nhập thành công (apiFetch tự ném lỗi nếu thất bại)
      if (data) {
        // Lưu token vào localStorage
        const token = data.accessToken || data.token;
        localStorage.setItem("token", token);

        const userInfo = {
            name: data.name || data.user?.name,
            email: data.email || data.user?.email,
            role: data.role || data.user?.role
        };

        localStorage.setItem("user", JSON.stringify(userInfo));
        localStorage.setItem("role", userInfo.role);

        // Chuyển hướng
        window.location.href = userInfo.role === 'admin' ? '/admin' : '/';
      }

    } catch (error: any) {
      console.error(error);
      // Hiển thị lỗi từ server trả về (apiFetch đã xử lý message rồi)
      setServerMsg(error.message || "Đăng nhập thất bại");
    }
  }

  // --- PHẦN GIAO DIỆN ---
  return (
    <div className="min-h-[calc(100vh-80px)] flex bg-white font-sans">
      
      {/* 🟢 CỘT TRÁI: FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 animate-in slide-in-from-left-10 duration-700">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Chào mừng trở lại</h1>
            <p className="text-gray-500 text-lg">Đăng nhập để quản lý hệ thống BTCK.</p>
          </div>

          {/* Hiển thị lỗi Server nếu có */}
          {serverMsg && (
            <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl text-center border border-red-100 flex items-center justify-center gap-2 animate-in fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {serverMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Input Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                <input 
                  type="email"
                  placeholder="admin@example.com"
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-xl outline-none transition-all
                    ${errors.email 
                      ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50" 
                      : "border-transparent focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                    }`}
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-sm text-red-600 font-medium ml-1">{errors.email.message}</p>}
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">Mật khẩu</label>
                <Link href="#" className="text-xs text-gray-500 hover:text-black font-medium underline decoration-gray-300">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border rounded-xl outline-none transition-all
                    ${errors.password 
                      ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50" 
                      : "border-transparent focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                    }`}
                  {...register("password")}
                />
                {/* Nút ẩn hiện mật khẩu */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600 font-medium ml-1">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-black text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" /> Đang xử lý...
                </>
              ) : (
                <>Đăng nhập <ArrowRight size={20} /></>
              )}
            </button>

            <p className="text-center text-gray-500 mt-8">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="font-bold text-black hover:underline underline-offset-4">
                Đăng ký ngay
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* 🔴 CỘT PHẢI: HÌNH ẢNH */}
      <div className="hidden lg:block w-1/2 relative bg-gray-100">
        <Image 
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop" 
          alt="Fashion Login" 
          fill 
          className="object-cover" 
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="absolute bottom-16 left-16 text-white max-w-lg z-10">
          <blockquote className="text-3xl md:text-4xl font-sans font-bold leading-tight mb-6 drop-shadow-lg">
            "Phong cách là cách đơn giản nhất để nói những điều phức tạp"
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="h-0.5 w-10 bg-white"></div>
            <p className="font-bold text-base uppercase drop-shadow-md">BTCK Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}