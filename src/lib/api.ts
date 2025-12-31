// --- PHẦN 1: Cấu hình URL API ---
// const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1";
const API_URL = "https://shop-backend-cu0m.onrender.com/api/v1";
console.log("🔗 API Base URL:", API_URL);

// --- PHẦN 2: Hàm gọi API ---
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  // Cache: "no-store" để dữ liệu luôn mới nhất
  const res = await fetch(url, { ...options, headers, cache: "no-store" });

  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try { 
        const j = await res.json(); 
        message = j?.error?.message || message; 
    } catch {}
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}