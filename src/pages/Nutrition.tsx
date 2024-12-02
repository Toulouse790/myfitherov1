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
    <div className="container mx-auto p-2 sm:p-4 animate-fade-up">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Nutrition</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 h-16 sm:h-20"
          onClick={() => handleTabClick("overview")}
        >
          <Target className="h-4 w-4 sm:h-5 sm:w-5" />
          <div className="text-left">
            <div className="font-semibold text-sm sm:text-base">Objectifs</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Suivez vos objectifs</div>
          </div>
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 h-16 sm:h-20"
          onClick={() => handleTabClick("overview")}
        >
          <LineChart className="h-4 w-4 sm:h-5 sm:w-5" />
          <div className="text-left">
            <div className="font-semibold text-sm sm:text-base">Suivi</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Visualisez vos progrès</div>
          </div>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="journal">Journal alimentaire</TabsTrigger>
          <TabsTrigger value="meal-plan">Plan repas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div className="space-y-4 sm:space-y-6">
              <NutritionGoals />
              <NutritionChart />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="journal">
          <div className="max-w-4xl mx-auto">
            <FoodJournal />
          </div>
        </TabsContent>

        <TabsContent value="meal-plan">
          <div className="max-w-4xl mx-auto">
            <MealPlanGenerator {...mockUserData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Nutrition;