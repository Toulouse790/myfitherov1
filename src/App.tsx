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
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
        <Route path="/workout-exercise/:exerciseId" element={<ProtectedRoute><WorkoutExerciseDetail /></ProtectedRoute>} />
        <Route path="/workouts/exercise/next-workout" element={<ProtectedRoute><NextWorkoutDetail /></ProtectedRoute>} />
        <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
        <Route path="/sleep" element={<ProtectedRoute><Sleep /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/initial-questionnaire" element={<ProtectedRoute><InitialQuestionnaire /></ProtectedRoute>} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;