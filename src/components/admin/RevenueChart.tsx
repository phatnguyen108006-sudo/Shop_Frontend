"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Hàm format tiền cho đẹp (VD: 1.5tr)
const formatCurrency = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}tr`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return String(value);
};

export default function RevenueChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400 border rounded-xl bg-white">
        Chưa có dữ liệu doanh thu 7 ngày qua
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border h-[400px]">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Doanh thu 7 ngày gần nhất</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }} 
            tickFormatter={formatCurrency}
          />
          <Tooltip 
            cursor={{ fill: '#f3f4f6' }}
            formatter={(value: any) => [
              new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
              "Doanh thu" 
            ]}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          {/* Cột biểu đồ màu đen cho ngầu */}
          <Bar dataKey="total" fill="#111827" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}