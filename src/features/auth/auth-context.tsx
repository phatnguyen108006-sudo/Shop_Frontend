"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getMeService } from "@/services/auth";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
}

type MeResponse = {
  ok: boolean;
  user?: User;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await getMeService(token) as MeResponse;
          if (res.ok && res.user) {
            setUser(res.user);
            localStorage.setItem("role", res.user.role);
          } else {
            logout();
          }
        } catch (_error) {
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userData.role);
    setUser(userData);

    if (userData.role === "admin") router.push("/admin");
    else router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
