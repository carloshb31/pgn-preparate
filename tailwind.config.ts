import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 50: "#eef3fb", 100: "#d9e3f4", 600: "#1f3f73", 700: "#173260", 800: "#10254a", 900: "#0b1a36" },
        azul: { 400: "#4f86d6", 500: "#2f6bc4", 600: "#2458a6" },
        ok: { 50: "#ecfdf3", 500: "#16a34a", 700: "#15803d" },
        bad: { 50: "#fef2f2", 500: "#dc2626", 700: "#b91c1c" },
        warn: { 50: "#fffbeb", 500: "#d97706", 700: "#b45309" }
      },
      fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"] }
    }
  },
  plugins: []
};
export default config;
