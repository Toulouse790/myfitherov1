import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PersonalInfoStepProps {
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
    <div className="space-y-4">
      <h3 className="font-medium">Informations personnelles</h3>
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
  );
};