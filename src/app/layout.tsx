import "./globals.css";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Trang Sức - Trang sức cao cấp",
  description: "Không gian mua sắm trang sức sang trọng với bộ sưu tập được chọn lọc tinh tế.",
  icons: {
    icon: "/images/logo-mark.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col transition-colors duration-300">
        <Providers>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
