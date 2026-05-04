import { apiFetch } from "@/lib/api";

export async function getCustomers(page = 1, search = "", role = "") {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
    const params = new URLSearchParams({
      page: String(page),
      limit: "10",
      q: search,
      role,
    });

    const result: any = await apiFetch(`/customers?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result || { data: [], total: 0 };
  } catch (error) {
    console.error("Lỗi lấy danh sách tài khoản:", error);
    return { data: [], total: 0 };
  }
}

export async function createAdmin(payload: { name: string; email: string; password: string }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  return await apiFetch("/customers/admin", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function updateUser(id: string, payload: { name: string; email: string; role: "user" | "admin" }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  return await apiFetch(`/customers/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function resetUserPassword(id: string, currentAdminPassword: string, password: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  return await apiFetch(`/customers/${id}/password`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentAdminPassword, password }),
  });
}
