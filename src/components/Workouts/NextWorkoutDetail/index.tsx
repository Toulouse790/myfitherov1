import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WorkoutHeader } from "./WorkoutHeader";
import { ExerciseList } from "./ExerciseList";
import { WorkoutInProgress } from "./WorkoutInProgress";
import { WorkoutSummaryDialog } from "./WorkoutSummaryDialog";
import { CardioSession } from "./CardioSession";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer } from "lucide-react";
import { formatWorkoutTime } from "@/utils/time";

export const NextWorkoutDetail = () => {
  const {
    user,
    sessionId,
    isCardio,
    duration,
    isRunning,
    exercises,
    currentExerciseIndex,
    workoutStarted,
    setIsRunning,
    handleRegenerateWorkout,
    handleExerciseClick,
    handleConfirmEndWorkout
  } = useWorkoutSession();

  const [showSummary, setShowSummary] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  const progress = exercises.length > 0 
    ? (completedExercises.length / exercises.length) * 100 
    : 0;

  // Calcul approximatif des calories (7.5 calories par minute d'exercice)
  const estimatedCalories = Math.round(duration / 60 * 7.5 * exercises.length);

  const handleStartWorkout = () => {
    setIsRunning(true);
    handleExerciseClick(0);
  };

  const handleEndWorkout = () => {
    setShowSummary(true);
  };

  const handleExerciseComplete = (index: number) => {
    if (!completedExercises.includes(index)) {
      setCompletedExercises(prev => [...prev, index]);
    }
    
    if (index < exercises.length - 1) {
      handleExerciseClick(index + 1);
    }
  };

  if (!user) return null;

  if (isCardio) {
    return (
      <CardioSession
        sessionId={sessionId}
        duration={duration}
        isRunning={isRunning}
        userId={user.id}
        setIsRunning={setIsRunning}
      />
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 py-4 sm:py-6 border-b">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span className="font-mono text-base sm:text-xl">
              {formatWorkoutTime(Math.round(duration))}
            </span>
          </div>
          
          {!workoutStarted && (
            <Button 
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold px-6 sm:px-8"
              onClick={handleStartWorkout}
            >
              Commencer ma séance
            </Button>
          )}
        </div>

        {workoutStarted && (
          <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
            <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
              <span>Progression de la séance</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-4 sm:space-y-6">
          <ExerciseList
            exercises={exercises}
            currentExerciseIndex={currentExerciseIndex}
            isWorkoutStarted={workoutStarted}
            onExerciseClick={handleExerciseClick}
            completedExercises={completedExercises}
          />
        </div>

        <div>
          {workoutStarted ? (
            <WorkoutInProgress
              exercises={exercises}
              currentExerciseIndex={currentExerciseIndex}
              onExerciseClick={handleExerciseClick}
              sessionId={sessionId}
              onRegenerateWorkout={handleRegenerateWorkout}
              onExerciseComplete={handleExerciseComplete}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 sm:p-12 text-center space-y-4 sm:space-y-6 text-muted-foreground bg-muted/10 rounded-lg border-2 border-dashed">
              <p className="text-base sm:text-xl">
                Cliquez sur "Commencer ma séance" pour démarrer votre entraînement
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8">
        {workoutStarted && (
          <Button 
            variant="destructive"
            size="lg"
            onClick={handleEndWorkout}
            className="shadow-lg px-4 sm:px-6 w-full sm:w-auto"
          >
            Terminer la séance
          </Button>
        )}
      </div>

      <WorkoutSummaryDialog
        open={showSummary}
        onOpenChange={setShowSummary}
        stats={{
          duration: Math.round(duration / 60),
          totalWeight: 0,
          totalCalories: estimatedCalories
        }}
        onConfirm={handleConfirmEndWorkout}
      />
    </div>
  );
};