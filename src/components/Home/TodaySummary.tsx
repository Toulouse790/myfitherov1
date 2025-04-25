
import { Card } from "@/components/ui/card";
import { Dumbbell, Apple, Moon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";

export const TodaySummary = () => {
  const { t, language } = useLanguage();
  
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">
        {t("dashboard.todaySummary", { fallback: "Résumé d'aujourd'hui" })}
      </h2>
      
      <div className="space-y-4">
        {/* Entraînement */}
        <div className="flex items-center mb-2">
          <Dumbbell className="w-5 h-5 mr-3 text-primary-600" />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span>{t("dashboard.workout", { fallback: "Entraînement" })}</span>
              <span>0 min</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("dashboard.noWorkoutToday", { fallback: "Pas encore d'entraînement aujourd'hui" })}
        </p>
        
        {/* Nutrition */}
        <div className="flex items-center mb-2">
          <Apple className="w-5 h-5 mr-3 text-primary-600" />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span>{t("dashboard.nutrition", { fallback: "Nutrition" })}</span>
              <span>0 cal</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("dashboard.noMealToday", { fallback: "Pas encore de repas enregistré aujourd'hui" })}
        </p>
        
        {/* Sommeil */}
        <div className="flex items-center mb-2">
          <Moon className="w-5 h-5 mr-3 text-primary-600" />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span>{t("dashboard.sleep", { fallback: "Sommeil" })}</span>
              <span>N/A</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("dashboard.noSleepData", { fallback: "Pas de données de sommeil aujourd'hui" })}
        </p>
      </div>
    </Card>
  );
};
