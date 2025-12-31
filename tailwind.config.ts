import type { Config } from "tailwindcss";

const config: Config = {
  // 👇 QUAN TRỌNG: Dòng này giúp bạn bật tắt chế độ tối bằng class (nút bấm)
  darkMode: "class", 
  
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Nếu bạn dùng thư mục src, hãy bỏ comment dòng dưới:
    // "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bạn có thể định nghĩa thêm màu ở đây nếu muốn
      },
    },
  },
  plugins: [],
};
export default config;