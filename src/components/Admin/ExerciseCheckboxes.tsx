import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Location {
  id: string;
  name: string;
}

interface Difficulty {
  id: string;
  name: string;
}

interface Exercise {
  id: string;
  location?: string[];
  difficulty?: string[];
}

interface LocationCheckboxesProps {
  exercise: Exercise;
  locations: Location[];
  onChange: (exerciseId: string, location: string, checked: boolean) => void;
}

interface DifficultyCheckboxesProps {
  exercise: Exercise;
  difficulties: Difficulty[];
  onChange: (exerciseId: string, difficulty: string, checked: boolean) => void;
}

export const LocationCheckboxes = ({ exercise, locations, onChange }: LocationCheckboxesProps) => {
  return (
    <div className="flex gap-4">
      {locations.map((location) => (
        <div key={location.id} className="flex items-center space-x-2">
          <Checkbox
            id={`${exercise.id}-${location.id}`}
            checked={(exercise.location || []).includes(location.id)}
            onCheckedChange={(checked) => onChange(exercise.id, location.id, checked as boolean)}
            className="border-[#0EA5E9] data-[state=checked]:bg-[#0EA5E9] data-[state=checked]:text-white"
          />
          <Label
            htmlFor={`${exercise.id}-${location.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {location.name}
          </Label>
        </div>
      ))}
    </div>
  );
};

export const DifficultyCheckboxes = ({ exercise, difficulties, onChange }: DifficultyCheckboxesProps) => {
  return (
    <div className="flex gap-4">
      {difficulties.map((difficulty) => (
        <div key={difficulty.id} className="flex items-center space-x-2">
          <Checkbox
            id={`${exercise.id}-${difficulty.id}`}
            checked={(exercise.difficulty || []).includes(difficulty.id)}
            onCheckedChange={(checked) => onChange(exercise.id, difficulty.id, checked as boolean)}
            className="border-[#9b87f5] data-[state=checked]:bg-[#9b87f5] data-[state=checked]:text-white"
          />
          <Label
            htmlFor={`${exercise.id}-${difficulty.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {difficulty.name}
          </Label>
        </div>
      ))}
    </div>
  );
};