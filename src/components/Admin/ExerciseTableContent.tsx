import { useState } from "react";
import { translateMuscleGroup } from "@/utils/muscleGroupTranslations";
import { LocationCheckboxes, DifficultyCheckboxes } from "./ExerciseCheckboxes";
import { ExerciseTableContentProps } from "./types/exercise-table";
import { Checkbox } from "@/components/ui/checkbox";

export const ExerciseTableContent = ({
  exercises,
  locations,
  difficulties,
  onLocationChange,
  onDifficultyChange,
  onSelectionChange
}: ExerciseTableContentProps) => {
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked ? exercises.map(e => e.id) : [];
    setSelectedExercises(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSelectExercise = (exerciseId: string, checked: boolean) => {
    const newSelection = checked 
      ? [...selectedExercises, exerciseId]
      : selectedExercises.filter(id => id !== exerciseId);
    
    setSelectedExercises(newSelection);
    onSelectionChange?.(newSelection);
  };

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="p-2 w-10">
            <Checkbox 
              checked={selectedExercises.length === exercises.length}
              onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
            />
          </th>
          <th className="text-left p-2">Nom</th>
          <th className="text-left p-2">Groupe musculaire</th>
          <th className="text-left p-2">Lieux d'entraînement</th>
          <th className="text-left p-2">Niveaux de difficulté</th>
        </tr>
      </thead>
      <tbody>
        {exercises.map((exercise) => (
          <tr key={exercise.id} className="border-b">
            <td className="p-2">
              <Checkbox 
                checked={selectedExercises.includes(exercise.id)}
                onCheckedChange={(checked) => handleSelectExercise(exercise.id, checked as boolean)}
              />
            </td>
            <td className="p-2">{exercise.name}</td>
            <td className="p-2">{translateMuscleGroup(exercise.muscle_group)}</td>
            <td className="p-2">
              <LocationCheckboxes
                exercise={exercise}
                locations={locations}
                onChange={onLocationChange}
              />
            </td>
            <td className="p-2">
              <DifficultyCheckboxes
                exercise={exercise}
                difficulties={difficulties}
                onChange={onDifficultyChange}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};