"use client";

import { useState, useEffect } from "react";
import { 
  Search, Package, AlertCircle, ShoppingBag, 
  UserCog, MapPin, Calendar, ArrowRight, Truck, User 
} from "lucide-react";
import { trackOrderService, adminSearchOrders, getMyOrders } from "@/services/orders";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
// Format tiền tệ
const formatVND = (n: number) => n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default function OrderTrackingPage() {
  // State Input
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState("");
  
  // State User & Data
  const [user, setUser] = useState<any>(null); // Lưu thông tin user đăng nhập
  const [orders, setOrders] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // 1. Kiểm tra User khi vào trang
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const role = localStorage.getItem("role");
    
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setUser({ ...parsedUser, role }); // Lưu cả role vào state

      // ⚠️ NẾU LÀ USER THƯỜNG (Ko phải Admin) -> TỰ ĐỘNG TẢI ĐƠN HÀNG NGAY
      if (role !== "admin") {
        fetchMyOrders();
      }
    }
  }, []);

  // Hàm tự động tải đơn cho User đã đăng nhập
  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      // Gọi hàm getMyOrders không cần tham số -> Backend tự lấy theo Token
      const data = await getMyOrders(""); 
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tìm kiếm (Dùng cho Khách vãng lai & Admin)
  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setOrders([]);
    setHasSearched(true);

    try {
      if (user?.role === "admin") {
        // --- LOGIC ADMIN (Tìm bằng SĐT) ---
        if (!phone.trim()) {
           setError("Vui lòng nhập số điện thoại khách hàng");
           setLoading(false);
           return;
        }
        const data = await adminSearchOrders(phone.trim());
        if (data && data.length > 0) setOrders(data);
        else setError("Không tìm thấy lịch sử đơn hàng của SĐT này.");

      } else {
        // --- LOGIC KHÁCH VÃNG LAI (Cần Mã đơn + SĐT) ---
        if (!orderId.trim() || !phone.trim()) {
            setError("Vui lòng nhập đầy đủ Mã đơn hàng và Số điện thoại");
            setLoading(false);
            return;
        }
        const data = await trackOrderService(orderId.trim(), phone.trim());
        if (data) setOrders([data]);
        else setError("Thông tin không chính xác hoặc không tìm thấy đơn hàng.");
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi kết nối, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Render tiêu đề dựa theo vai trò
  const renderHeader = () => {
    if (user?.role === "admin") return "Tra cứu Quản trị viên";
    if (user) return `Đơn hàng của bạn`; // User đã đăng nhập
    return "Tra cứu vận đơn"; // Khách vãng lai
  };

  const renderDescription = () => {
    if (user?.role === "admin") return "Tìm kiếm toàn bộ lịch sử mua hàng của khách qua Số điện thoại.";
    if (user) return `Xin chào ${user.name}, đây là lịch sử mua hàng của bạn.`;
    return "Nhập Mã đơn hàng và Số điện thoại để kiểm tra tiến độ vận chuyển.";
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 font-sans">
      <div className="container mx-auto px-4 max-w-2xl">
        
        {/* HEADER */}
        <div className="text-center mb-10 animate-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4">
             {user?.role === "admin" ? <UserCog className="text-blue-600" size={32} /> : 
              user ? <User className="text-green-600" size={32} /> : 
              <Truck className="text-black" size={32} />}
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
            {renderHeader()}
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            {renderDescription()}
          </p>
        </div>

        {/* FORM TÌM KIẾM 
            Chỉ hiện khi: 
            1. Là Admin (Cần ô tìm kiếm SĐT)
            2. HOẶC Chưa đăng nhập (Cần ô nhập Mã + SĐT)
        */}
        {(user?.role === "admin" || !user) && (
          <div className={`bg-white p-8 rounded-2xl shadow-lg border transition-all duration-300 mb-10 ${user?.role === "admin" ? "border-blue-100 shadow-blue-50" : "border-gray-100"}`}>
            
            {user?.role === "admin" && (
              <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-4 py-2 rounded-lg text-sm font-semibold mb-6 w-fit mx-auto">
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  Chế độ Admin
              </div>
            )}

            <div className="space-y-5">
              {/* Input Mã đơn (Chỉ hiện cho Khách Vãng Lai) */}
              {!user && (
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mã đơn hàng <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <ShoppingBag className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                    <input
                      type="text"
                      placeholder="VD: 676e..."
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all font-medium"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {/* Input SĐT (Hiện cho cả Admin và Khách vãng lai) */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                <div className="relative">
                  <UserCog className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                  <input
                    type="tel"
                    placeholder="VD: 0912 xxx xxx"
                    className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent rounded-xl outline-none transition-all font-medium ${user?.role === "admin" ? "focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100" : "focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10"}`}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="flex-shrink-0" size={20}/> 
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button 
                onClick={handleSearch}
                disabled={loading}
                className={`w-full text-white py-4 rounded-xl font-bold text-lg shadow-lg transform active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-4 
                  ${loading ? "opacity-70 cursor-not-allowed" : ""}
                  ${user?.role === "admin" ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-200" : "bg-black hover:bg-gray-800 hover:shadow-gray-200"}
                `}
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Tra cứu ngay <ArrowRight size={20}/></>
                )}
              </button>
            </div>
          </div>
        )}

        {/* LOADING USER ORDERS */}
        {loading && user && user.role !== "admin" && (
           <div className="text-center py-10">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500">Đang tải danh sách đơn hàng...</p>
           </div>
        )}

        {/* RESULTS AREA (Danh sách đơn hàng) */}
        <div className="space-y-6">
            {orders.map((order, index) => (
                <div 
                  key={order.id || order._id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                    {/* Card Header */}
                    <div className="bg-gray-50/80 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Mã đơn hàng</p>
                            <p className="font-mono font-bold text-lg text-gray-900 flex items-center gap-2">
                              #{String(order.id || order._id).slice(-6).toUpperCase()}
                            </p>
                        </div>
                        <StatusBadge status={order.status} />
                    </div>
                    
                    <div className="p-6">
                        {/* Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><MapPin size={18}/></div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Người nhận</p>
                                    <p className="font-semibold text-gray-900">{order.customerName}</p>
                                    <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{order.customerAddress}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><Calendar size={18}/></div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Ngày đặt hàng</p>
                                    <p className="font-semibold text-gray-900">
                                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                                    </p>
                                    <p className="text-sm text-blue-600 font-bold mt-1">{formatVND(order.total)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Product List */}
                        <div>
                            <p className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                              <Package size={16}/> Sản phẩm ({order.items.length})
                            </p>
                            <div className="space-y-4">
                                {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 items-center group">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 relative">
                                             {item.image ? (
                                                <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                                             ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={24}/></div>
                                             )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{item.name || item.title}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">x{item.quantity}</p>
                                                <p className="text-sm font-semibold text-gray-900">{formatVND(item.price)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        {/* Empty State (User đăng nhập nhưng chưa mua gì) */}
        {!loading && user && user.role !== 'admin' && orders.length === 0 && (
             <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="text-gray-400" size={40}/>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Bạn chưa có đơn hàng nào</h3>
                <p className="text-gray-500 mt-2 mb-6 max-w-xs mx-auto">
                  Hãy khám phá cửa hàng và chọn cho mình những sản phẩm ưng ý nhé.
                </p>
                <Link href="/shop" className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition">
                   Mua sắm ngay
                </Link>
            </div>
        )}

        {/* Empty State (Kết quả tìm kiếm = 0 cho Admin/Khách) */}
        {!loading && !user && hasSearched && orders.length === 0 && !error && (
            <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400" size={40}/>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Không tìm thấy đơn hàng</h3>
                <p className="text-gray-500 mt-2">Vui lòng kiểm tra lại thông tin.</p>
            </div>
        )}

      </div>
    </div>
  );
}