/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-inactive": "linear-gradient(145deg, #e6e6e6, #e6e6e6)",
        "gradient-active": "linear-gradient(145deg, #cfcfcf, #f6f6f6)",
        "gradient-red": "linear-gradient(145deg, #eb2929, #c62222)",
        "gradient-background":
          "linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(230,230,230,1) 30%, rgba(225,225,225,1) 100%)",
      },
      fontFamily: {
        sans: ["Noto Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
