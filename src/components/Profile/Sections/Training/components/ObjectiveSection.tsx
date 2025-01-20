import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ObjectiveSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export const ObjectiveSection = ({ value, onChange }: ObjectiveSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Objectif principal</h3>
      <RadioGroup 
        value={value}
        onValueChange={(value) => onChange('objective', value)}
        className="space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="weight_loss" id="weight_loss" />
          <Label htmlFor="weight_loss">Perte de poids</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="muscle_gain" id="muscle_gain" />
          <Label htmlFor="muscle_gain">Prise de masse</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="maintenance" id="maintenance" />
          <Label htmlFor="maintenance">Maintien</Label>
        </div>
      </RadioGroup>
    </div>
  );
};