import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        leaf: {
          900: "#123B16",
          800: "#1B5E20",
          700: "#2E7D32",
          100: "#E8F4EA"
        },
        amber: {
          500: "#FFB300",
          100: "#FFF4D6"
        },
        stonewarm: {
          950: "#161915",
          700: "#555C52",
          200: "#E8E1D5",
          100: "#F5F1EA"
        }
      },
      fontFamily: {
        heading: ["Poppins", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 22px 70px rgba(18, 59, 22, 0.12)",
        line: "0 1px 0 rgba(22, 25, 21, 0.08)"
      },
      backgroundImage: {
        "batik-lines":
          "linear-gradient(135deg, rgba(27,94,32,0.07) 25%, transparent 25%), linear-gradient(225deg, rgba(255,179,0,0.08) 25%, transparent 25%)"
      }
    }
  },
  plugins: []
};

export default config;
