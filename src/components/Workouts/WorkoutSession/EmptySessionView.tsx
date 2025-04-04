
import { AlertCircle } from "lucide-react";
import { Header } from "@/components/Layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const EmptySessionView = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl mx-auto p-4 pt-20">
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-semibold">{t("workouts.noExercisesFound")}</h2>
            <p className="text-muted-foreground">
              {t("workouts.sessionEmpty")}
            </p>
            <Button onClick={() => navigate('/workouts')}>
              {t("workouts.backToWorkouts")}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
