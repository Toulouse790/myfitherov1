import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#9b87f5",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#7E69AB",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F97316",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#ea384c",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F6F6F7",
          foreground: "#555555",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      boxShadow: {
        'custom': '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "exercise-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "exercise-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(0.95)" },
        },
        "exercise-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        }
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        "exercise-bounce": "exercise-bounce 1s ease-in-out infinite",
        "exercise-pulse": "exercise-pulse 2s ease-in-out infinite",
        "exercise-spin": "exercise-spin 1s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
