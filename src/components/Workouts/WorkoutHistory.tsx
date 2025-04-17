
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, ChevronLeft, ChevronRight, Clock, Dumbbell, History, Flame } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

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
  const [workouts, setWorkouts] = useState<WorkoutHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkoutHistory = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        // Si des données sont trouvées, les convertir au format WorkoutHistoryItem
        if (data && data.length > 0) {
          const mappedWorkouts = data.map((session, index) => ({
            id: index + 1,
            date: session.created_at,
            name: session.workout_type === 'strength' 
              ? t('workouts.upperBodyTraining') 
              : session.workout_type === 'cardio' 
                ? t('workouts.cardioHIIT') 
                : t('workouts.fullBodyWorkout'),
            duration: session.total_duration_minutes || 30,
            calories: session.total_duration_minutes ? session.total_duration_minutes * 7 : 200
          }));
          setWorkouts(mappedWorkouts);
        } else {
          // Pas d'historique pour cet utilisateur
          setWorkouts([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique d'entraînement :", error);
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutHistory();
  }, [user, t]);

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
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full"></div>
              <p className="text-muted-foreground">{t("common.loading")}</p>
            </div>
          ) : workouts.length > 0 ? (
            <div className="space-y-4">
              {workouts.map((workout) => (
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
