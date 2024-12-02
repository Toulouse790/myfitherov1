import { useState, useMemo } from "react";
import { WorkoutList } from "@/components/Workouts/WorkoutList";
import { CreateWorkoutDialog } from "@/components/Workouts/CreateWorkoutDialog";
import { WorkoutFilters } from "@/components/Workouts/WorkoutFilters";
import { sampleWorkouts } from "@/components/Workouts/workoutConstants";

const Workouts = () => {
  const [muscleGroup, setMuscleGroup] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredWorkouts = useMemo(() => {
    let filtered = [...sampleWorkouts];

    if (muscleGroup) {
      filtered = filtered.filter((w) => w.muscleGroup === muscleGroup);
    }

    if (difficulty) {
      filtered = filtered.filter((w) => w.difficulty === difficulty);
    }

    filtered.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [muscleGroup, difficulty, sortOrder, sampleWorkouts]);

  const handleReset = () => {
    setMuscleGroup("");
    setDifficulty("");
    setSortOrder("asc");
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Entraînements</h1>
        <CreateWorkoutDialog />
      </div>

      <WorkoutFilters
        muscleGroup={muscleGroup}
        difficulty={difficulty}
        sortOrder={sortOrder}
        onMuscleGroupChange={setMuscleGroup}
        onDifficultyChange={setDifficulty}
        onSortOrderChange={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
        onReset={handleReset}
      />

      <WorkoutList workouts={filteredWorkouts} />
    </div>
  );
};

export default Workouts;