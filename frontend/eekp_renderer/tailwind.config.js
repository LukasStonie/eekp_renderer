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
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        "offwhite": "#FFFFFF",
        "offblack": "#000000",
        "yellow": {
          "50": "#FEFDF1",
          "100": "#FEFDF1",
          "200": "#FDF8D0",
          "300": "#FCF5BE",
          "400": "#FCF3A9",
          "500": "#FBEF7A",
          "600": "#C5BB5B",
          "700": "#8F8840",
          "800": "#5D5827",
          "900": "#322F12",
          "950": "#1C1A07"
        },
        "blue": {
          "50": "#F5FAFE",
          "100": "#F1F7FD",
          "200": "#DDEDFA",
          "300": "#CEE6F8",
          "400": "#BEDEF6",
          "500": "#AAD6F4",
          "600": "#59ACD7",
          "700": "#3F7E9E",
          "800": "#275269",
          "900": "#132D3A",
          "950": "#081923"
        }

      }
    },
  },
  plugins: [],
}

