import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface PersonalInfoStepProps {
  age: string;
  weight: string;
  height: string;
  onAgeChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onHeightChange: (value: string) => void;
}

export const PersonalInfoStep = ({
  age,
  weight,
  height,
  onAgeChange,
  onWeightChange,
  onHeightChange,
}: PersonalInfoStepProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
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