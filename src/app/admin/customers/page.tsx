"use client";

import { useEffect, useState } from "react";
import { Search, User, Mail, Calendar, Shield } from "lucide-react";
import { getCustomers } from "@/services/customers";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  // Hàm load dữ liệu
  const fetchCustomers = async (keyword = "") => {
    setLoading(true);
    const res = await getCustomers(1, keyword);
    if (res && res.data) {
      setCustomers(res.data);
      setTotal(res.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers(search);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Khách hàng</h1>
           <p className="text-gray-500">Danh sách người dùng đã đăng ký ({total})</p>
        </div>
        
        <form onSubmit={handleSearch} className="relative">
          <input 
            type="text" 
            placeholder="Tìm theo tên, email..." 
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </form>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Đang tải danh sách...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                <tr>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Liên hệ</th>
                  <th className="px-6 py-4">Vai trò</th>
                  <th className="px-6 py-4">Ngày tham gia</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {customers.length === 0 ? (
                   <tr>
                     <td colSpan={4} className="p-10 text-center text-gray-400">Không tìm thấy khách hàng nào</td>
                   </tr>
                ) : (
                  customers.map((user, index) => {
                    // 👇 FIX LỖI: Lấy ID an toàn, nếu không có _id thì dùng id, nếu không có nữa thì dùng index
                    const userId = user._id || user.id || `user-${index}`;
                    
                    return (
                      <tr key={userId} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                              {user.fullName ? user.fullName.charAt(0).toUpperCase() : <User size={20}/>}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{user.fullName || "Chưa đặt tên"}</p>
                              {/* 👇 FIX LỖI: Convert sang String trước khi slice để tránh crash */}
                              <p className="text-xs text-gray-500">ID: {String(userId).slice(-6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail size={14} /> {user.email || "Không có email"}
                            </div>
                            {user.phone && <span className="text-xs text-gray-500 pl-6">{user.phone}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Shield size={12}/> {user.role || "User"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            {/* Thêm fallback nếu không có createdAt */}
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}