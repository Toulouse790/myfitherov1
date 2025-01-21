import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MealPlanFormProps {
  onGenerate: (preferences: { duration: string; dietType: string }) => void;
  isGenerating?: boolean;
}

export const MealPlanForm = ({ onGenerate, isGenerating }: MealPlanFormProps) => {
  const [type, setType] = useState<string>("balanced");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un type de plan",
        variant: "destructive",
      });
      return;
    }
    onGenerate({ duration: "7", dietType: type }); // Utilisation d'une durée par défaut de 7 jours
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Type de plan</h3>
        <Button
          type="button"
          variant={type === "balanced" ? "default" : "outline"}
          onClick={() => setType("balanced")}
          className="w-full justify-start gap-2 bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground"
        >
          Équilibré
        </Button>
      </div>

      <Button type="submit" className="w-full" disabled={isGenerating}>
        {isGenerating ? "Génération..." : "Générer"}
      </Button>
    </form>
  );
};