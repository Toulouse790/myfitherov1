
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, ChevronLeft, ChevronRight, Clock, Dumbbell, History, Flame } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface WorkoutHistoryItem {
  id: number;
  date: string;
  name: string;
  duration: number;
  calories: number;
}

export function WorkoutHistory() {
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
    return date.toLocaleDateString(t('common.locale', { fallback: 'fr-FR' }), { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Données d'historique d'entraînement avec des dates actuelles (2025)
  const mockWorkouts: WorkoutHistoryItem[] = [
    { id: 1, date: '2025-04-15', name: t('workouts.upperBodyTraining'), duration: 45, calories: 320 },
    { id: 2, date: '2025-04-12', name: t('workouts.cardioHIIT'), duration: 30, calories: 280 },
    { id: 3, date: '2025-04-10', name: t('workouts.legDay'), duration: 50, calories: 350 },
    { id: 4, date: '2025-04-05', name: t('workouts.fullBodyWorkout'), duration: 60, calories: 400 },
    { id: 5, date: '2025-04-01', name: t('workouts.coreTraining'), duration: 25, calories: 220 }
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(t('common.locale', { fallback: 'fr-FR' }));
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>{t("workouts.history")}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('prev')}
                className={`${isMobile ? 'h-8 w-8' : 'h-9 w-9'}`}
                aria-label={t("common.previousMonth")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium text-sm sm:text-base">{formatMonthYear(currentMonth)}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('next')}
                className={`${isMobile ? 'h-8 w-8' : 'h-9 w-9'}`}
                aria-label={t("common.nextMonth")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            {t("workouts.historyDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockWorkouts.length > 0 ? (
            <div className="space-y-4">
              {mockWorkouts.map((workout) => (
                <motion.div 
                  key={workout.id}
                  variants={item}
                  className="flex justify-between items-center p-3 bg-muted/20 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base">{workout.name}</p>
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground mt-1 flex-wrap gap-2">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{formatDate(workout.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 ml-1 mr-1" />
                        <span>{workout.duration} {t("workouts.min")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center">
                    <Flame className="h-4 w-4 text-orange-500 mr-1 hidden sm:inline" />
                    <span className="text-sm font-medium">{workout.calories} {t("workouts.kcal")}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <History className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
              <p className="text-muted-foreground">
                {t("workouts.noHistory")}
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                size={isMobile ? "lg" : "default"}
              >
                <Dumbbell className="h-4 w-4 mr-2" />
                <span className="truncate">{t("workouts.startFirstWorkout")}</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
