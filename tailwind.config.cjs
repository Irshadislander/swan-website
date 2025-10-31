/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "./src/**/*.{vue,ts}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eef3fb",
          100: "#cfdcf4",
          200: "#a8c0eb",
          300: "#7fa4e1",
          400: "#4c7bcf",
          500: "#2453b5",
          600: "#1a479b",
          700: "#173883",
          800: "#122a63",
          900: "#0d214f",
        },
        accent: {
          50:  "#fff8e6",
          100: "#ffefbf",
          200: "#ffe48c",
          300: "#ffd95a",
          400: "#ffce2b",
          500: "#f5c10d",
        },
        haze: "#f4f7fb",
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 24px rgba(13,33,79,0.10)",
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
