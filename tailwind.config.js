/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#25293D",
        secondary: {
          light: "#E8EAEA",
          dark: "#626572",
        },
        grad: {
          one: "#B5F0EE",
          two: "#FFD3B6",
          three: "#FF8B94",
        },
        c_purple: {
          light: "#B5F0EE",
          dark: "#7ceae5",
        },
        c_yellow: {
          light: "#FFD3B6",
          dark: "#fcc5a1",
        },
        c_blue: {
          light: "#FF8B94",
          dark: "#f2767e",
        },
      },
    },
  },
  plugins: [],
};
