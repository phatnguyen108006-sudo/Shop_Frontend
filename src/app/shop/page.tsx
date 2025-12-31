"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
  _id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  slug: string;
}

// Định nghĩa kiểu dữ liệu trả về từ API
interface ApiResponse {
  ok: boolean;
  data: Product[];
  page: number;
  total: number;
  hasNext: boolean;
}

const LIMIT = 12;

export default function ShopPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Lấy tham số từ URL
  const pageParam = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const qParam = searchParams.get("q") || "";

  // State lưu dữ liệu
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // GỌI API TỪ BACKEND
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMsg("");
      try {
        // Tạo query string
        const params = new URLSearchParams({
          page: String(pageParam),
          limit: String(LIMIT),
        });
        
        // Vẫn giữ dòng này để hỗ trợ tìm kiếm từ Header
        if (qParam) params.set("q", qParam);

        const res = await fetch(`http://localhost:4000/api/v1/products?${params.toString()}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Không thể kết nối tới Backend");
        }

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || "Lỗi tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pageParam, qParam]);

  // Hàm chuyển trang
  function setUrl(next: { page?: number }) {
    const sp = new URLSearchParams(searchParams.toString());
    if (typeof next.page === "number") sp.set("page", String(next.page));
    router.push(`${pathname}?${sp.toString()}`);
  }

  return (
    <main className="py-8 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cửa hàng</h1>
        {qParam && (
            <p className="text-gray-500">Kết quả tìm kiếm cho: <span className="font-bold text-black">"{qParam}"</span></p>
        )}
      </div>

      {/* ĐÃ XÓA FORM TÌM KIẾM Ở ĐÂY */}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-xl" />
          ))}
        </div>
      )}

      {/* Error State */}
      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          Lỗi: {errorMsg}. Hãy chắc chắn Backend Port 4000 đang chạy.
        </div>
      )}

      {/* Empty State */}
      {!isLoading && data && data.data.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl">Không tìm thấy sản phẩm nào.</p>
          <button 
            onClick={() => router.push(pathname)}
            className="mt-4 text-blue-600 hover:underline"
          >
            Xem tất cả sản phẩm
          </button>
        </div>
      )}

      {/* Product Grid */}
      {!isLoading && data && data.data.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.data.map((p, index) => (
            <ProductCard key={p._id || index} product={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && data && (data.page > 1 || data.hasNext) && (
        <div className="mt-10 flex justify-center items-center gap-4">
          <button
            className="h-10 px-4 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setUrl({ page: Math.max(pageParam - 1, 1) })}
            disabled={pageParam <= 1}
          >
            ← Trang trước
          </button>
          <span className="font-medium">Trang {data.page}</span>
          <button
            className="h-10 px-4 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setUrl({ page: data.page + 1 })}
            disabled={!data.hasNext}
          >
            Trang sau →
          </button>
        </div>
      )}
    </main>
  );
}