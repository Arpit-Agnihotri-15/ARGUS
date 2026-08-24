/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050b09",
        panel: "#0b1613",
        panel2: "#0e1c18",
        line: "rgba(126,242,176,0.14)",
        mint: "#8ff7bd",
        mintdim: "#6fd9a3",
        muted: "#93a3a0",
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
    },
  },
  plugins: [],
}
