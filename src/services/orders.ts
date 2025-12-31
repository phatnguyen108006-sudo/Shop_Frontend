const API_URL = "http://localhost:4000/api/v1"; 

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

// --- 1. TẠO ĐƠN HÀNG ---
export async function createOrder(input: CreateOrderInput) {
  try {
    const token = localStorage.getItem("token");
    const headers: any = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); 
      throw new Error(errorData.message || `Lỗi server: ${response.status}`);
    }

    return await response.json(); 
    
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    throw error;
  }
}

// --- 2. TRA CỨU DANH SÁCH ĐƠN (User & Khách vãng lai) ---
export async function getMyOrders(phone = "") {
  try {
    const token = localStorage.getItem("token");
    const headers: any = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/orders/lookup?phone=${phone}`, {
      method: "GET",
      headers: headers,
      cache: "no-store",
    });

    if (!res.ok) return [];
    const result = await res.json();
    return result.data || [];
  } catch (error) {
    console.error("Lỗi tra cứu:", error);
    return [];
  }
}

// --- 3. TRA CỨU CHI TIẾT ĐƠN HÀNG THEO MÃ VÀ SĐT (Công khai) ---
export async function trackOrderService(orderId: string, phone: string) {
  try {
    const res = await fetch(`${API_URL}/orders/track`, {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, phone }),
      cache: "no-store", 
    });

    if (!res.ok) return null;
    
    const result = await res.json();
    return result.order || null;
    
  } catch (error) {
    console.error("Lỗi tra cứu:", error);
    return null;
  }
}

// --- 4. ADMIN: SEARCH ĐƠN THEO SĐT ---
export async function adminSearchOrders(phone: string) {
  try {
    const token = localStorage.getItem("token"); 
    
    const res = await fetch(`${API_URL}/orders?phone=${phone}`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    
    const result = await res.json();
    return result.data || []; 
    
  } catch (error) {
    console.error("Lỗi admin tra cứu:", error);
    return [];
  }
}

// --- 5. ADMIN: LẤY TẤT CẢ ĐƠN ---
export async function getAllOrders() {
  try {
    const token = localStorage.getItem("token");
    
    const res = await fetch(`${API_URL}/orders`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    
    const result = await res.json();
    return result.data || [];
    
  } catch (error) {
    console.error("Lỗi lấy danh sách đơn hàng:", error);
    return [];
  }
}

// --- 6. ADMIN: LẤY CHI TIẾT 1 ĐƠN ---
export async function getOrderByIdAdmin(id: string) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/orders/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const result = await res.json();
    return result.data || null; 
  } catch (error) {
    return null;
  }
}

// --- 7. ADMIN: CẬP NHẬT TRẠNG THÁI ---
export async function updateOrderStatus(id: string, status: string) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/orders/${id}/status`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ status })
    });
    return res.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}