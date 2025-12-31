"use client";

import Link from "next/link";
// 1. Import icon hệ thống từ Lucide (cho các mục liên hệ)
import { Mail, Phone, MapPin, Send } from "lucide-react"; 
// 2. Import icon thương hiệu từ React Icons (để logo đẹp và không bị lỗi gạch ngang)
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa"; 

export default function SiteFooter() {
  return (
    <footer className="bg-black text-gray-400 pt-16 pb-8 border-t border-gray-800 mt-auto font-sans">
      <div className="container mx-auto max-w-7xl px-4">
        
        {/* GRID LAYOUT: 4 Cột */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* CỘT 1: THÔNG TIN THƯƠNG HIỆU */}
          <div className="space-y-5">
            <h3 className="text-white text-3xl font-extrabold tracking-tight">BTCK.</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              BTCK mang đến trải nghiệm mua sắm trực tuyến đẳng cấp, hiện đại và tin cậy. 
              Chúng tôi cam kết chất lượng hàng đầu cùng dịch vụ tận tâm nhất.
            </p>
            
            {/* Mạng xã hội */}
            <div className="flex items-center gap-3 mt-4">
              <SocialLink href="#" icon={<FaFacebookF size={18} />} />
              <SocialLink href="#" icon={<FaInstagram size={19} />} />
              <SocialLink href="#" icon={<FaTwitter size={18} />} />
              <SocialLink href="#" icon={<FaYoutube size={18} />} />
            </div>
          </div>

          {/* CỘT 2: LIÊN KẾT NHANH */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Cửa hàng</h4>
            <ul className="space-y-3 text-sm">
              <li><FooterLink href="/shop">Tất cả sản phẩm</FooterLink></li>
              <li><FooterLink href="/shop?category=clothing">Thời trang nam</FooterLink></li>
              <li><FooterLink href="/shop?category=accessories">Phụ kiện công nghệ</FooterLink></li>
              <li><FooterLink href="/shop?category=sale">Khuyến mãi hot</FooterLink></li>
              <li><FooterLink href="/about">Về chúng tôi</FooterLink></li>
            </ul>
          </div>

          {/* CỘT 3: HỖ TRỢ KHÁCH HÀNG */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Hỗ trợ</h4>
            <ul className="space-y-3 text-sm">
              <li><FooterLink href="/orders">Tra cứu đơn hàng</FooterLink></li>
              <li><FooterLink href="#">Chính sách đổi trả</FooterLink></li>
              <li><FooterLink href="#">Bảo mật thông tin</FooterLink></li>
              <li><FooterLink href="#">Câu hỏi thường gặp (FAQ)</FooterLink></li>
              <li><FooterLink href="/contact">Liên hệ hỗ trợ</FooterLink></li>
            </ul>
          </div>

          {/* CỘT 4: LIÊN HỆ & ĐĂNG KÝ */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Liên hệ</h4>
            <ul className="space-y-4 text-sm mb-6">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-white mt-1 flex-shrink-0" />
                <span>Tầng 5, Tòa nhà Tech, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-white flex-shrink-0" />
                <span className="font-medium text-white">1900 123 456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-white flex-shrink-0" />
                <span>support@btck.vn</span>
              </li>
            </ul>

            {/* Form đăng ký nhận tin */}
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email nhận ưu đãi..." 
                className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder:text-gray-600"
              />
              <button className="absolute right-2 top-2 p-1.5 bg-white text-black rounded-md hover:bg-gray-200 transition-colors transform active:scale-95">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR: COPYRIGHT */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} BTCK Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">Điều khoản</Link>
            <Link href="#" className="hover:text-white transition-colors">Bảo mật</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- CÁC COMPONENT PHỤ ĐỂ TÁI SỬ DỤNG ---

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block"
    >
      {children}
    </Link>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 no-underline hover:-translate-y-1"
    >
      {icon}
    </a>
  );
}