
import { createContext, useContext } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

// Create a context to expose the theme value directly
const ThemeContext = createContext<{ theme: string | undefined }>({
  theme: undefined,
});

// Export the hook to get the current theme
export const useTheme = () => {
  const { theme } = useNextTheme();
  return { theme };
};

// Export the ThemeProvider component
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem {...props}>
      {children}
    </NextThemeProvider>
  );
}
