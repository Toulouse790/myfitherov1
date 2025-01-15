import { NutritionGoals } from "@/components/Nutrition/NutritionGoals";
import { NutritionChart } from "@/components/Nutrition/NutritionChart";
import { FoodJournal } from "@/components/Nutrition/FoodJournal";
import { MealPlanGenerator } from "@/components/Nutrition/MealPlanGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyMeals } from "@/components/Nutrition/DailyMeals";

const Nutrition = () => {
  const handleTabClick = (tabValue: string) => {
    const element = document.querySelector(`[value="${tabValue}"]`) as HTMLElement;
    if (element) {
      element.click();
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 pb-24 animate-fade-up max-w-full sm:max-w-[95%] lg:max-w-[1280px]">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 px-1">Nutrition</h1>

      <Tabs defaultValue="overview" className="space-y-3">
        <div className="w-full overflow-x-auto pb-1 -mx-2 px-2">
          <TabsList className="w-full justify-start min-w-max gap-1 p-1">
            <TabsTrigger 
              value="overview" 
              className="text-[11px] sm:text-sm whitespace-nowrap px-2.5 sm:px-4 py-1.5 sm:py-2"
            >
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger 
              value="tracking" 
              className="text-[11px] sm:text-sm whitespace-nowrap px-2.5 sm:px-4 py-1.5 sm:py-2"
            >
              Suivi hebdomadaire
            </TabsTrigger>
            <TabsTrigger 
              value="journal" 
              className="text-[11px] sm:text-sm whitespace-nowrap px-2.5 sm:px-4 py-1.5 sm:py-2"
            >
              Alimentaire
            </TabsTrigger>
            <TabsTrigger 
              value="meal-plan" 
              className="text-[11px] sm:text-sm whitespace-nowrap px-2.5 sm:px-4 py-1.5 sm:py-2"
            >
              Plan repas
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4 mt-2">
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            <div className="space-y-4">
              <NutritionGoals />
            </div>
            <div className="space-y-4">
              <DailyMeals />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4 mt-2">
          <div className="w-full">
            <NutritionChart />
          </div>
        </TabsContent>

        <TabsContent value="journal" className="space-y-4 mt-2">
          <div className="w-full">
            <FoodJournal />
          </div>
        </TabsContent>

        <TabsContent value="meal-plan" className="space-y-4 mt-2">
          <div className="w-full">
            <MealPlanGenerator />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Nutrition;