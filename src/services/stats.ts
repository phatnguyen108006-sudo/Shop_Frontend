import { apiFetch } from '@/lib/api';

export async function getDashboardStats() {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : "";
    const result: any = await apiFetch('/stats', {
      headers: { 
        "Authorization": `Bearer ${token}` 
      },
    });
    
    // Nếu apiFetch thành công, trả về data
    return result.data || null;

  } catch (error) {
    console.error("Lỗi lấy thống kê dashboard:", error);
    return null;
  }
}