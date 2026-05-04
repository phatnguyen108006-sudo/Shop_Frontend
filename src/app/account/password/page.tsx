"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, type ChangePasswordValues } from "@/app/features/auth/schemas";
import { changePasswordService } from "@/services/auth";
import { Lock, Eye, EyeOff, KeyRound, Loader2, ArrowLeft } from "lucide-react";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  async function onSubmit(values: ChangePasswordValues) {
    setServerMsg(null);
    setSuccessMsg(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await changePasswordService(token, values) as { message?: string };
      setSuccessMsg(res.message || "Đổi mật khẩu thành công");
      reset();
    } catch (error: any) {
      setServerMsg(error.message || "Không thể đổi mật khẩu lúc này");
    }
  }

  return (
    <div className="min-h-[calc(100vh-92px)] px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="luxury-panel rounded-[36px] p-6 md:p-10">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.42em] text-[var(--accent-deep)]">Bảo mật tài khoản</p>
              <h1 className="luxury-title mt-3 text-4xl text-[var(--foreground)]">Thay đổi mật khẩu</h1>
              <p className="mt-3 max-w-xl text-[var(--muted)]">
                Mật khẩu chỉ được lưu dưới dạng băm bảo mật, nên cả quản trị viên cũng không thể xem lại mật khẩu hiện tại của bạn.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] px-4 py-2 text-sm text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
            >
              <ArrowLeft size={16} />
              Quay lại
            </Link>
          </div>

          {serverMsg && (
            <div className="mb-4 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {serverMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <PasswordField
              label="Mật khẩu hiện tại"
              placeholder="Nhập mật khẩu hiện tại"
              visible={showCurrent}
              onToggle={() => setShowCurrent((v) => !v)}
              error={errors.currentPassword?.message}
              register={register("currentPassword")}
              disabled={isSubmitting}
            />

            <PasswordField
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              visible={showNext}
              onToggle={() => setShowNext((v) => !v)}
              error={errors.newPassword?.message}
              register={register("newPassword")}
              disabled={isSubmitting}
            />

            <PasswordField
              label="Xác nhận mật khẩu mới"
              placeholder="Nhập lại mật khẩu mới"
              visible={showConfirm}
              onToggle={() => setShowConfirm((v) => !v)}
              error={errors.confirmPassword?.message}
              register={register("confirmPassword")}
              disabled={isSubmitting}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--foreground)] py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--background)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-deep)] disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <KeyRound size={18} />
                  Cập nhật mật khẩu
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  placeholder,
  visible,
  onToggle,
  error,
  register,
  disabled,
}: {
  label: string;
  placeholder: string;
  visible: boolean;
  onToggle: () => void;
  error?: string;
  register: UseFormRegisterReturn;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--foreground)]">{label}</label>
      <div className="group relative">
        <Lock className="absolute left-4 top-4 text-[var(--muted)] group-focus-within:text-[var(--accent-deep)]" size={20} />
        <input
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-full border bg-[rgba(255,250,243,0.7)] py-4 pl-12 pr-12 outline-none transition-all ${
            error ? "border-red-300 bg-red-50 focus:border-red-500" : "border-[var(--border-soft)] focus:border-[var(--border-strong)]"
          }`}
          {...register}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-4 text-[var(--muted)] hover:text-[var(--accent-deep)]"
        >
          {visible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && <p className="ml-1 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
