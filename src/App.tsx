import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import Cardio from "@/pages/Cardio";
import WorkoutGenerate from "@/pages/WorkoutGenerate";
import { BottomNav } from "@/components/Layout/BottomNav";

function App() {
  const location = useLocation();
  const showBottomNav = !location.pathname.startsWith('/admin');

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/workout/generate" element={<WorkoutGenerate />} />
        <Route path="/workout/:sessionId" element={<UnifiedWorkoutDetail />} />
        <Route path="/cardio" element={<Cardio />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/sleep" element={<Sleep />} />
        <Route path="/training-preferences" element={<TrainingPreferences />} />
        <Route path="/signin" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showBottomNav && <BottomNav />}
      <Toaster />
    </>
  );
}

export default App;