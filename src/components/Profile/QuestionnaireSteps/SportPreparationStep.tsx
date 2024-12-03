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
          <RadioGroupItem value="45" id="45min" />
          <Label htmlFor="45min">45 minutes - Préparation standard</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="60" id="60min" />
          <Label htmlFor="60min">60 minutes - Préparation complète</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="90" id="90min" />
          <Label htmlFor="90min">90 minutes - Préparation détaillée</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="120" id="120min" />
          <Label htmlFor="120min">120 minutes - Préparation approfondie</Label>
        </div>
      </RadioGroup>
    </div>
  );
};