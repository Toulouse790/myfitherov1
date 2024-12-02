import { useState, useMemo } from "react";
import { WorkoutList } from "@/components/Workouts/WorkoutList";
import { CreateWorkoutDialog } from "@/components/Workouts/CreateWorkoutDialog";
import { WorkoutFilters } from "@/components/Workouts/WorkoutFilters";
import { sampleWorkouts } from "@/components/Workouts/workoutConstants";
import { ExerciseLibrary } from "@/components/Workouts/ExerciseLibrary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Workouts = () => {
  const [muscleGroup, setMuscleGroup] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredWorkouts = useMemo(() => {
    let filtered = [...sampleWorkouts];

    if (muscleGroup !== "all") {
      filtered = filtered.filter((w) => w.muscleGroup === muscleGroup);
    }

    if (difficulty !== "all") {
      filtered = filtered.filter((w) => w.difficulty === difficulty);
    }

    filtered.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [muscleGroup, difficulty, sortOrder]);

  const handleReset = () => {
    setMuscleGroup("all");
    setDifficulty("all");
    setSortOrder("asc");
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Entraînements</h1>
        <CreateWorkoutDialog />
      </div>

      <Tabs defaultValue="workouts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="workouts">Mes séances</TabsTrigger>
          <TabsTrigger value="exercises">Exercices</TabsTrigger>
        </TabsList>

        <TabsContent value="workouts" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="exercises">
          <ExerciseLibrary />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Workouts;