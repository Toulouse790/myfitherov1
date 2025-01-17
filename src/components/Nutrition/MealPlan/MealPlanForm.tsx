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
  const [dietType, setDietType] = useState("balanced");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      duration: "7", // Default duration, will be overridden by parent component
      dietType,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-4">
        <div className="space-y-4">
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