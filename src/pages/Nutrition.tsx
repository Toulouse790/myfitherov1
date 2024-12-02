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
    <div className="container mx-auto px-2 py-4 animate-fade-up max-w-full">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Nutrition</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        <Button
          variant="outline"
          className="flex items-center gap-2 h-14 sm:h-16"
          onClick={() => handleTabClick("overview")}
        >
          <Target className="h-4 w-4" />
          <div className="text-left">
            <div className="font-semibold text-sm">Objectifs</div>
            <div className="text-xs text-muted-foreground">Suivez vos objectifs</div>
          </div>
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 h-14 sm:h-16"
          onClick={() => handleTabClick("overview")}
        >
          <LineChart className="h-4 w-4" />
          <div className="text-left">
            <div className="font-semibold text-sm">Suivi</div>
            <div className="text-xs text-muted-foreground">Visualisez vos progrès</div>
          </div>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="w-full overflow-x-auto">
          <TabsList className="w-full justify-start min-w-max">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="journal">Journal alimentaire</TabsTrigger>
            <TabsTrigger value="meal-plan">Plan repas</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <NutritionGoals />
              <NutritionChart />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="journal">
          <div className="max-w-full">
            <FoodJournal />
          </div>
        </TabsContent>

        <TabsContent value="meal-plan">
          <div className="max-w-full">
            <MealPlanGenerator {...mockUserData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Nutrition;