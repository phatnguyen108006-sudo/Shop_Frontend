"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  MapPin, Phone, User, CreditCard, ChevronLeft, 
  Loader2, CheckCircle2, AlertCircle 
} from "lucide-react";

import { useCart } from "@/features/cart/cart-context"; 
import { createOrder } from "@/services/orders";

// Hàm format tiền tệ
function formatVND(n: number) {
  return n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export default function CheckoutPage() {
  const router = useRouter();
  
  // Lấy dữ liệu từ Context
  const { items, totalPrice, clearCart } = useCart(); 

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "banking" | "momo">("cod");
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Nếu giỏ hàng trống, tự động quay về trang Shop
  useEffect(() => {
    // Chỉ chạy logic redirect khi đã mount component để tránh lỗi hydration
    if (items.length === 0) {
      const timer = setTimeout(() => router.push("/shop"), 500);
      return () => clearTimeout(timer);
    }
  }, [items, router]);

  // Xử lý nhập liệu
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý Submit
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validate cơ bản
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError("Vui lòng điền đầy đủ thông tin giao hàng.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Chuẩn bị danh sách hàng
      const orderItems = items.map((item) => ({
        // Đảm bảo lấy đúng ID sản phẩm (id hoặc _id tùy backend)
        productId: item.id, 
        quantity: item.quantity,
        price: item.price // Gửi thêm giá tại thời điểm mua để lưu lịch sử
      }));

      const payload = {
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        paymentMethod: paymentMethod,
        note: formData.note,
        items: orderItems,
        totalPrice: totalPrice,
      };

      // Gọi API
      const response = await createOrder(payload);

      if (!response) throw new Error("Lỗi kết nối server");

      // THÀNH CÔNG
      clearCart(); // Xóa giỏ hàng
      // Chuyển sang trang success với ID đơn hàng
      router.push(`/checkout/success?orderId=${response.id || response._id || "new"}`); 

    } catch (err: any) {
    console.error("Lỗi đặt hàng:", err);
    
    const msg = err.message || "Có lỗi xảy ra";

    // Kiểm tra xem lỗi có phải do hết hàng không
    // (Backend trả về code: OUT_OF_STOCK hoặc message chứa tên sản phẩm)
    if (msg.includes("OUT_OF_STOCK") || msg.includes("hết hàng") || msg.includes("stock")) {
      setError(`⚠️ SẢN PHẨM HẾT HÀNG: ${msg.replace("OUT_OF_STOCK", "")}`);
      
      // Hiện thêm popup cảnh báo để người dùng chắc chắn nhìn thấy
      alert(`❌ KHÔNG THỂ ĐẶT HÀNG\n\n${msg}\n\nVui lòng quay lại giỏ hàng và giảm số lượng sản phẩm này.`);
    } else {
      // Các lỗi khác (ví dụ: lỗi mạng, lỗi server 500)
      setError(msg);
    }
    
    // Cuộn lên đầu trang để khách thấy thông báo đỏ
    window.scrollTo({ top: 0, behavior: "smooth" });
  } finally {
    setIsSubmitting(false);
  }
}

  // Màn hình chờ khi chưa có dữ liệu hoặc đang redirect
  if (items.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500">Giỏ hàng trống. Đang quay về cửa hàng...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/cart" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <ChevronLeft size={16} className="mr-1" /> Quay lại giỏ hàng
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán & Đặt hàng</h1>

        {/* Thông báo lỗi */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 animate-pulse">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col lg:flex-row gap-8">
          
          {/* CỘT TRÁI: FORM NHẬP LIỆU */}
          <div className="flex-1 space-y-6">
            
            {/* Form Thông tin */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
                <MapPin className="text-blue-600" size={24} /> Thông tin nhận hàng
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Họ và tên <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                      required
                      type="text"
                      name="name"
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Số điện thoại <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                      required
                      type="tel"
                      name="phone"
                      placeholder="09xx xxx xxx"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Địa chỉ chi tiết <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    name="address"
                    rows={2}
                    placeholder="Số nhà, tên đường, phường/xã..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Ghi chú (Tùy chọn)</label>
                  <textarea
                    name="note"
                    rows={2}
                    placeholder="Ví dụ: Giao giờ hành chính..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    value={formData.note}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Form Thanh toán */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
                <CreditCard className="text-blue-600" size={24} /> Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                {/* COD */}
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-5 h-5 text-blue-600" />
                  <div className="ml-3">
                    <span className="block text-sm font-bold text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                    <span className="block text-xs text-gray-500">Nhận hàng, kiểm tra rồi mới trả tiền.</span>
                  </div>
                </label>

                {/* Banking */}
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'banking' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" value="banking" checked={paymentMethod === 'banking'} onChange={() => setPaymentMethod('banking')} className="w-5 h-5 text-blue-600" />
                  <div className="ml-3">
                    <span className="block text-sm font-bold text-gray-900">Chuyển khoản Ngân hàng</span>
                    <span className="block text-xs text-gray-500">Quét mã QR VietQR nhanh chóng.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <div className="lg:w-[380px]">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Đơn hàng của bạn</h2>

              <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-start pb-4 border-b border-gray-50 last:border-0">
                    <div className="w-16 h-16 rounded border border-gray-100 bg-gray-50 overflow-hidden flex-shrink-0 relative">
                      <img src={item.image || "/placeholder.png"} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 right-0 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded-tl">x{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</p>
                      <p className="text-sm text-blue-600 font-bold mt-1">{formatVND(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tạm tính</span>
                  <span>{formatVND(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600 font-medium">Miễn phí</span>
                </div>
                <div className="border-t border-dashed border-gray-200 my-2"></div>
                <div className="flex justify-between items-end">
                  <span className="text-base font-bold text-gray-900">Tổng cộng</span>
                  <span className="text-xl font-bold text-blue-600">{formatVND(totalPrice)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <><Loader2 className="animate-spin" size={20} /> Đang xử lý...</> : <><CheckCircle2 size={20} /> HOÀN TẤT ĐẶT HÀNG</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}