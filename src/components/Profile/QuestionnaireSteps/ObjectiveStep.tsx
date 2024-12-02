import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ObjectiveStepProps {
  objective: string;
  onObjectiveChange: (value: string) => void;
}

export const ObjectiveStep = ({
  objective,
  onObjectiveChange,
}: ObjectiveStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Quel est votre objectif principal ?</h3>
      <RadioGroup value={objective} onValueChange={onObjectiveChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="weight_loss" id="weight_loss" />
          <Label htmlFor="weight_loss">Perte de poids</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="muscle_gain" id="muscle_gain" />
          <Label htmlFor="muscle_gain">Prise de masse musculaire</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="maintenance" id="maintenance" />
          <Label htmlFor="maintenance">Maintien de la forme</Label>
        </div>
      </RadioGroup>
    </div>
  );
};