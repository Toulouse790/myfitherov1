import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface MealPlanFormProps {
  onGenerate: (preferences: {
    duration: string;
    dietType: string;
  }) => void;
  isGenerating: boolean;
}

export const MealPlanForm = ({ onGenerate, isGenerating }: MealPlanFormProps) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onGenerate({
      duration: "7", // Default duration, will be overridden by parent component
      dietType: "balanced",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <Card className="p-2 sm:p-3">
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