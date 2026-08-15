import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#EA1D2C",
          background: "#F7F7F7",
          surface: "#FFFFFF",
          text: "#2F2F2F",
          muted: "#717171",
          success: "#2E9B62",
        },
      },
      boxShadow: {
        soft: "0 16px 40px rgba(47, 47, 47, 0.08)",
      },
    },
  },
  plugins: [],
}

export default config
