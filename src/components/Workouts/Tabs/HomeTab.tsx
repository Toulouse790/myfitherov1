
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Clock, Footprints, LineChart, PlusCircle, Trophy, Sparkles } from "lucide-react";
import { RecommendedPrograms } from "@/components/Workouts/RecommendedPrograms";
import { useLanguage } from "@/contexts/LanguageContext";
import { SportPrograms } from "@/components/Workouts/SportPrograms";

export function HomeTab() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("workouts.createSession")}</CardTitle>
            <CardDescription>
              {t("workouts.createCustomSession")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-4">
            <Dumbbell className="h-16 w-16 text-primary/60" />
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => navigate('/workouts/create')}
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              {t("workouts.createMySession")}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("workouts.generateSession")}</CardTitle>
            <CardDescription>
              {t("workouts.aiGeneratedSession")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-4">
            <Sparkles className="h-16 w-16 text-primary/60" />
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => navigate('/workouts/generate')}
              className="w-full" 
              variant="default"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {t("workouts.generateMySession")}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("workouts.sportSpecific")}</CardTitle>
            <CardDescription>
              {t("workouts.programsForYourSport")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-4">
            <Footprints className="h-16 w-16 text-primary/60" />
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => document.getElementById('sport-programs-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full"
            >
              <Footprints className="h-4 w-4 mr-2" />
              {t("workouts.sportPrograms")}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("workouts.recentPerformances")}</CardTitle>
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
              {t("workouts.viewMyProgress")}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <RecommendedPrograms />
      
      <div id="sport-programs-section">
        <SportPrograms />
      </div>
    </div>
  );
}
