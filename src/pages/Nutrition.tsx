import { NutritionGoals } from "@/components/Nutrition/NutritionGoals";
import { NutritionChart } from "@/components/Nutrition/NutritionChart";
import { FoodJournal } from "@/components/Nutrition/FoodJournal";
import { MealPlanGenerator } from "@/components/Nutrition/MealPlanGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Target, LineChart } from "lucide-react";

const Nutrition = () => {
  const mockUserData = {
    workoutsPerWeek: 4,
    goal: "muscle_gain" as const,
    weight: 75,
    height: 175,
    age: 30,
    allergies: [],
  };

  const handleTabClick = (tabValue: string) => {
    const element = document.querySelector(`[value="${tabValue}"]`) as HTMLElement;
    if (element) {
      element.click();
    }
  };

  return (
    <div className="container mx-auto p-2 animate-fade-up">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-3">Nutrition</h1>

      <Tabs defaultValue="overview" className="space-y-3">
        <div className="w-full overflow-x-auto pb-1">
          <TabsList className="w-full justify-start min-w-max">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="journal" className="text-xs sm:text-sm">Journal alimentaire</TabsTrigger>
            <TabsTrigger value="meal-plan" className="text-xs sm:text-sm">Plan repas</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-3">
              <NutritionGoals />
              <NutritionChart />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="journal">
          <div className="w-full">
            <FoodJournal />
          </div>
        </TabsContent>

        <TabsContent value="meal-plan">
          <div className="w-full">
            <MealPlanGenerator {...mockUserData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Nutrition;