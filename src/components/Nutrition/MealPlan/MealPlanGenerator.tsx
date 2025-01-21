import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { GeneratedPlanDisplay } from "./GeneratedPlanDisplay";

export const MealPlanGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(7);
  const [selectedType, setSelectedType] = useState<string>("balanced");
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Logic to generate meal plan
    } catch (error) {
      console.error("Error generating meal plan:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le plan de repas",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Type de plan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Button
                variant={selectedType === "balanced" ? "default" : "outline"}
                onClick={() => setSelectedType("balanced")}
                className="w-full justify-start gap-2"
              >
                Équilibré
              </Button>
              <Button
                variant={selectedType === "highProtein" ? "default" : "outline"}
                onClick={() => setSelectedType("highProtein")}
                className="w-full justify-start gap-2"
              >
                Riche en protéines
              </Button>
              <Button
                variant={selectedType === "lowCarb" ? "default" : "outline"}
                onClick={() => setSelectedType("lowCarb")}
                className="w-full justify-start gap-2"
              >
                Pauvre en glucides
              </Button>
              <Button
                variant={selectedType === "vegetarian" ? "default" : "outline"}
                onClick={() => setSelectedType("vegetarian")}
                className="w-full justify-start gap-2"
              >
                Végétarien
              </Button>
              <Button
                variant={selectedType === "vegan" ? "default" : "outline"}
                onClick={() => setSelectedType("vegan")}
                className="w-full justify-start gap-2"
              >
                Végétalien
              </Button>
              <Button
                variant={selectedType === "mediterranean" ? "default" : "outline"}
                onClick={() => setSelectedType("mediterranean")}
                className="w-full justify-start gap-2"
              >
                Méditerranéen
              </Button>
              <Button
                variant={selectedType === "keto" ? "default" : "outline"}
                onClick={() => setSelectedType("keto")}
                className="w-full justify-start gap-2"
              >
                Cétogène
              </Button>
              <Button
                variant={selectedType === "glutenFree" ? "default" : "outline"}
                onClick={() => setSelectedType("glutenFree")}
                className="w-full justify-start gap-2"
              >
                Sans gluten
              </Button>
              <Button
                variant={selectedType === "high_fiber" ? "default" : "outline"}
                onClick={() => setSelectedType("high_fiber")}
                className="w-full justify-start gap-2"
              >
                Riche en fibres
              </Button>
              <Button
                variant={selectedType === "seche_extreme" ? "default" : "outline"}
                onClick={() => setSelectedType("seche_extreme")}
                className="w-full justify-start gap-2"
              >
                Sèche extrême
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Durée du plan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[7, 14, 30].map((days) => (
                <Button
                  key={days}
                  variant={selectedDuration === days ? "default" : "outline"}
                  onClick={() => setSelectedDuration(days)}
                  className="w-full"
                >
                  {days} jours
                </Button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? "Génération en cours..." : "Générer un plan"}
          </Button>
        </div>
      </Card>

      <GeneratedPlanDisplay />
    </div>
  );
};
