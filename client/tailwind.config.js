/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        agri: { DEFAULT: "#166534", light: "#dcfce7" },
        health: { DEFAULT: "#0369a1", light: "#e0f2fe" },
        finance: { DEFAULT: "#1e3a8a", gold: "#d4af37" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};