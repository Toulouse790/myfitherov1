import { Routes, Route } from "react-router-dom";
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
import { SignIn } from "@/components/Auth/SignIn";
import { SignUp } from "@/components/Auth/SignUp";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/workout/:sessionId" element={<UnifiedWorkoutDetail />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/sleep" element={<Sleep />} />
        <Route path="/training-preferences" element={<TrainingPreferences />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;