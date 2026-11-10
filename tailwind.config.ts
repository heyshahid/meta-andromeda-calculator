import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F9FC",
        card: "#FFFFFF",
        primary: {
          DEFAULT: "#14213D",
          navy: "#14213D",
        },
        brand: {
          blue: "#2563EB",
          light: "#EFF6FF",
          hover: "#1D4ED8",
        },
        status: {
          success: "#16A34A",
          warning: "#D97706",
          error: "#DC2626",
        },
        text: {
          main: "#172033",
          secondary: "#64748B",
          muted: "#94A3B8",
        },
        border: "#E2E8F0",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      fontSize: {
        'page-title': ['1.75rem', { lineHeight: '2.25rem', fontWeight: '700' }], // 28px
        'section-title': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }], // 20px
        'body': ['0.9375rem', { lineHeight: '1.5rem', fontWeight: '400' }], // 15px
        'secondary': ['0.8125rem', { lineHeight: '1.25rem', fontWeight: '500' }], // 13px
        'kpi': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }], // 30px
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
};

export default config;

