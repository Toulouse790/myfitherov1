import { useState, useMemo } from "react";
import { WorkoutList } from "@/components/Workouts/WorkoutList";
import { CreateWorkoutDialog } from "@/components/Workouts/CreateWorkoutDialog";
import { WorkoutFilters } from "@/components/Workouts/WorkoutFilters";
import { sampleWorkouts } from "@/components/Workouts/workoutConstants";
import { ExerciseLibrary } from "@/components/Workouts/ExerciseLibrary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

const Workouts = () => {
  const [muscleGroup, setMuscleGroup] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [location, setLocation] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const isMobile = useIsMobile();

  const filteredWorkouts = useMemo(() => {
    let filtered = [...sampleWorkouts];

    if (muscleGroup !== "all") {
      filtered = filtered.filter((w) => w.muscleGroup === muscleGroup);
    }

    if (difficulty !== "all") {
      filtered = filtered.filter((w) => w.difficulty === difficulty);
    }

    if (location !== "all") {
      filtered = filtered.filter((w) => w.location === location);
    }

    filtered.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [muscleGroup, difficulty, location, sortOrder]);

  const handleReset = () => {
    setMuscleGroup("all");
    setDifficulty("all");
    setLocation("all");
    setSortOrder("asc");
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Entraînements</h1>
        <CreateWorkoutDialog />
      </div>

      <Tabs defaultValue="workouts" className="space-y-6">
        <TabsList className="w-full flex-wrap h-auto">
          <TabsTrigger value="workouts" className="flex-1">
            {isMobile ? "Séances" : "Mes séances"}
          </TabsTrigger>
          <TabsTrigger value="exercises" className="flex-1">
            Exercices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workouts" className="space-y-6">
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