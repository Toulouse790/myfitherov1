
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWorkoutOperations } from "@/hooks/workout/use-workout-operations";
import { useToast } from "@/hooks/use-toast";
import { ActivitySquare, Dumbbell, Flame, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { debugLogger } from "@/utils/debug-logger";
import { DifficultyBadges } from "@/components/Admin/DifficultyBadges";
import { useExerciseTranslation } from "@/hooks/use-exercise-translation";

// Exercices prédéfinis par difficulté
const quickStartWorkouts = {
  beginner: {
    exercises: ["Squats", "Pompes sur genoux", "Fentes", "Crunchs"],
    duration: 30,
    intensity: 40
  },
  intermediate: {
    exercises: ["Squats", "Pompes", "Fentes alternées", "Mountain climbers", "Gainage"],
    duration: 45,
    intensity: 60
  },
  advanced: {
    exercises: ["Burpees", "Pompes diamant", "Squats sautés", "Mountain climbers rapides", "Gainage latéral", "V-ups"],
    duration: 50,
    intensity: 80
  }
};

export const QuickStartWorkout = () => {
  const { t } = useLanguage();
  const { startWorkout, isLoading } = useWorkoutOperations();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("intermediate");
  const { translateDifficulty } = useExerciseTranslation();
  
  const handleStartQuickWorkout = async (difficulty: string) => {
    try {
      if (!user) {
        toast({
          title: t("common.error"),
          description: t("workouts.errors.loginRequired"),
          variant: "destructive"
        });
        return;
      }

      debugLogger.log("QuickStartWorkout", "Démarrage rapide avec difficulté:", difficulty);
      
      const workoutConfig = quickStartWorkouts[difficulty as keyof typeof quickStartWorkouts];
      
      if (!workoutConfig) {
        throw new Error("Configuration d'entraînement invalide");
      }
      
      await startWorkout({
        exercises: workoutConfig.exercises,
        duration: workoutConfig.duration,
        intensity: workoutConfig.intensity,
        type: "quick_start"
      });
      
    } catch (error) {
      console.error("Erreur lors du démarrage rapide:", error);
      toast({
        title: t("common.error"),
        description: t("workouts.errors.sessionCreationError"),
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-primary" />
          {t("difficulty.quickStart") || "Démarrage rapide"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t("workouts.quickStartDescription") || "Démarrez immédiatement un entraînement adapté à votre niveau"}
        </p>
        
        <div className="space-y-2">
          <div className="text-sm font-medium mb-2">
            {t("workouts.selectDifficulty") || "Sélectionnez votre niveau"}:
          </div>
          
          <DifficultyBadges 
            difficulties={["beginner", "intermediate", "advanced"]}
            selectedDifficulties={[selectedDifficulty]}
            onDifficultyChange={(difficulty) => setSelectedDifficulty(difficulty)}
          />
        </div>
        
        <div className="space-y-2 mt-4">
          <div className="flex justify-between">
            <Badge variant="outline" className="flex items-center gap-1">
              <ActivitySquare className="h-3 w-3" />
              <span>{quickStartWorkouts[selectedDifficulty as keyof typeof quickStartWorkouts].exercises.length} {t("workouts.exercises")}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <span>{quickStartWorkouts[selectedDifficulty as keyof typeof quickStartWorkouts].duration} min</span>
            </Badge>
          </div>
          
          <Button 
            className="w-full mt-2" 
            onClick={() => handleStartQuickWorkout(selectedDifficulty)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("workouts.startingSession")}
              </>
            ) : (
              <>
                <Dumbbell className="h-4 w-4 mr-2" />
                {t("workouts.startSession")}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
