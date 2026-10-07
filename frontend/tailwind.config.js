/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          navy: "#0f172a",
          dark: "#1e293b",
          slate: "#334155",
          muted: "#64748b",
          light: "#f8fafc",
          surface: "#ffffff",
          border: "#e2e8f0"
        },
        fresh: {
          DEFAULT: "#10b981",
          hover: "#059669",
          light: "#d1fae5",
          dark: "#047857"
        },
        accent: {
          amber: "#f59e0b",
          orange: "#f97316",
          rose: "#ef4444"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px 0 rgba(15, 23, 42, 0.03)',
        'card': '0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -1px rgba(15, 23, 42, 0.04)',
        'elevated': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
