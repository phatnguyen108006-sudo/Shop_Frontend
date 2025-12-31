import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Providers from "./providers";

const inter = Inter({ 
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",        
  display: "swap",
});

export const metadata: Metadata = {
  title: "BTCK - Thời trang & Công nghệ",
  description: "Mua sắm thả ga với BTCK",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 flex flex-col`}>
        <Providers>
          <SiteHeader />
          
          {/* Main content tự do tràn màn hình (Không có container) */}
          <main className="flex-1">
            {children}
          </main>

          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}