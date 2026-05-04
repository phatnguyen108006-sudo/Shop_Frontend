"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterValues } from "@/app/features/auth/schemas";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  async function onSubmit(values: RegisterValues) {
    setServerMsg(null);
    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(values),
      });

      alert("Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.");
      router.push("/login");
    } catch (error: any) {
      console.error(error);
      setServerMsg(error.message || "Đăng ký thất bại. Vui lòng thử lại.");
    }
  }

  return (
    <div className="min-h-[calc(100vh-92px)] bg-transparent">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-2">
        <div className="relative min-h-[360px] overflow-hidden rounded-[40px]">
          <Image
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop"
            alt="Bộ sưu tập trang sức"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,19,15,0.64)] via-[rgba(26,19,15,0.2)] to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-[#fff6e7]">
            <p className="text-[11px] uppercase tracking-[0.42em] text-[#d4b27c]">Membership Invitation</p>
            <h2 className="luxury-title mt-4 text-4xl leading-tight md:text-5xl">Trở thành thành viên để lưu lại những lựa chọn yêu thích.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-[#d8c5aa]">
              Theo dõi đơn hàng, nhận lời mời xem bộ sưu tập mới và cập nhật lookbook từ atelier.
            </p>
          </div>
        </div>

        <div className="luxury-panel flex items-center justify-center rounded-[40px] p-8 lg:p-14">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-[0.42em] text-[var(--accent-deep)]">Tạo tài khoản</p>
              <h1 className="luxury-title mt-4 text-5xl text-[var(--foreground)]">Gia nhập Trang Sức</h1>
              <p className="mt-3 text-lg text-[var(--muted)]">Thiết lập tài khoản để bắt đầu trải nghiệm mua sắm riêng tư và tinh tế hơn.</p>
            </div>

            {serverMsg && (
              <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {serverMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Field
                label="Họ và tên"
                icon={<User size={20} className="text-[var(--muted)] group-focus-within:text-[var(--accent-deep)]" />}
                error={errors.name?.message}
              >
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  disabled={isSubmitting}
                  className={`w-full rounded-full border bg-[rgba(255,250,243,0.7)] py-4 pl-12 pr-4 outline-none transition-all ${
                    errors.name ? "border-red-300 bg-red-50 focus:border-red-500" : "border-[var(--border-soft)] focus:border-[var(--border-strong)]"
                  }`}
                  {...register("name")}
                />
              </Field>

              <Field
                label="Email"
                icon={<Mail size={20} className="text-[var(--muted)] group-focus-within:text-[var(--accent-deep)]" />}
                error={errors.email?.message}
              >
                <input
                  type="email"
                  placeholder="name@example.com"
                  disabled={isSubmitting}
                  className={`w-full rounded-full border bg-[rgba(255,250,243,0.7)] py-4 pl-12 pr-4 outline-none transition-all ${
                    errors.email ? "border-red-300 bg-red-50 focus:border-red-500" : "border-[var(--border-soft)] focus:border-[var(--border-strong)]"
                  }`}
                  {...register("email")}
                />
              </Field>

              <Field
                label="Mật khẩu"
                icon={<Lock size={20} className="text-[var(--muted)] group-focus-within:text-[var(--accent-deep)]" />}
                error={errors.password?.message}
              >
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className={`w-full rounded-full border bg-[rgba(255,250,243,0.7)] py-4 pl-12 pr-12 outline-none transition-all ${
                    errors.password ? "border-red-300 bg-red-50 focus:border-red-500" : "border-[var(--border-soft)] focus:border-[var(--border-strong)]"
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-4 text-[var(--muted)] hover:text-[var(--accent-deep)]"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </Field>

              <Field
                label="Xác nhận mật khẩu"
                icon={<Lock size={20} className="text-[var(--muted)] group-focus-within:text-[var(--accent-deep)]" />}
                error={errors.confirmPassword?.message}
              >
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className={`w-full rounded-full border bg-[rgba(255,250,243,0.7)] py-4 pl-12 pr-12 outline-none transition-all ${
                    errors.confirmPassword ? "border-red-300 bg-red-50 focus:border-red-500" : "border-[var(--border-soft)] focus:border-[var(--border-strong)]"
                  }`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 top-4 text-[var(--muted)] hover:text-[var(--accent-deep)]"
                >
                  {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </Field>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--foreground)] py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--background)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-deep)] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" /> Đang xử lý...
                  </>
                ) : (
                  <>Tạo tài khoản <ArrowRight size={18} /></>
                )}
              </button>

              <div className="text-center text-sm text-[var(--muted)]">
                Đã có tài khoản?{" "}
                <Link href="/login" className="font-semibold text-[var(--accent-deep)] hover:underline">
                  Đăng nhập ngay
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--foreground)]">{label}</label>
      <div className="group relative">
        <div className="absolute left-4 top-4">{icon}</div>
        {children}
      </div>
      {error && <p className="ml-1 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
