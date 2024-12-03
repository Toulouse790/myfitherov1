import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { WorkoutList } from "@/components/Workouts/WorkoutList";
import { WorkoutFilters } from "@/components/Workouts/WorkoutFilters";
import { workouts as initialWorkouts, WorkoutData } from "@/components/Workouts/workoutConstants";
import { useState } from "react";

const Workouts = () => {
  const navigate = useNavigate();
  const [muscleGroup, setMuscleGroup] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [location, setLocation] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [workouts, setWorkouts] = useState<WorkoutData[]>(initialWorkouts);

  const handleFiltersChange = (filteredWorkouts: WorkoutData[]) => {
    setWorkouts(filteredWorkouts);
  };

  const handleReset = () => {
    setMuscleGroup("");
    setDifficulty("");
    setLocation("");
    setSortOrder("asc");
    setWorkouts(initialWorkouts);
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div className="space-y-6">
        <WorkoutFilters
          muscleGroup={muscleGroup}
          difficulty={difficulty}
          location={location}
          sortOrder={sortOrder}
          onMuscleGroupChange={setMuscleGroup}
          onDifficultyChange={setDifficulty}
          onLocationChange={setLocation}
          onSortOrderChange={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
          onReset={handleReset}
        />
        <WorkoutList workouts={workouts} />
      </div>
    </div>
  );
};

export default Workouts;