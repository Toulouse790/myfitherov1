import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MealPlanFormProps {
  onGenerate: (preferences: {
    duration: string;
    dietType: string;
  }) => void;
  isGenerating: boolean;
}

export const MealPlanForm = ({ onGenerate, isGenerating }: MealPlanFormProps) => {
  const [dietType, setDietType] = useState("balanced");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onGenerate({
      duration: "7", // Default duration, will be overridden by parent component
      dietType,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <Card className="p-2 sm:p-3">
        <div className="space-y-1.5">
          <Label htmlFor="diet-type" className="text-sm font-medium">
            Type de régime
          </Label>
          <RadioGroup
            value={dietType}
            onValueChange={setDietType}
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-1.5"
          >
            <div className="flex items-center space-x-1 rounded-lg border p-1.5 cursor-pointer hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="balanced" id="balanced" />
              <Label htmlFor="balanced" className="cursor-pointer text-sm">Équilibré</Label>
            </div>
            <div className="flex items-center space-x-1 rounded-lg border p-1.5 cursor-pointer hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="highProtein" id="highProtein" />
              <Label htmlFor="highProtein" className="cursor-pointer text-sm">Protéiné</Label>
            </div>
            <div className="flex items-center space-x-1 rounded-lg border p-1.5 cursor-pointer hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="lowCarb" id="lowCarb" />
              <Label htmlFor="lowCarb" className="cursor-pointer text-sm">Low Carb</Label>
            </div>
          </RadioGroup>
        </div>

        <Button 
          type="submit" 
          className="w-full mt-4"
          disabled={isGenerating}
        >
          {isGenerating ? "Génération en cours..." : "Générer un plan"}
        </Button>
      </Card>
    </form>
  );
};