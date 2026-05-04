"use client";

import { FormEvent, useMemo, useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/cn";

type NewsletterSignupProps = {
  inputClassName?: string;
  buttonClassName?: string;
  wrapperClassName?: string;
  compact?: boolean;
  dark?: boolean;
};

export default function NewsletterSignup({
  inputClassName,
  buttonClassName,
  wrapperClassName,
  compact = false,
  dark = false,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const emailHref = useMemo(() => {
    const subject = encodeURIComponent("Đăng ký nhận lookbook Trang Sức");
    const body = encodeURIComponent(
      `Xin chào Trang Sức,\n\nTôi muốn đăng ký nhận lookbook và lời mời xem bộ sưu tập mới.\nEmail: ${email || "[điền email]"}`
    );
    return `mailto:concierge@btck.vn?subject=${subject}&body=${body}`;
  }, [email]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const normalized = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setMessage("Vui lòng nhập email hợp lệ.");
      return;
    }

    setMessage("Đã sẵn sàng đăng ký. Hệ thống sẽ mở ứng dụng email của bạn.");
    window.location.href = emailHref;
  }

  return (
    <form onSubmit={handleSubmit} className={cn("mx-auto", wrapperClassName)}>
      <div className={cn("flex flex-col gap-3 sm:flex-row", compact ? "max-w-none" : "max-w-xl")}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email của bạn"
          className={cn(
            "flex-1 rounded-full border px-6 py-4 text-sm outline-none",
            dark
              ? "border-[rgba(212,178,124,0.22)] bg-[rgba(255,246,231,0.06)] text-[#fff6e7] placeholder:text-[#8f7a5f]"
              : "border-[var(--border-soft)] bg-[rgba(255,250,243,0.75)] text-[var(--foreground)] placeholder:text-[var(--muted)]",
            inputClassName
          )}
        />
        <button
          type="submit"
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-[0.26em]",
            dark
              ? "bg-[#f0d7ae] text-[#1a130f] hover:bg-[#fff6e7]"
              : "bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--accent-deep)]",
            buttonClassName
          )}
        >
          Đăng ký
          <Send size={compact ? 14 : 16} />
        </button>
      </div>
      {message && (
        <p className={cn("mt-3 text-sm", dark ? "text-[#d8c5aa]" : "text-[var(--muted)]")}>
          {message}
        </p>
      )}
    </form>
  );
}
