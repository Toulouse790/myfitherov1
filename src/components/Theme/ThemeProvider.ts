
import { createContext, useContext, useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";

// Create a context to expose the theme value directly
const ThemeContext = createContext<{ theme: string | undefined }>({
  theme: undefined,
});

// Export the hook to get the current theme
export const useTheme = () => useContext(ThemeContext);

// In case this file didn't exist or had other content, we're just focusing on exporting the useTheme hook
