// Tự động kiểm tra môi trường
const isProduction = process.env.NODE_ENV === 'production';

// Nếu là Production (Trên Vercel) -> Dùng link Render
// Nếu là Development (Trên máy tính) -> Dùng link Localhost
const BASE_URL = isProduction
  ? "https://shop-backend-cu0m.onrender.com" 
  : "http://localhost:4000";

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