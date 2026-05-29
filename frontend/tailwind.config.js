/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        flash: {
          orange: "#ff7a00",
          black: "#111111"
        }
      },
      boxShadow: {
        panel: "0 18px 50px rgba(17, 24, 39, 0.18)"
      }
    }
  },
  plugins: []
};
