const API_URL = "http://localhost:4000/api/v1";

export async function getCustomers(page = 1, search = "") {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/customers?page=${page}&limit=10&q=${search}`, {
      headers: { 
        "Authorization": `Bearer ${token}` 
      },
      cache: "no-store",
    });
    
    if (!res.ok) return { data: [], total: 0 };
    return await res.json();
  } catch (error) {
    console.error("Lỗi lấy danh sách khách hàng:", error);
    return { data: [], total: 0 };
  }
}