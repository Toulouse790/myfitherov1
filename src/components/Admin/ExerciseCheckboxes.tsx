import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Location, Difficulty, Exercise } from "./types/exercise-table";

interface CheckboxWithLabelProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export const CheckboxWithLabel = ({ 
  id, 
  checked, 
  onChange, 
  label 
}: CheckboxWithLabelProps) => {
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

interface LocationCheckboxesProps {
  exercise: Exercise;
  locations: Location[];
  onChange: (exerciseId: string, location: string, checked: boolean) => void;
}

export const LocationCheckboxes = ({ 
  exercise, 
  locations, 
  onChange 
}: LocationCheckboxesProps) => (
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

interface DifficultyCheckboxesProps {
  exercise: Exercise;
  difficulties: Difficulty[];
  onChange: (exerciseId: string, difficulty: string, checked: boolean) => void;
}

export const DifficultyCheckboxes = ({ 
  exercise, 
  difficulties, 
  onChange 
}: DifficultyCheckboxesProps) => (
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