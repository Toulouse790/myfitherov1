import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SportPreparationStepProps {
  preparationTime: string;
  onPreparationTimeChange: (value: string) => void;
}

export const SportPreparationStep = ({
  preparationTime,
  onPreparationTimeChange,
}: SportPreparationStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Combien de temps avez-vous besoin pour vous préparer ?</h3>
      <RadioGroup value={preparationTime} onValueChange={onPreparationTimeChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="15" id="15min" />
          <Label htmlFor="15min">15 minutes - Préparation rapide</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="30" id="30min" />
          <Label htmlFor="30min">30 minutes - Préparation standard</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="45" id="45min" />
          <Label htmlFor="45min">45 minutes - Préparation complète</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="60" id="60min" />
          <Label htmlFor="60min">60 minutes - Préparation détaillée</Label>
        </div>
      </RadioGroup>
    </div>
  );
};