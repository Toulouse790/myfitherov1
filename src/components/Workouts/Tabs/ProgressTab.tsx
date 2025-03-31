
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Dumbbell, PlusCircle, Trophy } from "lucide-react";
import { ProgressTracker } from "@/components/Workouts/Progress/ProgressTracker";
import { useLanguage } from "@/contexts/LanguageContext";

export function ProgressTab() {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <ProgressTracker />
      
      <Card>
        <CardHeader>
          <CardTitle>{t("workouts.nextGoals")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <span>{t("workouts.goals.trainThreeTimes")}</span>
              </div>
              <Button variant="outline" size="sm">{t("common.edit")}</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Dumbbell className="h-4 w-4 mr-2 text-primary" />
                <span>{t("workouts.goals.increaseBenchPress")}</span>
              </div>
              <Button variant="outline" size="sm">{t("common.edit")}</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Trophy className="h-4 w-4 mr-2 text-primary" />
                <span>{t("workouts.goals.reachTrainingHours")}</span>
              </div>
              <Button variant="outline" size="sm">{t("common.edit")}</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("workouts.addGoal")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
