
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, ChevronLeft, ChevronRight, Clock, Dumbbell, History } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";

export const WorkoutHistory = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const isMobile = useIsMobile();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  // Exemple de données (à remplacer par des données réelles)
  const mockWorkouts = [
    { id: 1, date: '2023-07-22', name: 'Entraînement du haut du corps', duration: 45, calories: 320 },
    { id: 2, date: '2023-07-20', name: 'Cardio HIIT', duration: 30, calories: 280 },
    { id: 3, date: '2023-07-17', name: 'Jour des jambes', duration: 50, calories: 350 }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>{t("workouts.history") || "Historique"}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('prev')}
                className={`${isMobile ? 'h-8 w-8' : 'h-9 w-9'}`}
                aria-label={t("workouts.previousMonth") || "Mois précédent"}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">{formatMonthYear(currentMonth)}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('next')}
                className={`${isMobile ? 'h-8 w-8' : 'h-9 w-9'}`}
                aria-label={t("workouts.nextMonth") || "Mois suivant"}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            {t("workouts.historyDescription") || "Consultez vos séances d'entraînement passées"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockWorkouts.length > 0 ? (
            <div className="space-y-4">
              {mockWorkouts.map((workout) => (
                <div 
                  key={workout.id}
                  className="flex justify-between items-center p-3 bg-muted/20 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <div>
                    <p className="font-medium">{workout.name}</p>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>{new Date(workout.date).toLocaleDateString()}</span>
                      <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                      <span>{workout.duration} min</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{workout.calories} kcal</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <History className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
              <p className="text-muted-foreground">
                {t("workouts.noHistory") || "Aucun historique d'entraînement pour le moment"}
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                size={isMobile ? "lg" : "default"}
              >
                <Dumbbell className="h-4 w-4 mr-2" />
                <span className="truncate">{t("workouts.startFirstWorkout") || "Commencer votre premier entraînement"}</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
