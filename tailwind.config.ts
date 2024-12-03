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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#8B5CF6", // Violet vif pour l'accent principal
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#7E69AB", // Violet plus doux pour les éléments secondaires
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#6E59A5", // Violet tertiaire pour les accents
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#ea384c", // Rouge pour les alertes et erreurs
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F1F0FB", // Violet très clair pour le fond
          foreground: "#6E59A5",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1F2C", // Violet très foncé pour le texte
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;