import { apiFetch } from '@/lib/api';

// Đăng nhập
export const loginService = async (email: string, password: string) => {
  return await apiFetch('/auth/login', {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

// Đăng ký
export const registerService = async (name: string, email: string, password: string) => {
  return await apiFetch('/auth/register', {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
};

// Lấy thông tin user hiện tại
export const getMeService = async (token: string) => {
  return await apiFetch('/auth/me', {
    method: "GET",
    headers: { 
      "Authorization": `Bearer ${token}`
    },
  });
};