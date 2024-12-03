import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ActivityLevelStepProps {
  activityLevel: string;
  onActivityLevelChange: (value: string) => void;
}

export const ActivityLevelStep = ({
  activityLevel,
  onActivityLevelChange,
}: ActivityLevelStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Quel est votre niveau d'activité quotidienne ?</h3>
      <RadioGroup value={activityLevel} onValueChange={onActivityLevelChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="sedentary" id="sedentary" />
          <Label htmlFor="sedentary">Sédentaire (peu ou pas d'exercice, travail de bureau)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="lightly_active" id="lightly_active" />
          <Label htmlFor="lightly_active">Légèrement actif (exercice léger/sports 1-3 jours/semaine)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="moderately_active" id="moderately_active" />
          <Label htmlFor="moderately_active">Modérément actif (exercice modéré/sports 3-5 jours/semaine)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="very_active" id="very_active" />
          <Label htmlFor="very_active">Très actif (exercice intense/sports 6-7 jours/semaine)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="extra_active" id="extra_active" />
          <Label htmlFor="extra_active">Extrêmement actif (exercice très intense/travail physique/sports)</Label>
        </div>
      </RadioGroup>
    </div>
  );
};