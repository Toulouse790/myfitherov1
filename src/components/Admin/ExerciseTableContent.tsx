import { useState } from "react";
import { translateMuscleGroup } from "@/utils/muscleGroupTranslations";
import { LocationCheckboxes, DifficultyCheckboxes } from "./ExerciseCheckboxes";
import { ExerciseTableContentProps } from "./types/exercise-table";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ExerciseTableContent = ({
  exercises,
  locations,
  difficulties,
  onLocationChange,
  onDifficultyChange,
  onSelectionChange
}: ExerciseTableContentProps) => {
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSelectAll = async (checked: boolean) => {
    try {
      const newSelection = checked ? exercises.map(e => e.id) : [];
      setSelectedExercises(newSelection);
      onSelectionChange?.(newSelection);
    } catch (error) {
      console.error('Error selecting all exercises:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sélection des exercices",
        variant: "destructive",
      });
    }
  };

  const handleSelectExercise = async (exerciseId: string, checked: boolean) => {
    try {
      const newSelection = checked 
        ? [...selectedExercises, exerciseId]
        : selectedExercises.filter(id => id !== exerciseId);
      
      setSelectedExercises(newSelection);
      onSelectionChange?.(newSelection);
    } catch (error) {
      console.error('Error selecting exercise:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sélection de l'exercice",
        variant: "destructive",
      });
    }
  };

  const handleNameChange = async (exerciseId: string, newName: string) => {
    try {
      const { data: existingExercises } = await supabase
        .from('unified_exercises')
        .select('name')
        .ilike('name', `${newName}%`);

      let uniqueName = newName;
      if (existingExercises && existingExercises.length > 0) {
        const similarNames = existingExercises.map(e => e.name);
        let counter = 1;
        while (similarNames.includes(uniqueName)) {
          uniqueName = `${newName} (${counter})`;
          counter++;
        }
      }

      const { error } = await supabase
        .from('unified_exercises')
        .update({ name: uniqueName })
        .eq('id', exerciseId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Nom de l'exercice mis à jour",
      });
    } catch (error) {
      console.error('Error updating exercise name:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le nom de l'exercice",
        variant: "destructive",
      });
    }
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
        {exercises.map((exercise) => {
          const translatedMuscleGroup = translateMuscleGroup(exercise.muscle_group);
          
          return (
            <tr key={exercise.id} className="border-b">
              <td className="p-2">
                <Checkbox 
                  checked={selectedExercises.includes(exercise.id)}
                  onCheckedChange={(checked) => handleSelectExercise(exercise.id, checked as boolean)}
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={exercise.name}
                  onChange={(e) => handleNameChange(exercise.id, e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="p-2">{translatedMuscleGroup}</td>
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
          );
        })}
      </tbody>
    </table>
  );
};