import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: "#f8fafc",
          900: "#0f172a",
        },
        convex: {
          orange: "#ff6b35",
        },
      },
    },
  },
  plugins: [],
};

export default config;


