import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import { Workouts } from "./pages/Workouts";
import Nutrition from "./pages/Nutrition";
import Sleep from "./pages/Sleep";
import Admin from "./pages/Admin";
import Stats from "./pages/Stats";
import { WorkoutExerciseDetail } from "./components/Workouts/WorkoutExerciseDetail";
import { SignIn } from "./components/Auth/SignIn";
import { SignUp } from "./components/Auth/SignUp";
import { InitialQuestionnaire } from "./components/Profile/InitialQuestionnaire";
import { NextWorkoutDetail } from "./components/Workouts/NextWorkoutDetail";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { UserProfile } from "./components/Profile/UserProfile";
import TrainingPreferencesPage from "./pages/TrainingPreferences";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BottomNav } from "@/components/Layout/BottomNav";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <div className="min-h-screen bg-background pb-16">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            <Route path="/" element={
              <SidebarProvider>
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              </SidebarProvider>
            } />
            <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
            <Route path="/workout-exercise/:exerciseId" element={<ProtectedRoute><WorkoutExerciseDetail /></ProtectedRoute>} />
            <Route path="/workouts/exercise/next-workout" element={<ProtectedRoute><NextWorkoutDetail /></ProtectedRoute>} />
            <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
            <Route path="/sleep" element={<ProtectedRoute><Sleep /></ProtectedRoute>} />
            <Route path="/admin" element={
              <SidebarProvider>
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              </SidebarProvider>
            } />
            <Route path="/stats" element={
              <SidebarProvider>
                <ProtectedRoute>
                  <Stats />
                </ProtectedRoute>
              </SidebarProvider>
            } />
            <Route path="/initial-questionnaire" element={<ProtectedRoute><InitialQuestionnaire /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/training-preferences" element={<ProtectedRoute><TrainingPreferencesPage /></ProtectedRoute>} />
          </Routes>
          <ProtectedRoute>
            <BottomNav />
          </ProtectedRoute>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;