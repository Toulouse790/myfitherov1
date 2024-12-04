import { translateMuscleGroup } from "@/utils/muscleGroupTranslations";
import { LocationCheckboxes, DifficultyCheckboxes } from "./ExerciseCheckboxes";
import { ExerciseTableContentProps } from "./types/exercise-table";

export const ExerciseTableContent = ({
  exercises,
  locations,
  difficulties,
  onLocationChange,
  onDifficultyChange
}: ExerciseTableContentProps) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left p-2">Nom</th>
          <th className="text-left p-2">Groupe musculaire</th>
          <th className="text-left p-2">Lieux d'entraînement</th>
          <th className="text-left p-2">Niveaux de difficulté</th>
        </tr>
      </thead>
      <tbody>
        {exercises.map((exercise) => (
          <tr key={exercise.id} className="border-b">
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
                difficulties={[
                  { id: "beginner", name: "Débutant" },
                  { id: "intermediate", name: "Intermédiaire" },
                  { id: "advanced", name: "Avancé" },
                  { id: "expert", name: "Expert" }
                ]}
                onChange={onDifficultyChange}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};