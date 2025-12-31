"use client";

import { useState, useEffect } from "react";

export default function GrayscaleButton() {
  const [isGrayscale, setIsGrayscale] = useState(false);

  // useEffect này sẽ chạy mỗi khi biến isGrayscale thay đổi
  useEffect(() => {
    if (isGrayscale) {
      document.body.classList.add("grayscale"); // Thêm class grayscale vào body
    } else {
      document.body.classList.remove("grayscale"); // Xóa class grayscale khỏi body
    }
  }, [isGrayscale]);

  return (
    <button
      onClick={() => setIsGrayscale(!isGrayscale)}
      className="fixed bottom-5 right-5 z-50 rounded-full bg-black px-4 py-2 text-white shadow-lg hover:bg-gray-800 transition-all"
    >
      {isGrayscale ? "Màu sắc" : "Trắng đen"}
    </button>
  );
}