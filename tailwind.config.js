/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./imgs/**/*.{html,js}", "./styles/**/*.css"],
  theme: {
    extend: {
      backgroundImage: {
        home: "url('/imgs/bg.jpg')",
      },
    },
  },
  plugins: [],
};
