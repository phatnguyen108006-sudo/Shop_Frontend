const API_URL = "http://localhost:4000/api/v1"; 

// --- 1. CÁC HÀM CHO KHÁCH HÀNG (SHOP) ---

// Lấy danh sách sản phẩm (Trang chủ/Cửa hàng)
export async function getProducts(page = 1, limit = 12, search = "", category = "") {
  try {
    let url = `${API_URL}/products?page=${page}&limit=${limit}`;
    if (search) url += `&q=${encodeURIComponent(search)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    
    const res = await fetch(url, { cache: "no-store" });
    const result = await res.json();
    return result; // Trả về { data, total, page, limit... }
  } catch (error) {
    console.error("Lỗi getProducts:", error);
    return { data: [] };
  }
}

// Lấy chi tiết sản phẩm (Trang chi tiết)
export async function getProductBySlug(slug: string) {
  try {
    // Backend mới hỗ trợ tìm cả ID và Slug qua route này
    const res = await fetch(`${API_URL}/products/${encodeURIComponent(slug)}`, { cache: "no-store" });
    const result = await res.json();
    return result.data || null; 
  } catch (error) {
    console.error("Lỗi getProductBySlug:", error);
    return null;
  }
}

// --- 2. CÁC HÀM CHO ADMIN (QUẢN TRỊ) ---

// Lấy danh sách quản trị
export async function getAdminProducts(page = 1, search = "") {
  try {
    const res = await fetch(`${API_URL}/products?page=${page}&limit=100&q=${search}`, {
      cache: "no-store"
    });
    const result = await res.json();
    return result.data || [];
  } catch (error) {
    console.error("Lỗi getAdminProducts:", error);
    return [];
  }
}

// [MỚI] Tạo sản phẩm
export async function createProduct(data: any) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(data),
    });
    
    // Nếu server trả lỗi (VD: trùng tên slug), ta ném lỗi ra để Form hiển thị
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || err.error?.message || "Lỗi tạo sản phẩm");
    }
    
    return true;
  } catch (error) {
    console.error(error);
    return false; // Hoặc throw error nếu bạn muốn Form bắt được lỗi cụ thể
  }
}

// [MỚI] Cập nhật sản phẩm
export async function updateProduct(id: string, data: any) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT", // Router Backend đang dùng PUT
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || err.error?.message || "Lỗi cập nhật sản phẩm");
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// Xóa sản phẩm
export async function deleteProduct(id: string) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: { 
        "Authorization": `Bearer ${token}` 
      }
    });
    return res.ok;
  } catch (error) {
    console.error("Lỗi deleteProduct:", error);
    return false;
  }
}