import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PersonalInfoStepProps {
  gender: string;
  wakeUpTime: string;
  trainingTime: string;
  onGenderChange: (value: string) => void;
  onWakeUpTimeChange: (value: string) => void;
  onTrainingTimeChange: (value: string) => void;
}

export const PersonalInfoStep = ({
  gender,
  wakeUpTime,
  trainingTime,
  onGenderChange,
  onWakeUpTimeChange,
  onTrainingTimeChange,
}: PersonalInfoStepProps) => {
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

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
            <h2 className="text-xl font-semibold">Heure de réveil</h2>
            <Select value={wakeUpTime} onValueChange={onWakeUpTimeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une heure" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Heure d'entraînement préférée</h2>
            <Select value={trainingTime} onValueChange={onTrainingTimeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une heure" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};