import { apiFetch } from '@/lib/api';

// Lấy danh sách khách hàng (Admin)
export async function getCustomers(page = 1, search = "") {
  try {
    // Lấy token an toàn (tránh lỗi khi chạy trên server next.js)
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : "";

    // Dùng apiFetch: tự động ghép link API, tự xử lý JSON
    const result: any = await apiFetch(`/customers?page=${page}&limit=10&q=${search}`, {
      headers: { 
        "Authorization": `Bearer ${token}` 
      },
    });
    
    // Trả về kết quả hoặc object rỗng nếu null
    return result || { data: [], total: 0 };

  } catch (error) {
    console.error("Lỗi lấy danh sách khách hàng:", error);
    // Trả về mặc định để không bị sập trang Admin
    return { data: [], total: 0 };
  }
}