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
    onGenerate({ duration: "7", dietType: type });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-full">
      <div>
        <h3 className="text-lg font-medium mb-4">Type de plan</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <Button
            type="button"
            variant={type === "balanced" ? "default" : "outline"}
            onClick={() => setType("balanced")}
            className="w-full justify-start gap-2 text-sm"
          >
            Équilibré
          </Button>
          <Button
            type="button"
            variant={type === "highProtein" ? "default" : "outline"}
            onClick={() => setType("highProtein")}
            className="w-full justify-start gap-2 text-sm"
          >
            Riche en protéines
          </Button>
          <Button
            type="button"
            variant={type === "lowCarb" ? "default" : "outline"}
            onClick={() => setType("lowCarb")}
            className="w-full justify-start gap-2 text-sm"
          >
            Pauvre en glucides
          </Button>
          <Button
            type="button"
            variant={type === "vegetarian" ? "default" : "outline"}
            onClick={() => setType("vegetarian")}
            className="w-full justify-start gap-2 text-sm"
          >
            Végétarien
          </Button>
          <Button
            type="button"
            variant={type === "vegan" ? "default" : "outline"}
            onClick={() => setType("vegan")}
            className="w-full justify-start gap-2 text-sm"
          >
            Végétalien
          </Button>
          <Button
            type="button"
            variant={type === "mediterranean" ? "default" : "outline"}
            onClick={() => setType("mediterranean")}
            className="w-full justify-start gap-2 text-sm"
          >
            Méditerranéen
          </Button>
          <Button
            type="button"
            variant={type === "keto" ? "default" : "outline"}
            onClick={() => setType("keto")}
            className="w-full justify-start gap-2 text-sm"
          >
            Cétogène
          </Button>
          <Button
            type="button"
            variant={type === "glutenFree" ? "default" : "outline"}
            onClick={() => setType("glutenFree")}
            className="w-full justify-start gap-2 text-sm"
          >
            Sans gluten
          </Button>
          <Button
            type="button"
            variant={type === "high_fiber" ? "default" : "outline"}
            onClick={() => setType("high_fiber")}
            className="w-full justify-start gap-2 text-sm"
          >
            Riche en fibres
          </Button>
          <Button
            type="button"
            variant={type === "seche_extreme" ? "default" : "outline"}
            onClick={() => setType("seche_extreme")}
            className="w-full justify-start gap-2 text-sm"
          >
            Sèche extrême
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isGenerating}>
        {isGenerating ? "Génération..." : "Générer"}
      </Button>
    </form>
  );
};