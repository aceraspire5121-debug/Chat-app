/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/**/*.html",
    "./frontend/**/*.js"
  ],
  theme: {
    extend: {
      screens: {
        mob: "820px",   // 👈 custom breakpoint (exact 820px)
      },
      colors: {
        primary: "#3b82f6",
        secondary: "#facc15"
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
}
