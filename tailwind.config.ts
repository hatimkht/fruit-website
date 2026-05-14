import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        // Paper-inspired palette — off-white surfaces, anthracite text, muted institutional blue
        paper: {
          DEFAULT: "#FAFAF7",
          50: "#FCFCFA",
          100: "#F6F6F1",
          200: "#EFEFE8",
          300: "#E4E4DA",
        },
        ink: {
          DEFAULT: "#1A1A1C",
          soft: "#2B2B2F",
          muted: "#55555C",
          subtle: "#86868E",
        },
        rule: {
          DEFAULT: "#E4E4DA",
          soft: "#EDEDE5",
        },
        accent: {
          DEFAULT: "#1E3A5F",
          soft: "#2C4F7C",
          muted: "#5C7693",
          tint: "#E6ECF3",
        },
        threshold: {
          DEFAULT: "#A6564A",
          tint: "#F3E2DE",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        display: ["clamp(2.4rem, 5vw, 4.2rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        hero: ["clamp(1.8rem, 3.5vw, 2.75rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        paper: "0 1px 2px rgba(26,26,28,0.04), 0 8px 24px -12px rgba(26,26,28,0.08)",
        ballot: "0 1px 2px rgba(26,26,28,0.05), 0 20px 60px -24px rgba(26,26,28,0.18)",
        subtle: "0 1px 0 rgba(26,26,28,0.04)",
      },
      borderRadius: {
        lg: "14px",
        xl: "18px",
        "2xl": "22px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "stamp": {
          "0%": { opacity: "0", transform: "scale(1.6) rotate(-14deg)" },
          "60%": { opacity: "0.9", transform: "scale(0.94) rotate(-6deg)" },
          "100%": { opacity: "0.85", transform: "scale(1) rotate(-6deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 400ms ease-out both",
        "stamp": "stamp 520ms cubic-bezier(.2,.7,.2,1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
