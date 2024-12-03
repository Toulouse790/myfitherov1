import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WorkoutTimer } from "./WorkoutTimer";
import { ExerciseList } from "./NextWorkoutDetail/ExerciseList";
import { supabase } from "@/integrations/supabase/client";
import { WorkoutSummaryDialog } from "./NextWorkoutDetail/WorkoutSummaryDialog";
import { ExerciseSets } from "./ExerciseSets";
import { useToast } from "@/hooks/use-toast";

const SAMPLE_EXERCISES = [
  "Rowing avec Haltères",
  "Tirage à la poulie barre en V",
  "Curl Biceps aux Haltères",
  "Développé Militaire"
];

export const NextWorkoutDetail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [showEndWorkoutDialog, setShowEndWorkoutDialog] = useState(false);
  const startTimeRef = useRef<Date | null>(null);
  const [workoutStats, setWorkoutStats] = useState({
    duration: 0,
    totalWeight: 0,
    totalCalories: 0
  });

  useEffect(() => {
    if (isWorkoutStarted && !startTimeRef.current) {
      startTimeRef.current = new Date();
    }
  }, [isWorkoutStarted]);

  const handleStartWorkout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('workout_sessions')
        .insert([{ user_id: user.id }]);

      if (error) throw error;
      
      setIsWorkoutStarted(true);
      setCurrentExerciseIndex(0);
      startTimeRef.current = new Date();
    } catch (error) {
      console.error('Error starting workout:', error);
    }
  };

  const handleExerciseClick = (index: number) => {
    if (!isWorkoutStarted) return;
    setCurrentExerciseIndex(index);
  };

  const handleEndWorkout = () => {
    if (startTimeRef.current) {
      const endTime = new Date();
      const durationInSeconds = Math.floor((endTime.getTime() - startTimeRef.current.getTime()) / 1000);
      setWorkoutStats({
        duration: durationInSeconds,
        totalWeight: 1250,
        totalCalories: 350,
      });
    }
    setShowEndWorkoutDialog(true);
  };

  const confirmEndWorkout = () => {
    toast({
      title: "Entraînement terminé",
      description: "Votre séance a été enregistrée avec succès.",
    });
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-2xl mx-auto px-4 py-8 space-y-6">
        {!isWorkoutStarted ? (
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleStartWorkout}
          >
            Commencer l'entraînement
          </Button>
        ) : (
          <Card className="border-none shadow-sm">
            <div className="p-4 space-y-6">
              {currentExerciseIndex !== null && (
                <ExerciseSets
                  exerciseName={SAMPLE_EXERCISES[currentExerciseIndex]}
                />
              )}
              <ExerciseList
                exercises={SAMPLE_EXERCISES}
                currentExerciseIndex={currentExerciseIndex}
                isWorkoutStarted={isWorkoutStarted}
                onExerciseClick={handleExerciseClick}
              />
            </div>
          </Card>
        )}

        {isWorkoutStarted && (
          <div className="fixed bottom-8 left-0 right-0 px-4">
            <Button 
              variant="destructive"
              onClick={handleEndWorkout}
              className="w-full max-w-2xl mx-auto"
            >
              Terminer l'entraînement
            </Button>
          </div>
        )}
      </div>

      <WorkoutSummaryDialog
        open={showEndWorkoutDialog}
        onOpenChange={setShowEndWorkoutDialog}
        stats={workoutStats}
        onConfirm={confirmEndWorkout}
      />
    </div>
  );
};