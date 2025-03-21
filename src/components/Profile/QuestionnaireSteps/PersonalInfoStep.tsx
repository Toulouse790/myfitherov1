
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export interface PersonalInfoStepProps {
  age: string;
  weight: string;
  height: string;
  onAgeChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  validationMessage?: string | null;
}

export const PersonalInfoStep = ({
  age,
  weight,
  height,
  onAgeChange,
  onWeightChange,
  onHeightChange,
  validationMessage,
}: PersonalInfoStepProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {validationMessage && (
            <Alert variant="destructive" className="mb-4">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertDescription>{validationMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Âge (18-100 ans)</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => onAgeChange(e.target.value)}
                placeholder="Votre âge"
                min={18}
                max={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Poids (30-300 kg)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => onWeightChange(e.target.value)}
                placeholder="Votre poids en kg"
                min={30}
                max={300}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Taille (130-250 cm)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => onHeightChange(e.target.value)}
                placeholder="Votre taille en cm"
                min={130}
                max={250}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
