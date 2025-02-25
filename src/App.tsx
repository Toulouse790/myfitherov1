
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/Theme/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NotificationProvider } from "@/providers/NotificationProvider";
import { router } from "@/routes";
import { RouterProvider } from "react-router-dom";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <NotificationProvider>
            <RouterProvider router={router} />
          </NotificationProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
