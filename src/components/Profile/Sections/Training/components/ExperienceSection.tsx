import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ExperienceSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export const ExperienceSection = ({ value, onChange }: ExperienceSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Niveau d'expérience</h3>
      <RadioGroup 
        value={value}
        onValueChange={onChange}
        className="space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="beginner" id="beginner" />
          <Label htmlFor="beginner">Débutant</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="intermediate" id="intermediate" />
          <Label htmlFor="intermediate">Intermédiaire</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="advanced" id="advanced" />
          <Label htmlFor="advanced">Avancé</Label>
        </div>
      </RadioGroup>
    </div>
  );
};