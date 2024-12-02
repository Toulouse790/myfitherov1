import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TrainingFrequencyStepProps {
  workoutsPerWeek: string;
  onWorkoutsPerWeekChange: (value: string) => void;
}

export const TrainingFrequencyStep = ({
  workoutsPerWeek,
  onWorkoutsPerWeekChange,
}: TrainingFrequencyStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Combien de fois par semaine souhaitez-vous vous entraîner ?</h3>
      <div className="space-y-2">
        <Label htmlFor="workoutsPerWeek">Nombre d'entraînements</Label>
        <Select value={workoutsPerWeek} onValueChange={onWorkoutsPerWeekChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez le nombre de jours" />
          </SelectTrigger>
          <SelectContent>
            {[2, 3, 4, 5, 6].map((days) => (
              <SelectItem key={days} value={days.toString()}>
                {days} jours par semaine
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};