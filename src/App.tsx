import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import { Workouts } from "@/pages/Workouts";
import Nutrition from "@/pages/Nutrition";
import Stats from "@/pages/Stats";
import Sleep from "@/pages/Sleep";
import TrainingPreferences from "@/pages/TrainingPreferences";
import { UnifiedWorkoutDetail } from "@/components/Workouts/UnifiedWorkoutDetail";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/workout/:sessionId" element={<UnifiedWorkoutDetail />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/sleep" element={<Sleep />} />
        <Route path="/training-preferences" element={<TrainingPreferences />} />
        <Route path="/signin" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;