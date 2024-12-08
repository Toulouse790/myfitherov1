import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PersonalInfoStepProps {
  age: string;
  weight: string;
  height: string;
  gender: string;
  onAgeChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onGenderChange: (value: string) => void;
}

export const PersonalInfoStep = ({
  age,
  weight,
  height,
  gender,
  onAgeChange,
  onWeightChange,
  onHeightChange,
  onGenderChange,
}: PersonalInfoStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Informations personnelles</h3>
      
      <div className="space-y-4">
        <div>
          <Label>Genre</Label>
          <RadioGroup value={gender} onValueChange={onGenderChange} className="mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Homme</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Femme</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Âge</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => onAgeChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Poids (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => onWeightChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Taille (cm)</Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => onHeightChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};