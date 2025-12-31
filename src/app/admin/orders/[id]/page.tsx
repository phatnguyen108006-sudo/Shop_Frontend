"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, MapPin, Phone, Package, CreditCard, Save, FileText } from "lucide-react";
import { getOrderByIdAdmin, updateOrderStatus } from "@/services/orders";

// Format tiền
const formatVND = (n: number) => n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load dữ liệu khi vào trang
  useEffect(() => {
    const fetchOrder = async () => {
      if (params.id) {
        const data = await getOrderByIdAdmin(params.id as string);
        if (data) {
          setOrder(data);
          setStatus(data.status); // Set trạng thái hiện tại vào dropdown
        }
      }
      setLoading(false);
    };
    fetchOrder();
  }, [params.id]);

  // Xử lý lưu trạng thái mới
  const handleUpdateStatus = async () => {
    setIsSaving(true);
    const success = await updateOrderStatus(order._id || order.id, status);
    if (success) {
      alert("Cập nhật trạng thái thành công!");
      router.refresh(); // Refresh lại dữ liệu
    } else {
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
    setIsSaving(false);
  };

  if (loading) return <div className="p-8 text-center">Đang tải chi tiết đơn hàng...</div>;
  if (!order) return <div className="p-8 text-center">Không tìm thấy đơn hàng.</div>;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header: Nút quay lại & Tiêu đề */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/orders" className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
          <p className="text-gray-500 text-sm">Mã đơn: #{String(order._id || order.id).slice(-6).toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI: THÔNG TIN CHI TIẾT (2 phần) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Danh sách sản phẩm */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Package className="text-blue-600" size={20}/> Danh sách sản phẩm
            </h2>
            <div className="divide-y divide-gray-100">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="py-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded border border-gray-100 overflow-hidden shrink-0">
                    {item.image && <img src={item.image} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">Đơn giá: {formatVND(item.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">x{item.quantity}</p>
                    <p className="text-blue-600 font-medium">{formatVND(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-end">
              <span className="text-gray-500">Tổng tiền thanh toán</span>
              <span className="text-2xl font-bold text-blue-600">{formatVND(order.total)}</span>
            </div>
          </div>

          {/* 2. Thông tin khách hàng */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <User className="text-blue-600" size={20}/> Thông tin giao hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">Khách hàng</label>
                <p className="font-medium text-gray-900 mt-1">{order.customerName}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">Số điện thoại</label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone size={14} className="text-gray-400"/>
                  <span className="font-medium text-gray-900">{order.customerPhone}</span>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-gray-400 uppercase font-bold">Địa chỉ nhận hàng</label>
                <div className="flex items-start gap-2 mt-1">
                  <MapPin size={14} className="text-gray-400 mt-1"/>
                  <span className="font-medium text-gray-900">{order.customerAddress}</span>
                </div>
              </div>
              <div className="md:col-span-2 pt-4 border-t border-gray-100">
                <label className="text-xs text-gray-400 uppercase font-bold flex items-center gap-1">
                   <FileText size={14} /> Ghi chú từ khách hàng
                </label>
                <div className="mt-2 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-100 italic">
                  {order.note ? `"${order.note}"` : "Không có ghi chú"}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-gray-400 uppercase font-bold">Phương thức thanh toán</label>
                <div className="flex items-center gap-2 mt-1">
                  <CreditCard size={14} className="text-gray-400"/>
                  <span className="font-medium text-gray-900 uppercase">{order.paymentMethod}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: HÀNH ĐỘNG (1 phần) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-4">
            <h2 className="font-bold text-lg mb-4">Cập nhật trạng thái</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái đơn hàng</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="pending">⏳ Chờ xử lý (Pending)</option>
                  <option value="confirmed">✅ Đã xác nhận (Confirmed)</option>
                  <option value="shipping">🚚 Đang giao hàng (Shipping)</option>
                  <option value="completed">🎉 Hoàn thành (Completed)</option>
                  <option value="canceled">❌ Đã hủy (Canceled)</option>
                </select>
              </div>

              <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-lg">
                💡 <strong>Ghi chú:</strong><br/>
                Hãy xác nhận kỹ trước khi chuyển sang "Đang giao hàng".
              </div>

              <button 
                onClick={handleUpdateStatus}
                disabled={isSaving}
                className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSaving ? "Đang lưu..." : <><Save size={18}/> Lưu thay đổi</>}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}