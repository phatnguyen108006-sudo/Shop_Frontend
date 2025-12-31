import { apiFetch } from '@/lib/api'; 

// --- 1. CÁC HÀM CHO KHÁCH HÀNG (SHOP) ---

// Lấy danh sách sản phẩm (Trang chủ/Cửa hàng)
export async function getProducts(page = 1, limit = 12, search = "", category = "") {
  try {
    // Chỉ cần viết phần đuôi, apiFetch tự động ghép với link Backend
    let path = `/products?page=${page}&limit=${limit}`;
    if (search) path += `&q=${encodeURIComponent(search)}`;
    if (category) path += `&category=${encodeURIComponent(category)}`;
    
    // apiFetch tự động trả về JSON, không cần await res.json() nữa
    return await apiFetch(path); 
  } catch (error) {
    console.error("Lỗi getProducts:", error);
    return { data: [] }; // Trả về rỗng để không lỗi giao diện
  }
}

// Lấy chi tiết sản phẩm (Trang chi tiết)
export async function getProductBySlug(slug: string) {
  try {
    const result: any = await apiFetch(`/products/${encodeURIComponent(slug)}`);
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
    const result: any = await apiFetch(`/products?page=${page}&limit=100&q=${search}`);
    return result.data || [];
  } catch (error) {
    console.error("Lỗi getAdminProducts:", error);
    return [];
  }
}

// [MỚI] Tạo sản phẩm
export async function createProduct(data: any) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : "";
    
    // apiFetch tự thêm Content-Type: application/json rồi
    await apiFetch('/products', {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(data),
    });
    
    return true;
  } catch (error) {
    console.error("Lỗi tạo sản phẩm:", error);
    // Nếu muốn hiện thông báo lỗi chi tiết thì throw error
    // throw error; 
    return false; 
  }
}

// [MỚI] Cập nhật sản phẩm
export async function updateProduct(id: string, data: any) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : "";
    
    await apiFetch(`/products/${id}`, {
      method: "PUT", 
      headers: { 
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(data),
    });

    return true;
  } catch (error) {
    console.error("Lỗi cập nhật sản phẩm:", error);
    return false;
  }
}

// Xóa sản phẩm
export async function deleteProduct(id: string) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : "";
    
    await apiFetch(`/products/${id}`, {
      method: "DELETE",
      headers: { 
        "Authorization": `Bearer ${token}` 
      }
    });
    return true;
  } catch (error) {
    console.error("Lỗi deleteProduct:", error);
    return false;
  }
}