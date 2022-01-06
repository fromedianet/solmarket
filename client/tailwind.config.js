/* eslint-disable no-undef */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      lineClamp: {
        7: "7",
        8: "8",
        9: "9",
        10: "10",
      },
      colors: {
        "--bg-color-primary": "#09080d",
        "--bg-color-secondary": "#1c1929",
        "--bg-color-third": "#1c1929",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
  variants: {
    lineClamp: ["responsive", "hover"],
  },
};
