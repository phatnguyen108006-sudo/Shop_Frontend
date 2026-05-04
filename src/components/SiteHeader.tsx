"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import ThemeToggle from "@/components/ThemeToggle";
import { ShoppingCart, Settings, LogOut, FileText, Search, KeyRound } from "lucide-react";
import { useCart } from "@/features/cart/cart-context";
import BrandLogo from "@/components/BrandLogo";

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [q, setQ] = useState("");
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const { totalItems } = useCart();

  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (token) {
      if (storedUser) {
        setUser({ ...JSON.parse(storedUser), role: role || "user" });
      } else {
        setUser({ name: "Thành viên", role: role || "user" });
      }
    }
  }, []);

  const handleLogout = () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (q.trim()) {
      router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
      return;
    }

    router.push("/shop");
  };

  const NavLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-full px-4 py-2 text-sm uppercase tracking-[0.24em] transition-all duration-200",
        pathname === href
          ? "bg-[var(--foreground)] text-[var(--background)] shadow-[0_10px_30px_rgba(35,24,21,0.14)]"
          : "text-[var(--muted)] hover:bg-[rgba(157,122,69,0.08)] hover:text-[var(--foreground)]",
        className
      )}
    >
      {children}
    </Link>
  );

  if (!mounted) {
    return <header className="h-20 border-b border-[var(--border-soft)] bg-[var(--surface)]" />;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-soft)] bg-[rgba(246,241,232,0.84)] backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-4 rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3 shadow-[0_12px_40px_rgba(77,53,26,0.08)]">
          <BrandLogo className="pr-2" compact />

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink href="/shop">Bộ sưu tập</NavLink>
            <NavLink href="/about">Di sản</NavLink>
            <NavLink href="/orders">
              <FileText size={15} />
              <span>Đơn hàng</span>
            </NavLink>

            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="ml-2 flex items-center gap-1 rounded-full border border-[var(--border-strong)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)] hover:bg-[rgba(157,122,69,0.08)]"
              >
                <Settings className="h-4 w-4" />
                Studio
              </Link>
            )}
          </nav>

          <form onSubmit={handleSearch} className="group relative mx-4 hidden max-w-sm flex-1 lg:flex">
            <button
              type="submit"
              className="absolute inset-y-0 left-0 z-10 flex cursor-pointer items-center pl-4 text-[var(--muted)] group-focus-within:text-[var(--accent-deep)]"
              title="Tìm kiếm"
            >
              <Search className="h-4 w-4" />
            </button>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm bộ sưu tập, nhẫn, dây chuyền..."
              className="w-full rounded-full border border-[var(--border-soft)] bg-[rgba(255,250,243,0.72)] py-3 pl-11 pr-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--border-strong)] focus:bg-[var(--surface-strong)]"
            />
          </form>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link href="/cart" className="group relative rounded-full border border-transparent p-2.5 hover:border-[var(--border-soft)] hover:bg-[rgba(157,122,69,0.08)]">
              <ShoppingCart className="h-5 w-5 text-[var(--foreground)] group-hover:text-[var(--accent-deep)]" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent-deep)] px-1 text-[10px] font-bold text-white shadow animate-in zoom-in">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            <div className="mx-1 h-6 w-px bg-[var(--border-soft)]" />

            {user ? (
              <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                <div className="hidden text-right leading-tight sm:block">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{user.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">{user.role}</p>
                </div>

                <Link
                  href="/account/password"
                  title="Đổi mật khẩu"
                  className="rounded-full p-2 text-[var(--muted)] hover:bg-[rgba(157,122,69,0.08)] hover:text-[var(--accent-deep)]"
                >
                  <KeyRound className="h-5 w-5" />
                </Link>

                <button
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="rounded-full p-2 text-[var(--muted)] hover:bg-[rgba(157,122,69,0.08)] hover:text-[var(--accent-deep)]"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden rounded-full px-4 py-2 text-sm uppercase tracking-[0.2em] text-[var(--muted)] hover:bg-[rgba(157,122,69,0.08)] hover:text-[var(--foreground)] sm:block"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="rounded-full border border-[var(--border-strong)] bg-[var(--foreground)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--background)] hover:-translate-y-0.5 hover:bg-[var(--accent-deep)]"
                >
                  Đặt lịch xem
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
