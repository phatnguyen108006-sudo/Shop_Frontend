"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, ShoppingBag, Package, Users, LogOut, Menu, X, KeyRound } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State cho mobile menu

  // Bảo vệ trang Admin
  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/");
    }
  }, [router]);

  if (!mounted) return null;

  const menuItems = [
    { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
    { name: "Quản lý Đơn hàng", href: "/admin/orders", icon: ShoppingBag },
    { name: "Quản lý Sản phẩm", href: "/admin/products", icon: Package },
    { name: "Khách hàng", href: "/admin/customers", icon: Users },
  ];

  // Component Sidebar dùng chung
  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center justify-center border-b border-gray-100">
        <span className="text-xl font-bold text-gray-900">Admin Panel</span>
      </div>
      
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          // 👇 LOGIC FIX: Kiểm tra active cho cả trang con
          // Nếu item là trang chủ admin (/admin) thì bắt buộc phải trùng khớp hoàn toàn
          // Các trang khác thì chỉ cần bắt đầu bằng href (VD: /admin/products/new bắt đầu bằng /admin/products)
          const isActive = item.href === "/admin" 
            ? pathname === "/admin" 
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)} // Đóng menu khi click (mobile)
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-gray-900 text-white shadow-md" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4 border-t border-gray-100 pt-4">
         <Link
           href="/account/password"
           onClick={() => setIsMobileMenuOpen(false)}
           className="mb-2 flex items-center gap-3 px-4 py-3 w-full text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
         >
           <KeyRound size={20} /> Đổi mật khẩu
         </Link>
         <button 
           onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
           className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
         >
           <LogOut size={20} /> Đăng xuất
         </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* 1. SIDEBAR DESKTOP (Ẩn trên mobile) */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-20 hidden md:block">
        <SidebarContent />
      </aside>

      {/* 2. HEADER MOBILE (Chỉ hiện trên mobile) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 flex items-center justify-between px-4">
          <span className="text-lg font-bold text-gray-900">Admin Panel</span>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600">
            <Menu size={24} />
          </button>
      </div>

      {/* 3. SIDEBAR MOBILE (Dạng Drawer trượt ra) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
            {/* Lớp phủ đen mờ */}
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
            {/* Nội dung menu */}
            <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl animate-in slide-in-from-left duration-200">
                <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 text-gray-500">
                    <X size={24} />
                </button>
                <SidebarContent />
            </aside>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
        {children}
      </main>
    </div>
  );
}
