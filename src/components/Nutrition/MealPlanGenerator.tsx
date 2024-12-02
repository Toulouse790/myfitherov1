import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MealPlan } from "@/types/nutrition";
import { MealPlanDisplay } from "./MealPlanDisplay";
import { useToast } from "@/hooks/use-toast";

interface MealPlanGeneratorProps {
  workoutsPerWeek: number;
  goal: "weight_loss" | "muscle_gain" | "maintenance";
  weight: number;
  height: number;
  age: number;
  allergies: string[];
}

export const MealPlanGenerator = ({
  workoutsPerWeek,
  goal,
  weight,
  height,
  age,
  allergies,
}: MealPlanGeneratorProps) => {
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState<MealPlan | null>(null);

  const calculateDailyCalories = () => {
    // Formule Harris-Benedict pour calculer les besoins caloriques de base
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    
    // Facteur d'activité basé sur le nombre d'entraînements
    const activityFactor = 1.2 + (workoutsPerWeek * 0.1);
    
    let totalCalories = bmr * activityFactor;

    // Ajustement selon l'objectif
    switch (goal) {
      case "weight_loss":
        totalCalories *= 0.85; // Déficit de 15%
        break;
      case "muscle_gain":
        totalCalories *= 1.15; // Surplus de 15%
        break;
      case "maintenance":
        // Pas d'ajustement
        break;
    }

    return Math.round(totalCalories);
  };

  const generateMealPlan = () => {
    const dailyCalories = calculateDailyCalories();
    const proteinPerKg = goal === "muscle_gain" ? 2.2 : 2;
    const dailyProtein = Math.round(weight * proteinPerKg);

    // Exemple de plan généré (à personnaliser selon les besoins)
    const newPlan: MealPlan = {
      id: Date.now().toString(),
      day: "Lundi",
      meals: [
        {
          id: "1",
          name: "Petit-déjeuner",
          type: "breakfast",
          foods: [
            {
              id: "1",
              name: "Flocons d'avoine",
              calories: 150,
              proteins: 5,
              quantity: 40,
              unit: "g"
            },
            {
              id: "2",
              name: "Banane",
              calories: 89,
              proteins: 1.1,
              quantity: 1,
              unit: "pièce"
            }
          ],
          totalCalories: 239,
          totalProteins: 6.1
        },
        {
          id: "2",
          name: "Déjeuner",
          type: "lunch",
          foods: [
            {
              id: "3",
              name: "Blanc de poulet",
              calories: 165,
              proteins: 31,
              quantity: 100,
              unit: "g",
              alternatives: [
                {
                  id: "3a",
                  name: "Filet de poisson",
                  calories: 140,
                  proteins: 28,
                  quantity: 100,
                  unit: "g"
                }
              ]
            }
          ],
          totalCalories: 165,
          totalProteins: 31
        }
      ],
      totalCalories: dailyCalories,
      totalProteins: dailyProtein
    };

    setCurrentPlan(newPlan);
    toast({
      title: "Plan alimentaire généré",
      description: `Plan basé sur ${dailyCalories} calories et ${dailyProtein}g de protéines par jour.`
    });
  };

  const handleUpdateMealPlan = (updatedPlan: MealPlan) => {
    setCurrentPlan(updatedPlan);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Votre plan alimentaire personnalisé</CardTitle>
        </CardHeader>
        <CardContent>
          <button
            onClick={generateMealPlan}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
          >
            Générer un nouveau plan
          </button>
        </CardContent>
      </Card>

      {currentPlan && (
        <MealPlanDisplay
          mealPlan={currentPlan}
          onUpdateMealPlan={handleUpdateMealPlan}
        />
      )}
    </div>
  );
};