/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050b09",
        panel: "#0b1613",
        panel2: "#0e1c18",
        panel3: "#122019",
        line: "rgba(126,242,176,0.14)",
        line2: "rgba(126,242,176,0.28)",
        mint: "#8ff7bd",
        mintdim: "#6fd9a3",
        muted: "#93a3a0",
        amber: "#f2c464",
        rose: "#f28b82",
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(126,242,176,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(126,242,176,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(14px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.45 },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
