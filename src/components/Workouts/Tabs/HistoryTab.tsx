
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Clock, Dumbbell, ChevronRight, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function HistoryTab() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
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

  // Sample workout history data with current dates (2025)
  const workoutHistory = [
    { id: 1, date: "2025-04-15", type: t("workouts.upperBodyTraining"), duration: 45, exercises: 5, calories: 320 },
    { id: 2, date: "2025-04-12", type: t("workouts.cardioHIIT"), duration: 30, exercises: 6, calories: 280 },
    { id: 3, date: "2025-04-10", type: t("workouts.legDay"), duration: 50, exercises: 5, calories: 350 },
  ];

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
      <Card className="overflow-hidden border-border/40 bg-gradient-to-br from-card to-card/80">
        <CardHeader className="bg-primary/5 pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5 text-primary" />
            {t("workouts.workoutHistory")}
          </CardTitle>
          <CardDescription>
            {t("workouts.historyDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {workoutHistory.length > 0 ? (
            <div className="space-y-4">
              {workoutHistory.map((workout) => (
                <motion.div key={workout.id} variants={item}>
                  <Card className="bg-background/50 hover:bg-background/70 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Dumbbell className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold">{workout.type}</h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(workout.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{workout.duration} {t("workouts.min")}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Flame className="h-3 w-3 text-orange-500" />
                              <span>{workout.calories} {t("workouts.kcal")}</span>
                            </div>
                            <div>
                              <Badge variant="outline" className="text-xs">
                                {workout.exercises} {t("workouts.exercises").toLowerCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <p>{t("workouts.noHistory")}</p>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => navigate('/workouts/history')}
            >
              {t("workouts.viewFullHistory")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
