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
        sans: ['SF Pro Display', 'Roboto', 'system-ui', 'sans-serif'],
        heading: ['SF Pro Display', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Primary Colors
        'deep-blue': '#1E3D59',
        'emerald': '#17B890',
        'dynamic-orange': '#FF6B6B',
        
        // Secondary Colors
        'pure-white': '#FFFFFF',
        'light-gray': '#F5F7FA',
        'dark-gray': '#4A4A4A',

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#1E3D59",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#17B890",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#FF6B6B",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#FF6B6B",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F5F7FA",
          foreground: "#4A4A4A",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      spacing: {
        '1': '8px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
        '5': '40px',
        '6': '48px',
      },
      borderRadius: {
        'button': '12px',
        'card': '16px',
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      boxShadow: {
        'card': '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
      },
      fontSize: {
        'title': '24px',
        'subtitle': '18px',
        'body': '16px',
        'caption': '14px',
      },
      scale: {
        '98': '0.98',
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "button-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.98)" },
        },
        "progress": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        }
      },
      animation: {
        "fade-up": "fade-up 0.3s ease-out",
        "button-pulse": "button-pulse 0.3s ease-in-out",
        "progress": "progress 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;