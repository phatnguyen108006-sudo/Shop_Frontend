"use client";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Kiểm tra class dark lúc mới load
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      // 👇 Đã xóa 'fixed bottom-5 right-5'. Giờ nó là nút bình thường.
      className="p-2 ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
      title="Chuyển chế độ Sáng/Tối"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}