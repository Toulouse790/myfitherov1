import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface MealPlanFormProps {
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
            {[
              { value: "balanced", label: "Équilibré" },
              { value: "highProtein", label: "Riche en protéines" },
              { value: "lowCarb", label: "Pauvre en glucides" },
              { value: "vegetarian", label: "Végétarien" },
              { value: "vegan", label: "Végétalien" },
              { value: "mediterranean", label: "Méditerranéen" },
              { value: "keto", label: "Cétogène" },
              { value: "glutenFree", label: "Sans gluten" },
              { value: "high_fiber", label: "Riche en fibres" },
            ].map(({ value, label }) => (
              <div
                key={value}
                className={`flex items-center space-x-1 rounded-lg border p-1.5 cursor-pointer hover:bg-muted/50 transition-colors ${
                  dietType === value ? "bg-emerald/10 border-emerald" : ""
                }`}
              >
                <RadioGroupItem value={value} id={value} />
                <Label htmlFor={value} className="cursor-pointer text-sm">
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button type="submit" className="w-full mt-4" disabled={isGenerating}>
          {isGenerating ? "Génération en cours..." : "Générer un plan"}
        </Button>
      </Card>
    </form>
  );
};