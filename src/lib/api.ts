const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000/api/v1";

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });

  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;

    try {
      const json = await res.json();
      message = json?.error?.message || json?.message || message;
    } catch {}

    throw new Error(message);
  }

  return res.json() as Promise<T>;
}
