import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { WorkoutList } from "@/components/Workouts/WorkoutList";
import { WorkoutFilters } from "@/components/Workouts/WorkoutFilters";
import { workouts as initialWorkouts } from "@/components/Workouts/workoutConstants";
import { useState } from "react";
import { WorkoutData } from "@/components/Workouts/workoutConstants";

const Workouts = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<WorkoutData[]>(initialWorkouts);

  const handleFiltersChange = (filteredWorkouts: WorkoutData[]) => {
    setWorkouts(filteredWorkouts);
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
        <WorkoutFilters onFiltersChange={handleFiltersChange} />
        <WorkoutList workouts={workouts} />
      </div>
    </div>
  );
};

export default Workouts;