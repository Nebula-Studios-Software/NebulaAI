﻿/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./Pages/**/*.cshtml",
    "./Views/**/*.cshtml",
    "./wwwroot/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#04080F",
          50: "#2B55A0",
          100: "#264D90",
          200: "#1E3C70",
          300: "#152A4F",
          400: "#0D192F",
          500: "#04080F",
          600: "#000000",
        },
        foreground: {
          DEFAULT: "#FFFFFF",
          50: "#FFFFFF",
          100: "#FFFFFF",
          200: "#FFFFFF",
          300: "#FFFFFF",
          400: "#FFFFFF",
          500: "#FFFFFF",
          600: "#E3E3E3",
          700: "#C7C7C7",
          800: "#ABABAB",
          900: "#8F8F8F",
          950: "#818181",
        },
        primary: {
          DEFAULT: "#507DBC",
          50: "#D5E0EF",
          100: "#C6D5E9",
          200: "#A9BFDE",
          300: "#8BA9D3",
          400: "#6E93C7",
          500: "#507DBC",
          600: "#3B6299",
          700: "#2B4871",
          800: "#1C2E48",
          900: "#0C1420",
          950: "#04070B",
        },
        success: {
          50: "#E8FAF0",
          100: "#D1F4E0",
          200: "#A2E9C1",
          300: "#74DFA2",
          400: "#45D483",
          500: "#17C964",
          600: "#12A150",
          700: "#0E793C",
          800: "#095028",
          900: "#052814",
        },
        info: {
          100: "#D2F1FF",
          200: "#A4DFFF",
          300: "#78C8FF",
          400: "#56B2FF",
          500: "#1E8EFF",
          600: "#156EDB",
          700: "#0F52B7",
          800: "#093993",
          900: "#05287A",
        },
        warning: {
          50: "#FEFCE8",
          100: "#FDEDD3",
          200: "#FBDBA7",
          300: "#F9C97C",
          400: "#F7B750",
          500: "#F5A524",
          600: "#C4841D",
          700: "#936316",
          800: "#62420E",
          900: "#312107",
        },
        danger: {
          50: "#FEE7EF",
          100: "#FDD0DF",
          200: "#FAA0BF",
          300: "#F871A0",
          400: "#F54180",
          500: "#F31260",
          600: "#C20E4D",
          700: "#920B3A",
          800: "#610726",
          900: "#310413",
        },
        gold: {
          DEFAULT: "#C89B3C",
          50: "#F0E4CB",
          100: "#ECDCBB",
          200: "#E3CC9B",
          300: "#DABC7C",
          400: "#D1AB5C",
          500: "#C89B3C",
          600: "#9F7A2D",
          700: "#735921",
          800: "#483714",
          900: "#1C1508",
          950: "#060502",
        },
      },
      layout: {
        disabledOpacity: "0.3",
        radius: {
          small: "4px",
          medium: "6px",
          large: "8px",
        },
        borderWidth: {
          small: "1px",
          medium: "2px",
          large: "3px",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
