import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface TrainingFrequencyStepProps {
  workoutsPerWeek: string;
  onWorkoutsPerWeekChange: (value: string) => void;
  workoutDuration: string;
  onWorkoutDurationChange: (value: string) => void;
}

export const TrainingFrequencyStep = ({ 
  workoutsPerWeek,
  onWorkoutsPerWeekChange,
  workoutDuration,
  onWorkoutDurationChange 
}: TrainingFrequencyStepProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">À quelle fréquence souhaitez-vous vous entraîner ?</h2>
            <RadioGroup value={workoutsPerWeek} onValueChange={onWorkoutsPerWeekChange}>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="frequency-1" />
                  <Label htmlFor="frequency-1">1 fois par semaine</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="frequency-2" />
                  <Label htmlFor="frequency-2">2 fois par semaine</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="frequency-3" />
                  <Label htmlFor="frequency-3">3 fois par semaine</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4" id="frequency-4" />
                  <Label htmlFor="frequency-4">4 fois par semaine</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5" id="frequency-5" />
                  <Label htmlFor="frequency-5">5 fois par semaine</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Durée d'entraînement souhaitée</h2>
            <Select value={workoutDuration} onValueChange={onWorkoutDurationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une durée" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
                <SelectItem value="120">120 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};