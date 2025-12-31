import { apiFetch } from '@/lib/api';

// Định nghĩa kiểu dữ liệu gửi đi
export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: string;
  note?: string;
  items: { 
    productId: string | number; 
    quantity: number;
    price?: number; 
  }[];
  totalPrice: number;
};

// Helper lấy token an toàn
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token");
  }
  return null;
};

// --- 1. TẠO ĐƠN HÀNG ---
export async function createOrder(input: CreateOrderInput) {
  try {
    const token = getToken();
    const headers: any = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    // apiFetch tự thêm Content-Type: application/json
    const result = await apiFetch('/orders', {
      method: "POST",
      headers: headers,
      body: JSON.stringify(input),
    });

    return result;
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    throw error;
  }
}

// --- 2. TRA CỨU DANH SÁCH ĐƠN (User & Khách vãng lai) ---
export async function getMyOrders(phone = "") {
  try {
    const token = getToken();
    const headers: any = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const result: any = await apiFetch(`/orders/lookup?phone=${phone}`, {
      method: "GET",
      headers: headers,
    });

    return result.data || [];
  } catch (error) {
    console.error("Lỗi tra cứu:", error);
    return [];
  }
}

// --- 3. TRA CỨU CHI TIẾT ĐƠN HÀNG THEO MÃ VÀ SĐT (Công khai) ---
export async function trackOrderService(orderId: string, phone: string) {
  try {
    const result: any = await apiFetch('/orders/track', {
      method: "POST", 
      body: JSON.stringify({ orderId, phone }),
    });

    return result.order || null;
  } catch (error) {
    console.error("Lỗi tra cứu:", error);
    return null;
  }
}

// --- 4. ADMIN: SEARCH ĐƠN THEO SĐT ---
export async function adminSearchOrders(phone: string) {
  try {
    const token = getToken();
    
    const result: any = await apiFetch(`/orders?phone=${phone}`, {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${token}` 
      },
    });

    return result.data || []; 
  } catch (error) {
    console.error("Lỗi admin tra cứu:", error);
    return [];
  }
}

// --- 5. ADMIN: LẤY TẤT CẢ ĐƠN ---
export async function getAllOrders() {
  try {
    const token = getToken();
    
    const result: any = await apiFetch('/orders', {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${token}` 
      },
    });

    return result.data || [];
  } catch (error) {
    console.error("Lỗi lấy danh sách đơn hàng:", error);
    return [];
  }
}

// --- 6. ADMIN: LẤY CHI TIẾT 1 ĐƠN ---
export async function getOrderByIdAdmin(id: string) {
  try {
    const token = getToken();
    const result: any = await apiFetch(`/orders/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return result.data || null; 
  } catch (error) {
    return null;
  }
}

// --- 7. ADMIN: CẬP NHẬT TRẠNG THÁI ---
export async function updateOrderStatus(id: string, status: string) {
  try {
    const token = getToken();
    await apiFetch(`/orders/${id}/status`, {
      method: "PATCH",
      headers: { 
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ status })
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}