import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DietTypeStepProps {
  dietType: string;
  onDietTypeChange: (value: string) => void;
}

export const DietTypeStep = ({
  dietType,
  onDietTypeChange,
}: DietTypeStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Quel est votre régime alimentaire ?</h3>
      <RadioGroup value={dietType} onValueChange={onDietTypeChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="omnivore" id="omnivore" />
          <Label htmlFor="omnivore">Omnivore</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="vegetarian" id="vegetarian" />
          <Label htmlFor="vegetarian">Végétarien</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="vegan" id="vegan" />
          <Label htmlFor="vegan">Vegan</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pescatarian" id="pescatarian" />
          <Label htmlFor="pescatarian">Pescétarien</Label>
        </div>
      </RadioGroup>
    </div>
  );
};