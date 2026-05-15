import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black:  "#0A0A0A",
          orange: "#FF6B35",
          steel:  "#2C3E50",
          light:  "#F4F6F8",
          green:  "#00E676",
          yellow: "#FFC107",
        },
      },
      fontFamily: {
        heading: ["var(--font-montserrat)", "sans-serif"],
        body:    ["var(--font-inter)",      "sans-serif"],
        mono:    ["var(--font-roboto-mono)","monospace"],
      },
      backgroundImage: {
        "orange-gradient": "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
