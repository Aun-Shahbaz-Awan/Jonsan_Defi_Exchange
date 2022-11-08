/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // primary: "#25293D",
        // secondary: {
        //   light: "#E8EAEA",
        //   dark: "#626572",
        // },
        primary: "#25293D",
        secondary: {
          light: "#E8EAEA",
          dark: "#626572",
        },
        grad: {
          one: "#F0E3F6",
          two: "#FFEBE8",
          three: "#DEFEF6",
        },
        c_purple: {
          light: "#F1F2FD",
          dark: "#EDE6FB",
        },
        c_yellow: {
          light: "#FEF2DF",
          dark: "#FFE9BD",
        },
        c_blue: {
          light: "#E0F5F7",
          dark: "#C4EDF1",
        },
      },
    },
  },
  plugins: [],
};
