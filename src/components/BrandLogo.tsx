"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

type BrandLogoProps = {
  href?: string;
  className?: string;
  compact?: boolean;
  invert?: boolean;
};

export default function BrandLogo({
  href = "/",
  className,
  compact = false,
  invert = false,
}: BrandLogoProps) {
  return (
    <Link href={href} aria-label="Trang chủ Trang Sức">
      <div
        className={cn(
          "group inline-flex items-center gap-3 rounded-full transition-transform duration-300 hover:scale-[1.01]",
          className
        )}
      >
        <span
          className={cn(
            "relative flex items-center justify-center rounded-full border shadow-[0_12px_28px_rgba(111,82,40,0.15)]",
            compact ? "h-11 w-11" : "h-14 w-14",
            invert
              ? "border-[rgba(240,215,174,0.28)] bg-[linear-gradient(135deg,#f0d7ae,#a98a61)]"
              : "border-[var(--border-strong)] bg-[linear-gradient(135deg,#fffaf1,#e6d0ad)]"
          )}
        >
          <svg
            viewBox="0 0 64 64"
            aria-hidden="true"
            className={cn(compact ? "h-6 w-6" : "h-8 w-8")}
          >
            <path
              d="M32 8 46 22 32 56 18 22 32 8Z"
              fill="none"
              stroke={invert ? "#1a130f" : "#6f5228"}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path
              d="M18 22h28M24 22l8 34m8-34-8 34M24 22l8-14 8 14"
              fill="none"
              stroke={invert ? "#1a130f" : "#6f5228"}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.92"
            />
          </svg>
          <span
            className={cn(
              "absolute inset-[5px] rounded-full border",
              invert ? "border-white/20" : "border-white/60"
            )}
          />
        </span>

        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "text-[10px] uppercase tracking-[0.5em]",
              invert ? "text-[#d8c5aa]" : "text-[var(--accent-deep)]"
            )}
          >
            Atelier Fine Jewelry
          </span>
          <span
            className={cn(
              "luxury-title text-3xl",
              invert ? "text-[#fff6e7]" : "text-[var(--foreground)]"
            )}
          >
            Trang Sức
          </span>
        </span>
      </div>
    </Link>
  );
}
