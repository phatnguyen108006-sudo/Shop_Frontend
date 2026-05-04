import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = loginSchema
  .extend({
    name: z.string().min(2, "Tên tối thiểu 2 ký tự"),
    confirmPassword: z.string().min(6, "Vui lòng nhập xác nhận mật khẩu"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  });
export type RegisterValues = z.infer<typeof registerSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Mật khẩu hiện tại tối thiểu 6 ký tự"),
    newPassword: z.string().min(6, "Mật khẩu mới tối thiểu 6 ký tự"),
    confirmPassword: z.string().min(6, "Vui lòng nhập lại mật khẩu mới"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  })
  .refine((v) => v.currentPassword !== v.newPassword, {
    message: "Mật khẩu mới phải khác mật khẩu hiện tại",
    path: ["newPassword"],
  });
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
