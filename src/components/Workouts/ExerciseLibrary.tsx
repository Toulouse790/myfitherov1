import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exercises, Exercise } from "./exerciseLibrary";
import { muscleGroups, difficultyLevels } from "./workoutConstants";
import { WorkoutFilters } from "./WorkoutFilters";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MuscleGroupCard } from "./filters/MuscleGroupCard";
import { FilterControls } from "./filters/FilterControls";

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

  const getSelectedExercisesCount = (muscleId: string): number => {
    return exercises.filter(ex => {
      let matches = false;
      if (muscleId === "fullBody") {
        matches = true;
      } else if (muscleId === "biceps" || muscleId === "triceps") {
        matches = ex.muscleGroup === "arms";
      } else if (muscleId === "quadriceps" || muscleId === "hamstrings" || muscleId === "glutes") {
        matches = ex.muscleGroup === "legs";
      } else if (muscleId === "lower_back") {
        matches = ex.muscleGroup === "back";
      } else {
        matches = ex.muscleGroup === muscleId;
      }
      return matches && selectedExercises.includes(ex.id);
    }).length;
  };

  const handleMuscleGroupClick = (muscleId: string) => {
    if (muscleId === selectedMuscleGroup) {
      const filteredExercises = exercises.filter(ex => {
        if (muscleId === "fullBody") return true;
        if (muscleId === "biceps" || muscleId === "triceps") {
          return ex.muscleGroup === "arms";
        }
        if (muscleId === "quadriceps" || muscleId === "hamstrings" || muscleId === "glutes") {
          return ex.muscleGroup === "legs";
        }
        if (muscleId === "lower_back") {
          return ex.muscleGroup === "back";
        }
        return ex.muscleGroup === muscleId;
      });
      setSelectedMuscleExercises(filteredExercises);
      setShowExerciseSelection(true);
    } else {
      setSelectedMuscleGroup(muscleId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {muscleGroups.map((muscle) => (
            <MuscleGroupCard
              key={muscle.id}
              id={muscle.id}
              name={muscle.name}
              image={muscle.image}
              isSelected={selectedMuscleGroup === muscle.id}
              selectedExercises={getSelectedExercisesCount(muscle.id)}
              totalExercises={muscle.totalExercises}
              onClick={() => handleMuscleGroupClick(muscle.id)}
            />
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <FilterControls
            difficulty={selectedDifficulty}
            location={selectedLocation}
            sortOrder={sortOrder}
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
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredExercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  );
};

const ExerciseCard = ({ exercise }: { exercise: Exercise }) => {
  const navigate = useNavigate();
  const locationLabels = {
    home: "Maison",
    gym: "Salle de sport",
    outdoor: "Extérieur"
  };

  const completedCount = Math.floor(Math.random() * 5) + 1;
  const lastTrainingDate = new Date();

  return (
    <Card 
      className="h-full cursor-pointer hover:bg-accent/5 transition-colors"
      onClick={() => navigate(`/workout-exercise/${exercise.id}`)}
    >
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl line-clamp-2">{exercise.name}</CardTitle>
          <button className="p-2 hover:bg-accent/10 rounded-full">
            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
          {exercise.image && (
            <img 
              src={exercise.image} 
              alt={exercise.name}
              className="object-cover w-full h-full"
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{completedCount} terminé</p>
            <p className="text-sm text-muted-foreground">
              Dernier entraînement
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {format(lastTrainingDate, "dd/MM/yyyy", { locale: fr })}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm"><strong>Difficulté :</strong> {
            difficultyLevels.find(d => d.id === exercise.difficulty)?.name
          }</p>
          <p className="text-sm"><strong>Équipement :</strong> {exercise.equipment}</p>
          <p className="text-sm"><strong>Lieu :</strong> {exercise.location.map(loc => locationLabels[loc as keyof typeof locationLabels]).join(", ")}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">Instructions :</p>
          <ul className="list-disc pl-4 space-y-1 text-sm">
            {exercise.instructions.map((instruction, index) => (
              <li key={index} className="text-muted-foreground line-clamp-2">
                {instruction}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
