const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "./src/**/*.{vue,ts}"],
  safelist: [
    "text-slate-800",
    "text-slate-700",
    "text-slate-600",
    "text-slate-500",
    "text-brand-900",
    "text-brand-700",
    "text-brand-600",
    "text-brand-200",
    "bg-haze",
    "bg-brand-600",
    "bg-brand-700",
    "border-brand-100",
    "border-brand-50/60",
    "border-brand-50/80",
    "border-brand-600",
    "border-brand-100",
    "bg-white/95",
    "bg-white/90",
    "bg-white/80",
    "bg-white/10",
    "bg-accent-gold/25",
    "hover:bg-accent-gold/35",
    "hover:bg-brand-700",
    "hover:text-brand-600",
    "tracking-tight",
  ],
  theme: {
    colors: {
      ...colors,
      brand: {
        50: "#E6ECFF",
        100: "#C5D0FF",
        200: "#9AAEFF",
        300: "#718DFF",
        400: "#4668F0",
        500: "#1D42D8",
        600: "#102CAB",
        700: "#081760",
        800: "#040D35",
        900: "#02071E",
      },
      alert: "#B91C1C",
      accent: {
        gold: "#FBDE1E",
      },
      haze: "#F2F4FF",
    },
    extend: {
      boxShadow: {
        card: "0 25px 60px rgba(2,7,30,0.18)",
      },
      borderRadius: {
        xl: "1.15rem",
        "2xl": "1.75rem",
      },
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
      heading: ["'Space Grotesk'", "Inter", "system-ui", "sans-serif"],
      body: ["Inter", "system-ui", "sans-serif"],
      sans: ["Inter", "system-ui", "sans-serif"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
