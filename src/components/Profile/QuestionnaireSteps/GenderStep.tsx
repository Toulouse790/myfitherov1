import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface GenderStepProps {
  gender: string;
  onGenderChange: (value: string) => void;
}

export const GenderStep = ({
  gender,
  onGenderChange,
}: GenderStepProps) => {
  console.log("GenderStep - Current gender:", gender); // Debug log
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Quel est votre genre ?</h3>
      <RadioGroup value={gender} onValueChange={onGenderChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="male" id="gender-male" />
          <Label htmlFor="gender-male">Homme</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="female" id="gender-female" />
          <Label htmlFor="gender-female">Femme</Label>
        </div>
      </RadioGroup>
    </div>
  );
};