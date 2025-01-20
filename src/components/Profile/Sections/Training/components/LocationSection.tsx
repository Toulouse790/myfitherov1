import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface LocationSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export const LocationSection = ({ value, onChange }: LocationSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Lieu d'entraînement préféré</h3>
      <RadioGroup 
        value={value}
        onValueChange={(value) => onChange('available_equipment', value)}
        className="space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="home" id="home" />
          <Label htmlFor="home">À la maison</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="gym" id="gym" />
          <Label htmlFor="gym">En salle de sport</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="outdoor" id="outdoor" />
          <Label htmlFor="outdoor">En extérieur</Label>
        </div>
      </RadioGroup>
    </div>
  );
};