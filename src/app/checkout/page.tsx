"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/features/cart/cart-context";
import { createOrder } from "@/services/orders";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, hydrated, totalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "banking" | "momo">("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0) {
      const timer = setTimeout(() => router.push("/shop"), 500);
      return () => clearTimeout(timer);
    }
  }, [hydrated, items, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError("Vui lòng điền đầy đủ thông tin giao hàng.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item.id,
        slug: item.slug,
        quantity: item.quantity,
        price: item.price,
      }));

      const payload = {
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        paymentMethod,
        note: formData.note,
        items: orderItems,
        totalPrice,
      };

      const response = await createOrder(payload);

      clearCart();
      router.push(`/checkout/success?orderId=${response.id || response._id || "new"}`);
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra";

      if (msg.includes("OUT_OF_STOCK") || msg.includes("het hang") || msg.includes("stock")) {
        setError(`Sản phẩm hết hàng: ${msg.replace("OUT_OF_STOCK", "").trim()}`);
        alert(`Không thể đặt hàng.\n\n${msg}\n\nVui lòng quay lại giỏ hàng và điều chỉnh số lượng.`);
      } else {
        setError(msg);
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!hydrated || items.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-500">Giỏ hàng trống. Đang quay về cửa hàng...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-6">
          <Link href="/cart" className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-blue-600">
            <ChevronLeft size={16} className="mr-1" /> Quay lại giỏ hàng
          </Link>
        </div>

        <h1 className="mb-8 text-3xl font-bold text-gray-900">Thanh toán và Đặt hàng</h1>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 animate-pulse">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-6">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-800">
                <MapPin className="text-blue-600" size={24} /> Thông tin nhận hàng
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Họ và tên <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                      required
                      type="text"
                      name="name"
                      placeholder="Nguyễn Văn A"
                      className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none transition-all focus:ring-2 focus:ring-blue-500"
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
                      className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none transition-all focus:ring-2 focus:ring-blue-500"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Địa chỉ chi tiết <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    name="address"
                    rows={2}
                    placeholder="Số nhà, tên đường, phường xã..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 outline-none transition-all focus:ring-2 focus:ring-blue-500"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Ghi chú</label>
                  <textarea
                    name="note"
                    rows={2}
                    placeholder="Ví dụ: Giao giờ hành chính..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 outline-none transition-all focus:ring-2 focus:ring-blue-500"
                    value={formData.note}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-800">
                <CreditCard className="text-blue-600" size={24} /> Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                <label className={`flex cursor-pointer items-center rounded-lg border p-4 transition-all ${paymentMethod === "cod" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="h-5 w-5 text-blue-600" />
                  <div className="ml-3">
                    <span className="block text-sm font-bold text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                    <span className="block text-xs text-gray-500">Nhận hàng, kiểm tra rồi mới trả tiền.</span>
                  </div>
                </label>

                <label className={`flex cursor-pointer items-center rounded-lg border p-4 transition-all ${paymentMethod === "banking" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
                  <input type="radio" name="payment" value="banking" checked={paymentMethod === "banking"} onChange={() => setPaymentMethod("banking")} className="h-5 w-5 text-blue-600" />
                  <div className="ml-3">
                    <span className="block text-sm font-bold text-gray-900">Chuyển khoản ngân hàng</span>
                    <span className="block text-xs text-gray-500">Quét mã QR nhanh chóng.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:w-[380px]">
            <div className="sticky top-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-gray-900">Đơn hàng của bạn</h2>

              <div className="custom-scrollbar mb-6 max-h-[350px] space-y-4 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 border-b border-gray-50 pb-4 last:border-0">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border border-gray-100 bg-gray-50">
                      <img src={item.image || "/placeholder.png"} alt={item.name} className="h-full w-full object-cover" />
                      <span className="absolute bottom-0 right-0 rounded-tl bg-gray-900 px-1.5 py-0.5 text-[10px] text-white">x{item.quantity}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="mt-1 text-sm font-bold text-blue-600">{formatVND(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tạm tính</span>
                  <span>{formatVND(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
                <div className="my-2 border-t border-dashed border-gray-200"></div>
                <div className="flex items-end justify-between">
                  <span className="text-base font-bold text-gray-900">Tổng cộng</span>
                  <span className="text-xl font-bold text-blue-600">{formatVND(totalPrice)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-3.5 font-bold text-white shadow-lg transition-all hover:bg-black hover:shadow-xl disabled:opacity-70"
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
