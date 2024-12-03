import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Workouts from "./pages/Workouts";
import Nutrition from "./pages/Nutrition";
import Sleep from "./pages/Sleep";
import Admin from "./pages/Admin";
import { SignIn } from "@/components/Auth/SignIn";
import { UserProfile } from "@/components/Profile/UserProfile";
import { InitialQuestionnaire } from "@/components/Profile/InitialQuestionnaire";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/sleep" element={<Sleep />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/questionnaire" element={<InitialQuestionnaire />} />
            </Routes>
          </main>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;