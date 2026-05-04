import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Cửa hàng",
  icons: {
    icon: "/images/logo-mark.svg",
  },
};

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") || "/shop";
  const isDetail = pathname.startsWith("/shop/") && pathname.split("/").length > 2;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <nav className="text-sm text-gray-500">
          <Link className="underline" href="/">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link className="underline" href="/shop">Cửa hàng</Link>
          {isDetail && <span className="mx-2">/</span>}
          {isDetail && <span className="text-gray-700">Chi tiết</span>}
        </nav>
      </div>
      {children}
    </section>
  );
}
