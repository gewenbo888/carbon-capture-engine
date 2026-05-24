import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // deep ocean–atmosphere void — the dark planet every system is rendered against
        ink: {
          950: "#04070d",
          900: "#070c15",
          800: "#0c1320",
          700: "#13202f",
          600: "#1d2f44",
          500: "#2b4258",
        },
        // azure — atmosphere, sky, the luminous primary; the glow of a live climate readout
        azure: {
          600: "#1f7fd6",
          500: "#37b6f6",
          400: "#6cc6ff",
          300: "#a9def8",
        },
        // emerald — the biosphere, life, biological carbon, capture and absorption
        emerald: {
          600: "#10936a",
          500: "#2bd48b",
          400: "#5ee6a8",
          300: "#9af2cb",
        },
        // ember — industry, combustion, fossil carbon, emissions and heat
        ember: {
          600: "#c5631a",
          500: "#f5923c",
          400: "#ffb368",
          300: "#ffce9c",
        },
        // violet — intelligence, AI coordination, geoengineering, the future-management layer
        violet: {
          600: "#6a4fd0",
          500: "#9a7dfa",
          400: "#b89dff",
          300: "#d7c8ff",
        },
        // cool readout neutrals — text on the planetary substrate
        ghost: {
          50: "#f3f8fb",
          100: "#e4edf2",
          200: "#bdccd6",
          300: "#8798a6",
          500: "#566472",
          700: "#2a3744",
        },
      },
      fontFamily: {
        display: ['"Sora"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"Manrope"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        zh: ['"Noto Sans SC"', "sans-serif"],
      },
      boxShadow: {
        panel: "inset 0 1px 0 rgba(169,222,248,0.06), 0 24px 60px -28px rgba(0,0,0,0.94)",
        glow: "0 0 40px -8px rgba(55,182,246,0.55)",
        glowember: "0 0 36px -8px rgba(245,146,60,0.5)",
        glowviolet: "0 0 36px -8px rgba(154,125,250,0.5)",
        glowemerald: "0 0 36px -8px rgba(43,212,139,0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
