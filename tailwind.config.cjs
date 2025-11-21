/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,js,tsx,jsx}"],
  theme: {
    extend: {
      colors: {
        eo_orange: "#fa4616",
        eo_blue: {
          100: "#00bfc7",
          200: "#002060",
        },
        eo_gray_products: "#e9e9e9",
        eo_gray_footer: "#4d4d4d",
        eo_gray_sticky: "#b1b1b1",
        eo_gray_strong_sticky: "#4d4d4d",
      },
    },
    container: {
      // screens: {
      //   sm: "860px",
      //   md: "1028px",
      //   lg: "1240px",
      // },
      screens: {
        sm: "640px",
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1536px",
        // => @media (min-width: 1536px) { ... }
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
};
