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

  return (
    <div className="container mx-auto p-4 animate-fade-up">
      <h1 className="text-3xl font-bold mb-6">Nutrition</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 h-20"
          onClick={() => document.querySelector('[value="overview"]')?.click()}
        >
          <Target className="h-5 w-5" />
          <div className="text-left">
            <div className="font-semibold">Objectifs</div>
            <div className="text-sm text-muted-foreground">Suivez vos objectifs</div>
          </div>
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 h-20"
          onClick={() => document.querySelector('[value="overview"]')?.click()}
        >
          <LineChart className="h-5 w-5" />
          <div className="text-left">
            <div className="font-semibold">Suivi</div>
            <div className="text-sm text-muted-foreground">Visualisez vos progrès</div>
          </div>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="journal">Journal alimentaire</TabsTrigger>
          <TabsTrigger value="meal-plan">Plan repas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
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