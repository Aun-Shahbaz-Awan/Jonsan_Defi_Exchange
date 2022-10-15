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
          light: "#F0F3F4",
          dark: "#626572",
        },
        grad: {
          one: "#F0E3F6",
          two: "#FFEBE8",
          three: "#DEFEF6",
        },
        c_purple: {
          light: "#F0F3FD",
          drak: "#FBEFFD",
        },
        c_yellow: {
          light: "#FEF2DF",
          dark: "#FEF3CA",
        },
        c_blue: {
          light: "#E1F6F8",
          drak: "#D3F3F4",
        },
      },
    },
  },
  plugins: [],
};
