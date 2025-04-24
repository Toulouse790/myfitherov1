
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const NoSessionView = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Card className="p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">{t("workouts.startTest")}</h2>
          <p className="text-muted-foreground">
            {t("workouts.clickToStartTest")}
          </p>
          <Button 
            size="lg"
            className="w-full sm:w-auto"
          >
            <Timer className="w-5 h-5 mr-2" />
            {t("workouts.beginTest")}
          </Button>
        </div>
      </Card>
    </div>
  );
};
