import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DayMeals } from "./DayMeals";
import { defaultMeals } from "@/data/meals/mealPlanGenerator";
import { MealPlan } from "@/data/meals/types";

interface GeneratedPlanDisplayProps {
  generatedPlan: MealPlan[];
  durationDays: string;
}

const weekDays = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche"
];

export const GeneratedPlanDisplay = ({ 
  generatedPlan,
  durationDays,
}: GeneratedPlanDisplayProps) => {
  if (!generatedPlan) return null;

  // Calculate total carbs for each day's meals
  const calculateDayTotalCarbs = (meals: Record<string, { carbs: number }>) => {
    return Object.values(meals).reduce((total: number, meal) => {
      return total + (meal.carbs || 0);
    }, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Votre plan alimentaire</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="1" className="w-full">
          <TabsList className="w-full flex-wrap h-auto">
            {Array.from({ length: parseInt(durationDays) }, (_, i) => (
              <TabsTrigger key={i + 1} value={(i + 1).toString()} className="flex-1">
                {weekDays[i % 7]}
              </TabsTrigger>
            ))}
          </TabsList>
          {generatedPlan.map((day, index) => {
            const totalCarbs = calculateDayTotalCarbs(day.meals);
            const carbsTarget = day.carbsTarget || 250; // Default target if not provided

            return (
              <TabsContent key={index} value={(index + 1).toString()}>
                <DayMeals 
                  meals={day.meals} 
                  mealTitles={defaultMeals}
                  totalCarbs={totalCarbs}
                  carbsTarget={carbsTarget}
                  isTrainingDay={day.isTrainingDay}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};