import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "16px",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['SF Pro Display', 'Roboto', 'system-ui', 'sans-serif'],
        heading: ['SF Pro Display', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'main-title': '24px',
        'secondary-title': '18px',
        'button': '14px',
        'body': '14px',
        'secondary': '12px',
        'nav': '10px',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        'section': '16px',
      },
      borderRadius: {
        'button': '6px',
        'card': '8px',
      },
      boxShadow: {
        'card': '0 1px 4px rgba(0, 0, 0, 0.05)',
      },
      height: {
        'button': '36px',
        'nav': '56px',
      },
      padding: {
        'button-x': '16px',
        'card': '12px',
      },
      margin: {
        'title-top': '24px',
        'title-bottom': '16px',
        'section': '16px',
        'element': '8px',
      },
      strokeWidth: {
        '1.5': '1.5',
      },
      colors: {
        // Primary Colors with better contrast for dark mode
        'deep-blue': '#1E3D59',
        'emerald': '#17B890',
        'dynamic-orange': '#FF6B6B',
        
        // Secondary Colors with improved contrast
        'pure-white': '#FFFFFF',
        'light-gray': '#F5F7FA',
        'dark-gray': '#4A4A4A',

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "hsl(var(--background))",
          dark: "#121212", // Darker background for dark mode
        },
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          dark: "#FFFFFF", // White text for dark mode
        },
        primary: {
          DEFAULT: "#1E3D59",
          dark: "#2A5A8A", // Lighter blue for dark mode
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#17B890",
          dark: "#1EE6B5", // Brighter green for dark mode
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#FF6B6B",
          dark: "#FF8585", // Lighter red for dark mode
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#FF6B6B",
          dark: "#FF4444", // More vivid red for dark mode
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F5F7FA",
          dark: "#2A2A2A", // Darker gray for dark mode
          foreground: "#4A4A4A",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          dark: "#1E1E1E", // Dark card background
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;