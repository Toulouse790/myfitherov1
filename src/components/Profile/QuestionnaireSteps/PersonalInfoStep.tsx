import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

export interface PersonalInfoStepProps {
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
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Genre</h2>
            <RadioGroup value={gender} onValueChange={onGenderChange}>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="gender-male" />
                  <Label htmlFor="gender-male">Homme</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="gender-female" />
                  <Label htmlFor="gender-female">Femme</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Âge</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => onAgeChange(e.target.value)}
                placeholder="Votre âge"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Poids (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => onWeightChange(e.target.value)}
                placeholder="Votre poids en kg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Taille (cm)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => onHeightChange(e.target.value)}
                placeholder="Votre taille en cm"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};