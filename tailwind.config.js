/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  variants: {
    animation: ["responsive"],
  },
  theme: {
    keyframes: {
      fadeIn: {
        from: {
          opacity: "0",
        },
        to: {
          opacity: "1",
        },
      },
      fadeOut: {
        from: {
          opacity: "1",
        },
        to: {
          opacity: "0",
        },
      },
    },
    animation: {
      fadeIn: "fadeIn 200ms ease-in",
      fadeOut: "fadeOut 200ms ease-out",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "background-color-website": "rgb(45, 45, 45)",
        "header-background-color": "rgb(0, 27, 45)",
        "header-background-color-transparent": "rgba(0, 27, 45, 0.8)",
        "blue-accent": "#04d4e3",
        "base-text-color": "#fcfcfc",
        titleWhite: "#c6c4c8",
        "connect-wallet-colors": "rgb(62, 62, 62)",
      },
    },
  },
  plugins: [],
};
