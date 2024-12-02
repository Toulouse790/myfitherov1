import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TrainingLocationStepProps {
  trainingLocation: string;
  onTrainingLocationChange: (value: string) => void;
}

export const TrainingLocationStep = ({
  trainingLocation,
  onTrainingLocationChange,
}: TrainingLocationStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Où préférez-vous vous entraîner ?</h3>
      <RadioGroup value={trainingLocation} onValueChange={onTrainingLocationChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="home" id="home" />
          <Label htmlFor="home">À la maison</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="gym" id="gym" />
          <Label htmlFor="gym">En salle de sport</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="outdoor" id="outdoor" />
          <Label htmlFor="outdoor">En extérieur</Label>
        </div>
      </RadioGroup>
    </div>
  );
};