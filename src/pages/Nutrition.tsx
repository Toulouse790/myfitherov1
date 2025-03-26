
import { NutritionGoals } from "@/components/Nutrition/NutritionGoals";
import { NutritionChart } from "@/components/Nutrition/NutritionChart";
import { MealPlanGenerator } from "@/components/Nutrition/MealPlanGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyMeals } from "@/components/Nutrition/DailyMeals";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FoodJournal } from "@/components/Nutrition/FoodJournal";
import { Button } from "@/components/ui/button";
import { PieChart, BarChart, Utensils } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Nutrition = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: t("auth.error"),
        description: t("auth.sessionExpired"),
        variant: "destructive",
      });
      navigate("/sign-in");
    }
  }, [user, loading, toast, navigate, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleTabClick = (tabValue: string) => {
    setActiveTab(tabValue);
    const element = document.querySelector(`[value="${tabValue}"]`) as HTMLElement;
    if (element) {
      element.click();
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 pb-24 animate-fade-up max-w-full sm:max-w-[95%] lg:max-w-[1280px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{t("nutrition.title")}</h1>
        
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === "overview" ? "default" : "outline"} 
            size="sm"
            onClick={() => handleTabClick("overview")}
            className="flex items-center gap-1"
          >
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">{t("nutrition.overview")}</span>
          </Button>
          <Button 
            variant={activeTab === "meal-plan" ? "default" : "outline"} 
            size="sm"
            onClick={() => handleTabClick("meal-plan")}
            className="flex items-center gap-1"
          >
            <Utensils className="h-4 w-4" />
            <span className="hidden sm:inline">{t("nutrition.mealPlan")}</span>
          </Button>
          <Button 
            variant={activeTab === "tracking" ? "default" : "outline"} 
            size="sm"
            onClick={() => handleTabClick("tracking")}
            className="flex items-center gap-1"
          >
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">{t("nutrition.tracking")}</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-3">
        <div className="w-full overflow-x-auto pb-1 -mx-2 px-2 hidden">
          <TabsList className="w-full justify-start min-w-max gap-1 p-1">
            <TabsTrigger 
              value="overview" 
              className="text-[11px] sm:text-sm whitespace-nowrap px-2.5 sm:px-4 py-1.5 sm:py-2"
            >
              {t("nutrition.overview")}
            </TabsTrigger>
            <TabsTrigger 
              value="meal-plan" 
              className="text-[11px] sm:text-sm whitespace-nowrap px-2.5 sm:px-4 py-1.5 sm:py-2"
            >
              {t("nutrition.mealPlan")}
            </TabsTrigger>
            <TabsTrigger 
              value="tracking" 
              className="text-[11px] sm:text-sm whitespace-nowrap px-2.5 sm:px-4 py-1.5 sm:py-2"
            >
              {t("nutrition.weeklyTracking")}
            </TabsTrigger>
            <TabsTrigger 
              value="journal" 
              className="text-[11px] sm:text-sm whitespace-nowrap px-2.5 sm:px-4 py-1.5 sm:py-2"
            >
              {t("nutrition.foodJournal")}
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
          <div className="w-full min-w-0">
            <FoodJournal />
          </div>
        </TabsContent>

        <TabsContent value="meal-plan" className="space-y-4 mt-2">
          <div className="w-full min-w-0">
            <MealPlanGenerator />
          </div>
        </TabsContent>

        <TabsContent value="journal" className="space-y-4 mt-2">
          <div className="w-full min-w-0">
            <FoodJournal />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Nutrition;
