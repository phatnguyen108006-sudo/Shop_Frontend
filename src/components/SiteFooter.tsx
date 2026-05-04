"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaPinterestP } from "react-icons/fa";
import BrandLogo from "@/components/BrandLogo";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border-soft)] bg-[#1a130f] text-[#d8c5aa]">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.1fr]">
          <div className="space-y-5">
            <div>
              <BrandLogo invert />
              <h3 className="luxury-title mt-4 text-4xl text-[#fff6e7]">Trang sức tuyển chọn cho vẻ đẹp sang trọng tinh tế</h3>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#d8c5aa]">
              Những thiết kế được chọn lọc theo tinh thần thanh lịch, cân bằng giữa vẻ đẹp vượt thời gian và trải nghiệm mua sắm riêng tư.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <SocialLink href="https://www.facebook.com/" icon={<FaFacebookF size={18} />} />
              <SocialLink href="https://www.instagram.com/" icon={<FaInstagram size={19} />} />
              <SocialLink href="https://www.pinterest.com/" icon={<FaPinterestP size={18} />} />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold uppercase tracking-[0.24em] text-[#fff6e7]">Bộ sưu tập</h4>
            <ul className="mt-6 space-y-3 text-sm">
              <li><FooterLink href="/shop">Tất cả sản phẩm</FooterLink></li>
              <li><FooterLink href="/shop?category=rings">Nhẫn đính đá</FooterLink></li>
              <li><FooterLink href="/shop?category=necklaces">Dây chuyền</FooterLink></li>
              <li><FooterLink href="/shop?category=bracelets">Vòng tay</FooterLink></li>
              <li><FooterLink href="/about">Câu chuyện thương hiệu</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold uppercase tracking-[0.24em] text-[#fff6e7]">Dịch vụ</h4>
            <ul className="mt-6 space-y-3 text-sm">
              <li><FooterLink href="/orders">Theo dõi đơn hàng</FooterLink></li>
              <li><FooterLink href="/about#size-guide">Tư vấn kích cỡ</FooterLink></li>
              <li><FooterLink href="/about#return-policy">Chính sách đổi trả</FooterLink></li>
              <li><FooterLink href="/about#warranty-care">Bảo hành và chăm sóc</FooterLink></li>
              <li><FooterLink href="/register">Hẹn thử nghiệm riêng</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold uppercase tracking-[0.24em] text-[#fff6e7]">Lịch hẹn riêng tư</h4>
            <ul className="mb-6 mt-6 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 flex-shrink-0 text-[#a98a61]" />
                <span>Suite 05, Quận 1, Thành phố Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="flex-shrink-0 text-[#a98a61]" />
                <a href="tel:1900123456" className="font-medium text-[#fff6e7] hover:text-[#f0d7ae]">
                  1900 123 456
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="flex-shrink-0 text-[#a98a61]" />
                <a href="mailto:concierge@btck.vn" className="hover:text-[#fff6e7]">
                  concierge@btck.vn
                </a>
              </li>
            </ul>

            <NewsletterSignup
              dark
              compact
              wrapperClassName="max-w-none"
              inputClassName="py-3 pr-5"
              buttonClassName="px-5 py-3"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-[rgba(212,178,124,0.14)] py-6 text-xs text-[#8f7a5f] md:flex-row">
          <p>© {new Date().getFullYear()} Trang Sức. Bảo lưu mọi quyền.</p>
          <div className="flex items-center gap-6">
            <Link href="/about#terms" className="transition-colors hover:text-[#fff6e7]">Điều khoản</Link>
            <Link href="/about#privacy" className="transition-colors hover:text-[#fff6e7]">Bảo mật</Link>
            <Link href="/about#cookies" className="transition-colors hover:text-[#fff6e7]">Cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-block text-[#d8c5aa] transition-all duration-300 hover:translate-x-1 hover:text-[#fff6e7]">
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
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(212,178,124,0.16)] bg-[rgba(255,246,231,0.05)] text-[#fff6e7] no-underline transition-all duration-300 hover:-translate-y-1 hover:border-[#a98a61] hover:bg-[#f0d7ae] hover:text-[#1a130f]"
    >
      {icon}
    </a>
  );
}
