
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronRight, Clock, DumbbellIcon } from "lucide-react";
import { ExerciseDetail } from "./WorkoutSession/ExerciseDetail";
import { useWorkoutSession } from "./WorkoutSession/useWorkoutSession";
import { debugLogger } from "@/utils/debug-logger";

interface WorkoutSessionProps {
  sessionId?: string;
}

export const WorkoutSession = ({ sessionId }: WorkoutSessionProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const {
    loading,
    session,
    currentExerciseIndex,
    exerciseProgress,
    showExerciseDetail,
    sessionDuration,
    formatDuration,
    handleExerciseSelect,
    handleExerciseComplete,
    handleCompleteWorkout,
    setShowExerciseDetail,
    showSummaryDialog,
    setShowSummaryDialog,
    workoutStats,
    handleFinishWorkout
  } = useWorkoutSession();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[50px] w-full" />
        <div className="space-y-3">
          <Skeleton className="h-[60px] w-full" />
          <Skeleton className="h-[60px] w-full" />
          <Skeleton className="h-[60px] w-full" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <DumbbellIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t("workouts.sessionNotFound") || "Session non trouvée"}</h2>
            <p className="text-muted-foreground mb-4">
              {t("workouts.sessionNotFoundDescription") || "La session d'entraînement demandée n'existe pas ou n'est plus disponible."}
            </p>
            <Button onClick={() => window.history.back()}>
              {t("common.goBack") || "Retour"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showExerciseDetail && session?.exercises?.[currentExerciseIndex]) {
    return (
      <ExerciseDetail
        exerciseName={session.exercises[currentExerciseIndex]}
        onComplete={handleExerciseComplete}
        onBack={() => setShowExerciseDetail(false)}
        initialSets={3}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("workouts.trainingSession") || "Séance d'entraînement"}</h1>
        <div className="flex items-center text-lg font-mono">
          <Clock className="mr-2 h-5 w-5" />
          <span>{formatDuration(sessionDuration)}</span>
        </div>
      </div>

      <div className="space-y-4">
        {session?.exercises?.map((exercise, index) => {
          const isCompleted = exerciseProgress[exercise]?.completed || false;
          const totalSets = exerciseProgress[exercise]?.totalSets || 3;
          const completedSets = exerciseProgress[exercise]?.sets || 0;

          return (
            <Card
              key={index}
              className={`transition-all hover:bg-muted/50 cursor-pointer ${
                index === currentExerciseIndex && showExerciseDetail ? "ring-2 ring-primary" : ""
              } ${isCompleted ? "bg-muted/20" : ""}`}
              onClick={() => handleExerciseSelect(index)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">{exercise}</h3>
                  <div className="text-sm text-muted-foreground">
                    {isCompleted ? (
                      <span className="text-green-600 dark:text-green-500">
                        {t("workouts.completed") || "Terminé"} • {completedSets} {t("workouts.setsCompleted") || "séries complétées"}
                      </span>
                    ) : (
                      <span>
                        {totalSets} {t("workouts.sets") || "séries"}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button 
        onClick={handleCompleteWorkout} 
        className="w-full mt-6"
        variant="default"
        size="lg"
      >
        {t("workouts.completeWorkout") || "Terminer l'entraînement"}
      </Button>

      {showSummaryDialog && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">{t("workouts.sessionSummary") || "Résumé de la séance"}</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span>{t("workouts.duration") || "Durée"}:</span>
                  <span className="font-medium">{workoutStats.duration} {t("workouts.minutes") || "min"}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span>{t("workouts.caloriesBurned") || "Calories brûlées"}:</span>
                  <span className="font-medium">{workoutStats.totalCalories} kcal</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span>{t("workouts.exercisesCompleted") || "Exercices terminés"}:</span>
                  <span className="font-medium">
                    {Object.values(exerciseProgress).filter(ex => ex.completed).length} / {session?.exercises?.length || 0}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowSummaryDialog(false)}
                >
                  {t("common.cancel") || "Annuler"}
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleFinishWorkout}
                >
                  {t("common.confirm") || "Confirmer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
