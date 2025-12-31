const API_URL = "http://localhost:4000/api/v1";

export async function getDashboardStats() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/stats`, {
      headers: { "Authorization": `Bearer ${token}` },
      cache: "no-store",
    });
    
    if (!res.ok) return null;
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}