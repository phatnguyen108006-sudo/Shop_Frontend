const BASE_URL = process.env.NODE_ENV === 'production'
  ? "https://shop-backend-cu0m.onrender.com" 
  : "http://localhost:4000";

console.log("🔗 API Base URL:", BASE_URL);

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