
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, LineChart, PlusCircle, Trophy } from "lucide-react";
import { RecommendedPrograms } from "@/components/Workouts/RecommendedPrograms";
import { useLanguage } from "@/contexts/LanguageContext";

export function HomeTab() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("workouts.startWorkout")}</CardTitle>
            <CardDescription>
              {t("workouts.createNewSession")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-4">
            <Dumbbell className="h-16 w-16 text-primary/60" />
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => navigate('/workouts/generate')}
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              {t("workouts.newWorkout")}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("workouts.latestPerformances")}</CardTitle>
            <CardDescription>
              {t("workouts.trackProgressDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-4">
            <Trophy className="h-16 w-16 text-primary/60" />
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => navigate('/workouts/progress')}
              className="w-full"
            >
              <LineChart className="h-4 w-4 mr-2" />
              {t("workouts.viewProgress")}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <RecommendedPrograms />
    </div>
  );
}
