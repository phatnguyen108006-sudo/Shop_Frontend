import { apiFetch } from '@/lib/api';

// Đăng nhập
export const loginService = async (email: string, password: string) => {
  return await apiFetch('/auth/login', {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });
};

// Đăng ký
export const registerService = async (name: string, email: string, password: string) => {
  return await apiFetch('/auth/register', {
    method: "POST",
    body: JSON.stringify({ name, email: email.trim().toLowerCase(), password }),
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

export const changePasswordService = async (
  token: string,
  payload: { currentPassword: string; newPassword: string; confirmPassword: string }
) => {
  return await apiFetch('/auth/change-password', {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });
};
