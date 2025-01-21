import { NutritionGoals } from "@/components/Nutrition/NutritionGoals";
import { NutritionChart } from "@/components/Nutrition/NutritionChart";
import { MealPlanGenerator } from "@/components/Nutrition/MealPlanGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyMeals } from "@/components/Nutrition/DailyMeals";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Nutrition = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Accès refusé",
        description: "Vous devez être connecté pour accéder à cette page",
        variant: "destructive",
      });
      navigate("/sign-in");
    }
  }, [user, loading, toast, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
              value="meal-plan" 
              className="text-[11px] sm:text-sm whitespace-nowrap px-2.5 sm:px-4 py-1.5 sm:py-2"
            >
              Plan repas
            </TabsTrigger>
            <TabsTrigger 
              value="tracking" 
              className="text-[11px] sm:text-sm whitespace-nowrap px-2.5 sm:px-4 py-1.5 sm:py-2"
            >
              Suivi hebdomadaire
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4 mt-2">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <div className="space-y-4 w-full min-w-0">
              <NutritionGoals />
            </div>
            <div className="space-y-4 w-full min-w-0">
              <DailyMeals />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4 mt-2">
          <div className="w-full min-w-0">
            <NutritionChart />
          </div>
        </TabsContent>

        <TabsContent value="meal-plan" className="space-y-4 mt-2">
          <div className="w-full min-w-0">
            <MealPlanGenerator />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Nutrition;