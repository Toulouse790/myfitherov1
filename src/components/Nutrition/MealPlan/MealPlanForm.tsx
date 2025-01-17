import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

interface MealPlanFormProps {
  onGenerate: (preferences: {
    duration: string;
    dietType: string;
  }) => void;
}

export const MealPlanForm = ({ onGenerate }: MealPlanFormProps) => {
  const [duration, setDuration] = useState("7");
  const [dietType, setDietType] = useState("balanced");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      duration,
      dietType,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <Label>Durée du plan</Label>
            <RadioGroup value={duration} onValueChange={setDuration} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="7" id="7days" />
                <Label htmlFor="7days">7 jours</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="14" id="14days" />
                <Label htmlFor="14days">14 jours</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="30" id="30days" />
                <Label htmlFor="30days">30 jours</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Type de régime</Label>
            <RadioGroup value={dietType} onValueChange={setDietType} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="balanced" id="balanced" />
                <Label htmlFor="balanced">Équilibré</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="highProtein" id="highProtein" />
                <Label htmlFor="highProtein">Riche en protéines</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lowCarb" id="lowCarb" />
                <Label htmlFor="lowCarb">Faible en glucides</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </Card>

      <Button type="submit" className="w-full">
        Générer mon plan
      </Button>
    </form>
  );
};