/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-bg": "#F9FAFB",
        "brand-darkbg": "#0B1120",
        brand: "#0E2A47",
        "brand-light": "#1F4068",
        "brand-accent": "#2F80ED",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
