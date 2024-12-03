import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Workouts from "./pages/Workouts";
import Nutrition from "./pages/Nutrition";
import Sleep from "./pages/Sleep";
import Admin from "./pages/Admin";
import { WorkoutExerciseDetail } from "./components/Workouts/WorkoutExerciseDetail";
import { SignIn } from "./components/Auth/SignIn";
import { SignUp } from "./components/Auth/SignUp";
import { InitialQuestionnaire } from "./components/Profile/InitialQuestionnaire";
import { NextWorkoutDetail } from "./components/Workouts/NextWorkoutDetail";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/workout-exercise/:exerciseId" element={<WorkoutExerciseDetail />} />
        <Route path="/workouts/exercise/next-workout" element={<NextWorkoutDetail />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/sleep" element={<Sleep />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/initial-questionnaire" element={<InitialQuestionnaire />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;