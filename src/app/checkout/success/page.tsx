"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ShoppingBag, ArrowRight, Copy } from "lucide-react";
import { Suspense } from "react"; 

// Component con để lấy searchParams (tránh lỗi de-opt trong Next.js mới)
function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "Mới";

  return (
    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 text-center max-w-lg w-full mx-4 animate-in zoom-in duration-300">
      {/* Icon Check Xanh */}
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h1>
      <p className="text-gray-500 mb-8">
        Cảm ơn bạn đã mua sắm tại BTCK. <br />
        Đơn hàng của bạn đang được xử lý.
      </p>

      {/* Box Mã đơn hàng */}
      <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
        <p className="text-sm text-gray-500 mb-1">Mã đơn hàng của bạn</p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl font-mono font-bold text-blue-600">
            #{orderId.toString().slice(-6).toUpperCase()}
          </span>
          <button 
            onClick={() => navigator.clipboard.writeText(orderId)}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors text-gray-400 hover:text-gray-600"
            title="Sao chép mã"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>

      {/* Các nút điều hướng */}
      <div className="flex flex-col gap-3">
        <Link 
          href="/shop" 
          className="w-full bg-black text-white py-3.5 rounded-lg font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <ShoppingBag size={20} /> Tiếp tục mua sắm
        </Link>

        <Link 
          href="/orders" 
          className="w-full bg-white text-gray-700 border border-gray-200 py-3.5 rounded-lg font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
        >
          Xem lịch sử đơn hàng <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

// Component chính (Cần Suspense để tránh lỗi build khi dùng useSearchParams)
export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center relative overflow-hidden">
      {/* Background trang trí */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Suspense fallback={<div className="text-gray-500">Đang tải...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}