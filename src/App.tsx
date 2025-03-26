
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/Theme/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NotificationProvider } from "@/providers/NotificationProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { router } from "@/routes";
import { RouterProvider } from "react-router-dom";

function App() {
  return (
    <LanguageProvider>
      <QueryClientProvider client={new QueryClient()}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <RouterProvider router={router} />
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;
