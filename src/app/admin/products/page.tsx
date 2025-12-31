"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Search, ImageIcon } from "lucide-react";
import { getAdminProducts, deleteProduct } from "@/services/products";
import { ChevronLeft, ChevronRight } from "lucide-react";
// Format tiền
const formatVND = (n: number) =>
  n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");


  // 👉 pagination FE
  const [page, setPage] = useState(1);
  const limit = 10;

  // Load dữ liệu
  const fetchData = async () => {
    setLoading(true);
    const data = await getAdminProducts(1, search); // KHÔNG sửa backend
    setAllProducts(data);

    const start = (page - 1) * limit;
    const end = start + limit;
    setProducts(data.slice(start, end));

    setLoading(false);
  };

  // reset page khi search
  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [page, search]);

  // Xử lý Xóa
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm: "${name}"?`)) {
      const success = await deleteProduct(id);
      if (success) {
        alert("Đã xóa thành công!");
        fetchData();
      } else {
        alert("Lỗi khi xóa sản phẩm.");
      }
    }
  };

  const totalPage = Math.ceil(allProducts.length / limit);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h1>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm tên sản phẩm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            <Plus size={20} /> Thêm mới
          </Link>
        </div>
      </div>

      {/* Bảng */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b">
              <tr>
                <th className="px-6 py-4 w-20">Ảnh</th>
                <th className="px-6 py-4">Tên sản phẩm</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Giá bán</th>
                <th className="px-6 py-4">Kho</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    Chưa có sản phẩm nào.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id || p.id} className="hover:bg-gray-50 group">
                    <td className="px-6 py-3">
                      <div className="w-12 h-12 rounded-lg border bg-gray-50 flex items-center justify-center">
                        {p.images?.[0] ? (
                          <img
                            src={p.images[0]}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="text-gray-300" size={20} />
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-3">
                      <p className="font-medium line-clamp-1">{p.title}</p>
                      <p className="text-xs text-gray-400 font-mono">
                        #{String(p._id).slice(-6)}
                      </p>
                    </td>

                    <td className="px-6 py-3 whitespace-nowrap">
  <span
    title={p.category}
    className={`inline-block max-w-[140px] px-3 py-1 rounded-full text-xs font-semibold 
    whitespace-nowrap overflow-hidden text-ellipsis 
    bg-gray-100 text-gray-800`}
  >
    {p.category || "Chưa phân loại"}
  </span>
</td>

                    <td className="px-6 py-3 font-bold">
                      {formatVND(p.price)}
                    </td>

                    <td className="px-6 py-3">
                      <span
                        className={
                          p.stock > 0 ? "text-green-600" : "text-red-500"
                        }
                      >
                        {p.stock > 0 ? p.stock : "Hết hàng"}
                      </span>
                    </td>

                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100">
                        <Link
                          href={`/admin/products/${p._id || p.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(p._id || p.id, p.title)
                          }
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPage > 1 && (
  <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
    <span className="text-sm text-gray-500">
      Trang {page} / {totalPage}
    </span>

    <div className="flex items-center gap-2">
      {/* Nút Trước */}
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        title="Trang trước"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Nút Sau */}
      <button
        disabled={page === totalPage}
        onClick={() => setPage(page + 1)}
        className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        title="Trang sau"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  </div>
)}
 </div>
    </div>
  );
}

