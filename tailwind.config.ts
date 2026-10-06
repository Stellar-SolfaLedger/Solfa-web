import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        stellar: {
          50: "#f0f4ff",
          100: "#e0eaff",
          200: "#c7d7fe",
          300: "#a4bbfd",
          400: "#7c95fb",
          500: "#586bf6",
          600: "#3d4ae9",
          700: "#3138d0",
          800: "#2a2fa8",
          900: "#272c85",
        },
      },
    },
  },
  plugins: [],
};
export default config;
