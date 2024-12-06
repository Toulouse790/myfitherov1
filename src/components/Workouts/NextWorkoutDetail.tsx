import { useState } from "react";
import { WorkoutHeader } from "./NextWorkoutDetail/WorkoutHeader";
import { ExerciseList } from "./NextWorkoutDetail/ExerciseList";
import { WorkoutInProgress } from "./NextWorkoutDetail/WorkoutInProgress";
import { WorkoutSummaryDialog } from "./NextWorkoutDetail/WorkoutSummaryDialog";
import { CardioSession } from "./NextWorkoutDetail/CardioSession";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Timer } from "lucide-react";
import { formatWorkoutTime } from "./WorkoutTimer";

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
  const [isPaused, setIsPaused] = useState(false);

  const progress = currentExerciseIndex !== null 
    ? ((currentExerciseIndex + 1) / exercises.length) * 100 
    : 0;

  const handleStartWorkout = () => {
    setIsRunning(true);
    handleExerciseClick(0);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    setIsRunning(!isPaused);
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
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 py-4 border-b">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Timer className="w-5 h-5 text-primary" />
            <span className="font-mono text-lg">
              {formatWorkoutTime(Math.round(duration))}
            </span>
          </div>
          
          {!workoutStarted ? (
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-8"
              onClick={handleStartWorkout}
            >
              Commencer ma séance
            </Button>
          ) : (
            <Button
              variant={isPaused ? "default" : "outline"}
              onClick={handlePauseResume}
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Reprendre
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              )}
            </Button>
          )}
        </div>

        {workoutStarted && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progression de la séance</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
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
              isPaused={isPaused}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4 text-muted-foreground">
              <p className="text-lg">
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
            className="shadow-lg"
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
