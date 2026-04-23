import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        muted: "#6B7280",
        card: "#FFFFFF",
        border: "rgba(17, 24, 39, 0.10)"
      },
      boxShadow: {
        card: "0 10px 30px rgba(17, 24, 39, 0.10)"
      }
    }
  },
  plugins: []
} satisfies Config;

