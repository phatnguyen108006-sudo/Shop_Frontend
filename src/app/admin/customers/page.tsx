"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  User,
  Mail,
  Calendar,
  Shield,
  UserPlus,
  Lock,
  Loader2,
  PencilLine,
  Save,
  X,
  KeyRound,
  RotateCcw,
} from "lucide-react";
import { createAdmin, getCustomers, resetUserPassword, updateUser } from "@/services/customers";

type Account = {
  _id?: string;
  id?: string | number;
  name?: string;
  email?: string;
  role?: "user" | "admin";
  createdAt?: string;
};

type EditForm = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type PasswordForm = {
  id: string;
  currentAdminPassword: string;
  password: string;
  confirmPassword: string;
};

export default function CustomersPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | "user" | "admin">("");
  const [total, setTotal] = useState(0);
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "" });
  const [savingAdmin, setSavingAdmin] = useState(false);
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditForm | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  const currentUserEmail = useMemo(() => {
    if (typeof window === "undefined") return "";
    const raw = localStorage.getItem("user");
    if (!raw) return "";
    try {
      return JSON.parse(raw)?.email?.toLowerCase?.() || "";
    } catch {
      return "";
    }
  }, []);

  const fetchAccounts = async (keyword = "", role = roleFilter) => {
    setLoading(true);
    const res = await getCustomers(1, keyword, role);
    if (res && res.data) {
      setAccounts(res.data);
      setTotal(res.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAccounts(search, roleFilter);
    }, 250);
    return () => clearTimeout(timeout);
  }, [search, roleFilter]);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerMsg(null);
    setSuccessMsg(null);

    if (createForm.name.trim().length < 2) {
      setServerMsg("Tên admin tối thiểu 2 ký tự");
      return;
    }

    if (!createForm.email.trim() || !createForm.password.trim()) {
      setServerMsg("Vui lòng nhập đủ tên, email và mật khẩu");
      return;
    }

    if (createForm.password.trim().length < 6) {
      setServerMsg("Mật khẩu admin tối thiểu 6 ký tự");
      return;
    }

    setSavingAdmin(true);
    try {
      await createAdmin({
        name: createForm.name.trim(),
        email: createForm.email.trim(),
        password: createForm.password,
      });
      setSuccessMsg("Tạo tài khoản admin thành công. Mật khẩu chỉ hiển thị lúc nhập và không thể xem lại sau khi lưu.");
      setCreateForm({ name: "", email: "", password: "" });
      fetchAccounts(search, roleFilter);
    } catch (error: any) {
      setServerMsg(error.message || "Không thể tạo tài khoản admin");
    } finally {
      setSavingAdmin(false);
    }
  };

  const startEdit = (account: Account) => {
    setServerMsg(null);
    setSuccessMsg(null);
    setPasswordForm(null);
    setEditing({
      id: String(account.id || account._id),
      name: account.name || "",
      email: account.email || "",
      role: (account.role || "user") as "user" | "admin",
    });
  };

  const cancelEdit = () => setEditing(null);

  const startPasswordReset = (account: Account) => {
    setServerMsg(null);
    setSuccessMsg(null);
    setEditing(null);
    setPasswordForm({
      id: String(account.id || account._id),
      currentAdminPassword: "",
      password: "",
      confirmPassword: "",
    });
  };

  const cancelPasswordReset = () => setPasswordForm(null);

  const handleSaveEdit = async () => {
    if (!editing) return;

    if (editing.name.trim().length < 2) {
      setServerMsg("Tên tài khoản tối thiểu 2 ký tự");
      return;
    }

    if (!editing.email.trim()) {
      setServerMsg("Email không được để trống");
      return;
    }

    const account = accounts.find((item) => String(item.id || item._id) === editing.id);
    const isCurrentAdmin = (account?.email || "").toLowerCase() === currentUserEmail;

    if (isCurrentAdmin && editing.role !== "admin") {
      setServerMsg("Bạn không thể tự gỡ quyền admin của chính mình");
      return;
    }

    setSavingEdit(true);
    setServerMsg(null);
    setSuccessMsg(null);

    try {
      await updateUser(editing.id, {
        name: editing.name.trim(),
        email: editing.email.trim(),
        role: editing.role,
      });
      setSuccessMsg(
        editing.role === "admin"
          ? "Đã cập nhật tài khoản và phân quyền admin."
          : "Đã cập nhật tài khoản và gỡ quyền admin nếu có."
      );
      setEditing(null);
      fetchAccounts(search, roleFilter);
    } catch (error: any) {
      setServerMsg(error.message || "Không thể cập nhật tài khoản");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleSavePassword = async () => {
    if (!passwordForm) return;

    if (passwordForm.currentAdminPassword.trim().length < 6) {
      setServerMsg("Vui lòng nhập mật khẩu hiện tại của admin để xác nhận");
      return;
    }

    if (passwordForm.password.trim().length < 6) {
      setServerMsg("Mật khẩu mới tối thiểu 6 ký tự");
      return;
    }

    if (passwordForm.password !== passwordForm.confirmPassword) {
      setServerMsg("Mật khẩu xác nhận không khớp");
      return;
    }

    setSavingPassword(true);
    setServerMsg(null);
    setSuccessMsg(null);

    try {
      await resetUserPassword(passwordForm.id, passwordForm.currentAdminPassword, passwordForm.password);
      setSuccessMsg("Đã đặt lại mật khẩu. Hệ thống chỉ lưu mật khẩu dưới dạng băm và không thể hiển thị lại.");
      setPasswordForm(null);
    } catch (error: any) {
      setServerMsg(error.message || "Không thể đặt lại mật khẩu");
    } finally {
      setSavingPassword(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý tài khoản</h1>
              <p className="text-gray-500">Theo dõi toàn bộ user và admin trong hệ thống ({total})</p>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[260px] flex-1">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Tìm theo tên, email hoặc vai trò..."
                  className="w-full rounded-xl border py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-black"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as "" | "user" | "admin")}
                className="rounded-xl border px-3 py-2.5 outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Tất cả vai trò</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <RotateCcw size={16} />
                Làm mới
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-500">Kết quả cập nhật tự động khi bạn nhập từ khóa hoặc đổi bộ lọc vai trò.</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-gray-900 p-2 text-white">
              <UserPlus size={18} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Tạo tài khoản admin</h2>
              <p className="text-sm text-gray-500">Tạo mới một tài khoản có quyền vào khu vực quản trị.</p>
            </div>
          </div>

          {serverMsg && <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{serverMsg}</div>}
          {successMsg && <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMsg}</div>}

          <form onSubmit={handleCreateAdmin} className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Tên hiển thị</span>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-black"
                  placeholder="Ví dụ: Quản trị viên"
                  disabled={savingAdmin}
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Email đăng nhập</span>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl border py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-black"
                  placeholder="admin@example.com"
                  disabled={savingAdmin}
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Mật khẩu ban đầu</span>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full rounded-xl border py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-black"
                  placeholder="Tối thiểu 6 ký tự"
                  disabled={savingAdmin}
                />
              </div>
            </label>

            <p className="text-xs leading-5 text-gray-500">
              Sau khi lưu, mật khẩu chỉ còn tồn tại ở dạng băm bảo mật nên không ai xem lại được, kể cả admin hiện tại.
            </p>

            <button
              type="submit"
              disabled={savingAdmin}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {savingAdmin ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
              {savingAdmin ? "Đang tạo..." : "Tạo admin"}
            </button>
          </form>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-gray-500">Đang tải danh sách...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50 font-medium text-gray-600">
                <tr>
                  <th className="px-6 py-4">Tài khoản</th>
                  <th className="px-6 py-4">Liên hệ</th>
                  <th className="px-6 py-4">Quyền</th>
                  <th className="px-6 py-4">Ngày tạo</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {accounts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-400">Không tìm thấy tài khoản nào</td>
                  </tr>
                ) : (
                  accounts.map((account, index) => {
                    const accountId = String(account.id || account._id || `account-${index}`);
                    const isEditing = editing?.id === accountId;
                    const isCurrentAdmin = (account.email || "").toLowerCase() === currentUserEmail;

                    return (
                      <tr key={accountId} className="transition hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-500">
                              {(isEditing ? editing.name : account.name)?.charAt(0).toUpperCase() || <User size={20} />}
                            </div>
                            <div className="min-w-[220px]">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editing.name}
                                  onChange={(e) => setEditing((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
                                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                                />
                              ) : (
                                <p className="font-bold text-gray-900">{account.name || "Chưa đặt tên"}</p>
                              )}
                              <p className="text-xs text-gray-500">ID: {accountId.slice(-6)}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="min-w-[240px]">
                            {isEditing ? (
                              <input
                                type="email"
                                value={editing.email}
                                onChange={(e) => setEditing((prev) => (prev ? { ...prev, email: e.target.value } : prev))}
                                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                              />
                            ) : (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Mail size={14} /> {account.email || "Không có email"}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {isEditing ? (
                            <select
                              value={editing.role}
                              onChange={(e) => setEditing((prev) => (prev ? { ...prev, role: e.target.value as "user" | "admin" } : prev))}
                              disabled={isCurrentAdmin}
                              className="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black disabled:cursor-not-allowed disabled:bg-gray-100"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              account.role === "admin" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                            }`}>
                              <Shield size={12} /> {account.role || "user"}
                            </span>
                          )}
                          {isCurrentAdmin && <p className="mt-1 text-xs text-gray-400">Tài khoản đang đăng nhập</p>}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            {account.createdAt ? new Date(account.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={handleSaveEdit}
                                  disabled={savingEdit}
                                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-black disabled:opacity-70"
                                >
                                  {savingEdit ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                  Lưu
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                                >
                                  <X size={14} />
                                  Hủy
                                </button>
                              </>
                            ) : passwordForm?.id === accountId ? (
                              <>
                                <button
                                  type="button"
                                  onClick={handleSavePassword}
                                  disabled={savingPassword}
                                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-black disabled:opacity-70"
                                >
                                  {savingPassword ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                  Lưu mật khẩu
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelPasswordReset}
                                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                                >
                                  <X size={14} />
                                  Hủy
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => startEdit(account)}
                                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                  <PencilLine size={14} />
                                  Sửa tài khoản
                                </button>
                                <button
                                  type="button"
                                  onClick={() => startPasswordReset(account)}
                                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                  <KeyRound size={14} />
                                  Đặt lại mật khẩu
                                </button>
                              </>
                            )}
                          </div>

                          {passwordForm?.id === accountId && (
                            <div className="mt-3 min-w-[280px] space-y-2">
                              <input
                                type="password"
                                value={passwordForm.currentAdminPassword}
                                onChange={(e) =>
                                  setPasswordForm((prev) => (prev ? { ...prev, currentAdminPassword: e.target.value } : prev))
                                }
                                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                                placeholder="Mật khẩu hiện tại của admin"
                              />
                              <input
                                type="password"
                                value={passwordForm.password}
                                onChange={(e) => setPasswordForm((prev) => (prev ? { ...prev, password: e.target.value } : prev))}
                                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                                placeholder="Mật khẩu mới"
                              />
                              <input
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) =>
                                  setPasswordForm((prev) => (prev ? { ...prev, confirmPassword: e.target.value } : prev))
                                }
                                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                                placeholder="Nhập lại mật khẩu mới"
                              />
                              <p className="text-xs text-gray-500">
                                Để an toàn, admin phải xác nhận mật khẩu hiện tại của mình trước khi đặt mật khẩu mới cho tài khoản khác.
                                Hệ thống không lưu và không hiển thị mật khẩu cũ.
                              </p>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
