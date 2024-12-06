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
  workoutDuration: string;
  onWorkoutDurationChange: (value: string) => void;
}

export const TrainingFrequencyStep = ({
  workoutsPerWeek,
  onWorkoutsPerWeekChange,
  workoutDuration,
  onWorkoutDurationChange,
}: TrainingFrequencyStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Paramètres d'entraînement</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="workoutsPerWeek">Nombre d'entraînements par semaine</Label>
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
        
        <div className="space-y-2">
          <Label htmlFor="workoutDuration">Durée d'entraînement (minutes)</Label>
          <Select value={workoutDuration} onValueChange={onWorkoutDurationChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez la durée" />
            </SelectTrigger>
            <SelectContent>
              {[30, 45, 60, 75, 90].map((duration) => (
                <SelectItem key={duration} value={duration.toString()}>
                  {duration} minutes
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};