import { NutritionGoals } from "@/components/Nutrition/NutritionGoals";
import { NutritionChart } from "@/components/Nutrition/NutritionChart";
import { FoodJournal } from "@/components/Nutrition/FoodJournal";
import { MealPlanGenerator } from "@/components/Nutrition/MealPlanGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNav } from "@/components/Layout/BottomNav";
import { DailyMeals } from "@/components/Nutrition/DailyMeals";

const Nutrition = () => {
  const handleTabClick = (tabValue: string) => {
    const element = document.querySelector(`[value="${tabValue}"]`) as HTMLElement;
    if (element) {
      element.click();
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 pb-24 animate-fade-up">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-3">Nutrition</h1>

      <Tabs defaultValue="overview" className="space-y-3">
        <div className="w-full overflow-x-auto pb-1">
          <TabsList className="w-full justify-start min-w-max">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="tracking" className="text-xs sm:text-sm">Suivi hebdomadaire</TabsTrigger>
            <TabsTrigger value="journal" className="text-xs sm:text-sm">Journal alimentaire</TabsTrigger>
            <TabsTrigger value="meal-plan" className="text-xs sm:text-sm">Plan repas</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            <div className="space-y-4">
              <NutritionGoals />
            </div>
            <div className="space-y-4">
              <DailyMeals />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <div className="w-full">
            <NutritionChart />
          </div>
        </TabsContent>

        <TabsContent value="journal" className="space-y-4">
          <div className="w-full">
            <FoodJournal />
          </div>
        </TabsContent>

        <TabsContent value="meal-plan" className="space-y-4">
          <div className="w-full">
            <MealPlanGenerator />
          </div>
        </TabsContent>
      </Tabs>

      <BottomNav />
    </div>
  );
};

export default Nutrition;