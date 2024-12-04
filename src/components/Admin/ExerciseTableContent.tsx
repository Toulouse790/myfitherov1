import { translateMuscleGroup } from "@/utils/muscleGroupTranslations";

interface ExerciseTableContentProps {
  exercises: any[];
  locations: { id: string; name: string; }[];
  difficulties: { id: string; name: string; }[];
  onLocationChange: (exerciseId: string, location: string, checked: boolean) => void;
  onDifficultyChange: (exerciseId: string, difficulty: string, checked: boolean) => void;
}

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

const LocationCheckboxes = ({ 
  exercise, 
  locations, 
  onChange 
}: { 
  exercise: any; 
  locations: { id: string; name: string; }[];
  onChange: (exerciseId: string, location: string, checked: boolean) => void;
}) => (
  <div className="flex gap-4">
    {locations.map((location) => (
      <CheckboxWithLabel
        key={location.id}
        id={`${exercise.id}-${location.id}`}
        checked={(exercise.location || []).includes(location.id)}
        onChange={(checked) => onChange(exercise.id, location.id, checked)}
        label={location.name}
      />
    ))}
  </div>
);

const DifficultyCheckboxes = ({ 
  exercise, 
  difficulties, 
  onChange 
}: { 
  exercise: any; 
  difficulties: { id: string; name: string; }[];
  onChange: (exerciseId: string, difficulty: string, checked: boolean) => void;
}) => (
  <div className="flex gap-4">
    {difficulties.map((difficulty) => (
      <CheckboxWithLabel
        key={difficulty.id}
        id={`${exercise.id}-${difficulty.id}`}
        checked={(exercise.difficulty || []).includes(difficulty.id)}
        onChange={(checked) => onChange(exercise.id, difficulty.id, checked)}
        label={difficulty.name}
      />
    ))}
  </div>
);

const CheckboxWithLabel = ({ 
  id, 
  checked, 
  onChange, 
  label 
}: { 
  id: string; 
  checked: boolean; 
  onChange: (checked: boolean) => void;
  label: string;
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
      />
      <Label htmlFor={id}>
        {label}
      </Label>
    </div>
  );
};