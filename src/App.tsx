import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import { Workouts } from "./pages/Workouts";
import Nutrition from "./pages/Nutrition";
import Sleep from "./pages/Sleep";
import Admin from "./pages/Admin";
import Stats from "./pages/Stats";
import { SignIn } from "./components/Auth/SignIn";
import { SignUp } from "./components/Auth/SignUp";
import { InitialQuestionnaire } from "./components/Profile/InitialQuestionnaire";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { UserProfile } from "./components/Profile/UserProfile";
import TrainingPreferencesPage from "./pages/TrainingPreferences";
import { BottomNav } from "@/components/Layout/BottomNav";
import { UnifiedWorkoutDetail } from "./components/Workouts/UnifiedWorkoutDetail";
import { NextWorkoutDetail } from "./components/Workouts/NextWorkoutDetail";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <div className="min-h-screen bg-background pb-16">
          <Routes>
            {/* Routes publiques */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Routes protégées */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
            <Route path="/workout/:sessionId" element={<ProtectedRoute><UnifiedWorkoutDetail /></ProtectedRoute>} />
            <Route path="/workouts/exercise/next-workout" element={<ProtectedRoute><NextWorkoutDetail /></ProtectedRoute>} />
            <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
            <Route path="/sleep" element={<ProtectedRoute><Sleep /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/stats" element={<ProtectedRoute><Stats /></ProtectedRoute>} />
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