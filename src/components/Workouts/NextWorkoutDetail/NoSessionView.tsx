
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useExerciseTranslation } from "@/hooks/use-exercise-translation";

export const NoSessionView = () => {
  const { t } = useLanguage();
  const { translateWorkoutElement } = useExerciseTranslation();
  
  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Card className="p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">{translateWorkoutElement("startTest")}</h2>
          <p className="text-muted-foreground">
            {translateWorkoutElement("clickToStartTest")}
          </p>
          <Button 
            size="lg"
            className="w-full sm:w-auto"
          >
            <Timer className="w-5 h-5 mr-2" />
            {translateWorkoutElement("beginTest")}
          </Button>
        </div>
      </Card>
    </div>
  );
};
