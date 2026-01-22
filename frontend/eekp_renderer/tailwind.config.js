/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        "offwhite": "#fefef3",
        "offblack": "#030301",
        "my-yellow": {
          "50": "#fefce6",
          "100": "#fdf8ce",
          "200": "#fbf29d",
          "300": "#faeb6b",
          "400": "#f8e53a",
          "500": "#f6de09",
          "600": "#c5b207",
          "700": "#948505",
          "800": "#625904",
          "900": "#312c02",
          "950": "#221f01"
        }
      }
    },
  },
  plugins: [],
}

