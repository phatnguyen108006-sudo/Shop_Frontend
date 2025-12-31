"use client";

import { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, Package, Clock, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getDashboardStats } from "@/services/stats";
import { getAllOrders } from "@/services/orders";
import StatusBadge from "@/components/StatusBadge";
import { formatVNDCompact } from "@/lib/formatMoney";
import RevenueChart from "@/components/admin/RevenueChart"; 

// Format tiền tệ dự phòng
const formatVND = (n: number) => n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    pendingOrders: 0,
    products: 0,
    chartData: [] // Dữ liệu cho biểu đồ
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, ordersData] = await Promise.all([
          getDashboardStats(),
          getAllOrders(),
        ]);

        if (statsData) {
          setStats(statsData);
        }

        if (ordersData && Array.isArray(ordersData)) {
           setRecentOrders(ordersData.slice(0, 5));
        }

      } catch (error) {
        console.error("Lỗi tải dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        Đang tải dữ liệu tổng quan...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Tổng quan kinh doanh
        </h1>
        <p className="text-gray-500">
          Chào mừng trở lại! Dưới đây là tình hình cửa hàng hôm nay.
        </p>
      </div>

      {/* 1. CÁC THẺ THỐNG KÊ (STATS CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Doanh thu */}
        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4 transition hover:shadow-md">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-gray-500 font-medium">Tổng doanh thu</p>
            <p className="text-2xl font-bold text-gray-900 whitespace-nowrap">
              {typeof formatVNDCompact === 'function' ? formatVNDCompact(stats.revenue) : formatVND(stats.revenue)}
            </p>
          </div>
        </div>

        {/* Tổng đơn */}
        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4 transition hover:shadow-md">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Tổng đơn hàng</p>
            <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
          </div>
        </div>

        {/* Đơn chờ xử lý */}
        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4 relative transition hover:shadow-md">
          {stats.pendingOrders > 0 && (
            <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          )}
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Chờ xử lý</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          </div>
        </div>

        {/* Tổng sản phẩm */}
        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4 transition hover:shadow-md">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Sản phẩm</p>
            <p className="text-2xl font-bold text-gray-900">{stats.products}</p>
          </div>
        </div>
      </div>

      {/* 2. KHU VỰC BIỂU ĐỒ (MỚI) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột trái: Biểu đồ doanh thu (Chiếm 2 phần) */}
          <div className="lg:col-span-2">
             <RevenueChart data={stats.chartData} />
          </div>

          {/* Cột phải: Widget Mục tiêu (Chiếm 1 phần) */}
          <div className="bg-gray-900 rounded-xl p-6 text-white shadow-lg flex flex-col justify-between h-[400px]">
             <div>
                <div className="flex items-center gap-2 mb-2 text-green-400">
                    <TrendingUp size={20} />
                    <span className="font-bold text-sm uppercase tracking-wider">Mục tiêu tháng</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Doanh số tháng này</h3>
                <p className="text-gray-400 text-sm">
                   Bạn đã đạt được <span className="text-white font-bold">85%</span> mục tiêu tháng này. Hãy cố gắng đẩy mạnh marketing vào cuối tuần!
                </p>
             </div>

             {/* Vòng tròn hoặc thanh tiến độ giả lập */}
             <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                    <span>Tiến độ</span>
                    <span>85%</span>
                </div>
                <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
                
                <div className="pt-4 border-t border-gray-700 mt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Dự kiến đạt</span>
                        <span className="font-bold text-xl">120 tr</span>
                    </div>
                </div>
             </div>
          </div>
      </div>

      {/* 3. BẢNG ĐƠN HÀNG MỚI NHẤT */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-800">
            Đơn hàng mới nhất
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium transition"
          >
            Xem tất cả <ArrowRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b">
              <tr>
                <th className="px-6 py-4">Mã đơn</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Tổng tiền</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-400">
                    Chưa có đơn hàng nào
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr
                    key={order._id || order.id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-6 py-4 font-mono font-medium text-gray-600">
                      #{String(order._id || order.id).slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <div>
                          <p className="font-semibold text-gray-900">{order.customerName}</p>
                          <p className="text-xs text-gray-500">{order.customerPhone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {formatVND(order.total)}
                    </td>
                    <td className="px-6 py-4 text-center">
                       <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order._id || order.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      >
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}