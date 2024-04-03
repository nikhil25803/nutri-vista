import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        backgroundDark: "#000000",
        backgroundLight: "#0F0F0F",
        textWhite: "#FFFFFF",
        textDark: "#E86144",
        textLight: "#C2C2C2",
        textGrey: "#394A62",
      },
      fontFamily: {
        poppins: ["Poppins"],
        quantico: ["Quantico", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
