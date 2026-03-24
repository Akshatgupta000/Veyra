/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1e90ff",
        secondary: "#9B8069",
        "soft-pink": "#fce4e4"
      },
      transitionProperty: { height: "height" },
      fontFamily: {
        marcellus: ['"Marcellus"', 'serif']
      }
    },
  },
  variants: {
    extend: {
      visibility: ['group-hover'],
      opacity: ['group-hover'],
    },
  },
  plugins: [],
};
