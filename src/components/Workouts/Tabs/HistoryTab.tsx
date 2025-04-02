
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Clock, Dumbbell, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export function HistoryTab() {
  const { t } = useLanguage();
  
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

  // Sample workout history data
  const workoutHistory = [
    { id: 1, date: "2023-06-15", type: "Chest & Triceps", duration: 45, exercises: 5 },
    { id: 2, date: "2023-06-12", type: "Legs", duration: 60, exercises: 6 },
    { id: 3, date: "2023-06-10", type: "Back & Biceps", duration: 50, exercises: 5 },
  ];

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
            {t("workouts.recentWorkouts")}
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
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{workout.duration} min</span>
                            </div>
                            <div>
                              <Badge variant="outline" className="text-xs">
                                {workout.exercises} {t("workouts.exerciseLibrary").toLowerCase()}
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
            <Button variant="outline" className="w-full sm:w-auto">
              {t("workouts.viewFullHistory")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
