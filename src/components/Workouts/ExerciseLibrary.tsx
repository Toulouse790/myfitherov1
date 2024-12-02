import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exercises, Exercise } from "./exerciseLibrary";
import { muscleGroups, difficultyLevels } from "./workoutConstants";
import { WorkoutFilters } from "./WorkoutFilters";

export const ExerciseLibrary = () => {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredExercises = exercises.filter((exercise) => {
    if (selectedMuscleGroup !== "all" && exercise.muscleGroup !== selectedMuscleGroup) {
      return false;
    }
    if (selectedDifficulty !== "all" && exercise.difficulty !== selectedDifficulty) {
      return false;
    }
    if (selectedLocation !== "all" && !exercise.location.includes(selectedLocation)) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return sortOrder === "asc" ? comparison : -comparison;
  });

  return (
    <div className="space-y-6">
      <WorkoutFilters
        muscleGroup={selectedMuscleGroup}
        difficulty={selectedDifficulty}
        location={selectedLocation}
        sortOrder={sortOrder}
        onMuscleGroupChange={setSelectedMuscleGroup}
        onDifficultyChange={setSelectedDifficulty}
        onLocationChange={setSelectedLocation}
        onSortOrderChange={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
        onReset={() => {
          setSelectedMuscleGroup("all");
          setSelectedDifficulty("all");
          setSelectedLocation("all");
          setSortOrder("asc");
        }}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredExercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  );
};

const ExerciseCard = ({ exercise }: { exercise: Exercise }) => {
  const locationLabels = {
    home: "Maison",
    gym: "Salle de sport",
    outdoor: "Extérieur"
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">{exercise.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{exercise.description}</p>
        <div className="space-y-2">
          <p><strong>Difficulté :</strong> {
            difficultyLevels.find(d => d.id === exercise.difficulty)?.name
          }</p>
          <p><strong>Équipement :</strong> {exercise.equipment}</p>
          <p><strong>Lieu :</strong> {exercise.location.map(loc => locationLabels[loc as keyof typeof locationLabels]).join(", ")}</p>
        </div>
        <div className="space-y-2">
          <p className="font-semibold">Instructions :</p>
          <ul className="list-disc pl-4 space-y-1">
            {exercise.instructions.map((instruction, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {instruction}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};