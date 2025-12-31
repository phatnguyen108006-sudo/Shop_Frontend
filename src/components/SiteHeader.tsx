"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; 
import { useState, useEffect } from "react";
import { cn } from "@/lib/cn"; 
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import { ShoppingCart, Settings, LogOut, FileText } from "lucide-react"; 
import { useCart } from "@/features/cart/cart-context"; 

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
            setUser({ name: "Member", role: role || "user" });
        }
    }
  }, []);

  const handleLogout = () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); 
    
    // Nếu có chữ -> Chuyển sang trang shop tìm kiếm
    if (q.trim()) {
      router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
    } 
    // Nếu không có chữ -> Trả về trang shop gốc
    else {
      router.push(pathname); // Giữ nguyên trang hiện tại nhưng xóa ?q=...
    }
  };

  const NavLink = ({ href, children, className }: { href: string; children: React.ReactNode, className?: string }) => (
    <Link
      href={href}
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2", 
        pathname === href 
          ? "bg-black text-white dark:bg-white dark:text-black shadow-md" 
          : "text-gray-600 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
        className
      )}
    >
      {children}
    </Link>
  );

  if (!mounted) {
    return <header className="h-16 border-b bg-white dark:bg-gray-900" />;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl transition-all duration-300 shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative overflow-hidden rounded-full ring-2 ring-gray-100 dark:ring-gray-700 group-hover:ring-blue-500 transition-all">
             <Image 
               src="/images/BTH.png" 
               alt="BTCK Logo" 
               width={40} 
               height={40} 
               className="object-cover transition-transform group-hover:scale-110"
             />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            BTCK 
          </span>
        </Link>
        
        {/* MENU ĐIỀU HƯỚNG */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/shop">Cửa hàng</NavLink>
          <NavLink href="/about">Giới thiệu</NavLink>
          
          <NavLink href="/orders">
            <FileText size={16} /> 
            <span>Tra cứu đơn hàng</span>
          </NavLink>

          {/* Admin Link */}
          {user?.role === 'admin' && (
             <Link 
               href="/admin" 
               className="ml-2 flex items-center gap-1 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-full hover:bg-red-100 hover:shadow-sm transition-all dark:bg-red-900/30 dark:text-red-400"
             >
               <Settings className="w-4 h-4" />
               Quản trị
             </Link>
          )}
        </nav>

        {/* SEARCH FORM */}
        <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-sm mx-4 relative group">
          
          <button 
            type="submit" 
            className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer z-10"
            title="Tìm kiếm (hoặc Reset nếu rỗng)"
          >
            <svg className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 border-transparent rounded-full focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all dark:bg-gray-800 dark:text-white dark:focus:bg-gray-800 dark:focus:border-blue-500"
          />
        </form>

        {/* CÔNG CỤ & USER */}
        <div className="flex items-center gap-3">
          
          <ThemeToggle />

          <Link href="/cart" className="relative group p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
             <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-200 group-hover:text-blue-600" />
             {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow ring-2 ring-white dark:ring-gray-900 animate-in zoom-in">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
             )}
          </Link>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

          {user ? (
            <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-300">
               <div className="hidden sm:block text-right leading-tight">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{user.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">{user.role}</p>
               </div>
               
               <button 
                 onClick={handleLogout}
                 title="Đăng xuất"
                 className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all dark:hover:bg-red-900/20 dark:hover:text-red-400"
               >
                 <LogOut className="w-5 h-5" />
               </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                href="/login" 
                className="hidden sm:block text-sm font-semibold text-gray-700 hover:text-black px-3 py-2 rounded-lg hover:bg-gray-100 transition dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
              >
                Đăng nhập
              </Link>
              <Link 
                href="/register" 
                className="text-sm font-bold bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}