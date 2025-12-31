const isProduction = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

const BASE_URL = isProduction
  ? "https://shop-backend-cu0m.onrender.com"  // Nếu chạy trên Web Vercel -> Dùng link Render
  : "http://localhost:4000";                  // Nếu chạy dưới máy tính -> Dùng link Localhost

console.log("🚀 Môi trường:", isProduction ? "ONLINE (Vercel)" : "OFFLINE (Localhost)");
console.log("🔗 Đang kết nối tới:", BASE_URL);

// Hàm chung để gọi API
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  const res = await fetch(url, { ...options, headers, cache: "no-store" });
  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try { const j = await res.json(); message = j?.error?.message || message; } catch {}
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}