import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Workouts from "./pages/Workouts";
import Nutrition from "./pages/Nutrition";
import Sleep from "./pages/Sleep";
import Admin from "./pages/Admin";
import { WorkoutExerciseDetail } from "./components/Workouts/WorkoutExerciseDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/workout-exercise/:exerciseId" element={<WorkoutExerciseDetail />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/sleep" element={<Sleep />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;