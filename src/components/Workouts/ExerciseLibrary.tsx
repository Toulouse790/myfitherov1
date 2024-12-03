import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exercises, Exercise } from "./exerciseLibrary";
import { muscleGroups, difficultyLevels } from "./workoutConstants";
import { WorkoutFilters } from "./WorkoutFilters";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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

  // Simulons des données d'entraînement (à remplacer par des vraies données plus tard)
  const completedCount = Math.floor(Math.random() * 5) + 1; // Entre 1 et 5 pour la démo
  const lastTrainingDate = new Date(); // Date actuelle pour la démo

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