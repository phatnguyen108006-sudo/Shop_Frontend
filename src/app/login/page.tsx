"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "@/app/features/auth/schemas";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { loginService } from "@/services/auth";

export default function LoginPage() {
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  async function onSubmit(values: LoginValues) {
    setServerMsg(null);

    try {
      const data: any = await loginService(values.email, values.password);

      if (data) {
        const token = data.accessToken || data.token;
        localStorage.setItem("token", token);

        const userInfo = {
          name: data.name || data.user?.name,
          email: data.email || data.user?.email,
          role: data.role || data.user?.role,
        };

        localStorage.setItem("user", JSON.stringify(userInfo));
        localStorage.setItem("role", userInfo.role);

        window.location.href = userInfo.role === "admin" ? "/admin" : "/";
      }
    } catch (error: any) {
      console.error(error);
      setServerMsg(error.message || "Đăng nhập thất bại");
    }
  }

  return (
    <div className="min-h-[calc(100vh-92px)] bg-transparent">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-2">
        <div className="luxury-panel order-2 flex items-center justify-center rounded-[40px] p-8 lg:order-1 lg:p-14">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-[0.42em] text-[var(--accent-deep)]">Không gian thành viên</p>
              <h1 className="luxury-title mt-4 text-5xl text-[var(--foreground)]">Chào mừng trở lại</h1>
              <p className="mt-3 text-lg text-[var(--muted)]">Đăng nhập để tiếp tục theo dõi đơn hàng và lưu những thiết kế bạn yêu thích.</p>
            </div>

            {serverMsg && (
              <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
                {serverMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--foreground)]">Email</label>
                <div className="group relative">
                  <Mail className="absolute left-4 top-4 text-[var(--muted)] group-focus-within:text-[var(--accent-deep)]" size={20} />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className={`w-full rounded-full border bg-[rgba(255,250,243,0.7)] py-4 pl-12 pr-4 outline-none transition-all ${
                      errors.email
                        ? "border-red-300 bg-red-50 focus:border-red-500"
                        : "border-[var(--border-soft)] focus:border-[var(--border-strong)]"
                    }`}
                    {...register("email")}
                  />
                </div>
                {errors.email && <p className="ml-1 text-sm font-medium text-red-600">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--foreground)]">Mật khẩu</label>
                  <Link href="#" className="text-xs text-[var(--muted)] hover:text-[var(--accent-deep)]">
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="group relative">
                  <Lock className="absolute left-4 top-4 text-[var(--muted)] group-focus-within:text-[var(--accent-deep)]" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full rounded-full border bg-[rgba(255,250,243,0.7)] py-4 pl-12 pr-12 outline-none transition-all ${
                      errors.password
                        ? "border-red-300 bg-red-50 focus:border-red-500"
                        : "border-[var(--border-soft)] focus:border-[var(--border-strong)]"
                    }`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-[var(--muted)] hover:text-[var(--accent-deep)]"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="ml-1 text-sm font-medium text-red-600">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--foreground)] py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--background)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-deep)] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" /> Đang xử lý...
                  </>
                ) : (
                  <>Đăng nhập <ArrowRight size={18} /></>
                )}
              </button>

              <p className="text-center text-[var(--muted)]">
                Chưa có tài khoản?{" "}
                <Link href="/register" className="font-semibold text-[var(--accent-deep)] hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
            </form>
          </div>
        </div>

        <div className="order-1 relative min-h-[360px] overflow-hidden rounded-[40px] lg:order-2">
          <Image
            src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1200&auto=format&fit=crop"
            alt="Trang sức cao cấp"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,19,15,0.64)] via-[rgba(26,19,15,0.2)] to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-[#fff6e7]">
            <p className="text-[11px] uppercase tracking-[0.42em] text-[#d4b27c]">Trang Sức Private Access</p>
            <blockquote className="luxury-title mt-4 text-4xl leading-tight md:text-5xl">
              “Một thiết kế tinh tế luôn bắt đầu từ cảm xúc được lựa chọn đúng.”
            </blockquote>
            <p className="mt-4 text-sm uppercase tracking-[0.26em] text-[#d8c5aa]">Trang Sức</p>
          </div>
        </div>
      </div>
    </div>
  );
}
