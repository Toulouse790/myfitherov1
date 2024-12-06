import { useState } from "react";
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

  const progress = currentExerciseIndex !== null 
    ? ((currentExerciseIndex + 1) / exercises.length) * 100 
    : 0;

  const handleStartWorkout = () => {
    setIsRunning(true);
    handleExerciseClick(0);
  };

  const handleEndWorkout = () => {
    setShowSummary(true);
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
    <div className="container max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 py-6 border-b">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Timer className="w-6 h-6 text-primary" />
            <span className="font-mono text-xl">
              {formatWorkoutTime(Math.round(duration))}
            </span>
          </div>
          
          {!workoutStarted && (
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-8"
              onClick={handleStartWorkout}
            >
              Commencer ma séance
            </Button>
          )}
        </div>

        {workoutStarted && (
          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progression de la séance</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <ExerciseList
            exercises={exercises}
            currentExerciseIndex={currentExerciseIndex}
            isWorkoutStarted={workoutStarted}
            onExerciseClick={handleExerciseClick}
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
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-6 text-muted-foreground bg-muted/10 rounded-lg border-2 border-dashed">
              <p className="text-xl">
                Cliquez sur "Commencer ma séance" pour démarrer votre entraînement
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-8 right-8">
        {workoutStarted && (
          <Button 
            variant="destructive"
            size="lg"
            onClick={handleEndWorkout}
            className="shadow-lg px-6"
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
          totalCalories: 0
        }}
        onConfirm={handleConfirmEndWorkout}
      />
    </div>
  );
};