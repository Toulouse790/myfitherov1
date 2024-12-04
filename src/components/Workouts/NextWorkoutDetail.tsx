import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { WorkoutSummaryDialog } from "./NextWorkoutDetail/WorkoutSummaryDialog";
import { useToast } from "@/hooks/use-toast";
import { WorkoutHeader } from "./NextWorkoutDetail/WorkoutHeader";
import { ExercisePreview } from "./NextWorkoutDetail/ExercisePreview";
import { StartWorkoutButton } from "./NextWorkoutDetail/StartWorkoutButton";
import { WorkoutInProgress } from "./NextWorkoutDetail/WorkoutInProgress";

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
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour commencer un entraînement",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('workout_sessions')
        .insert([{ user_id: user.id }]);

      if (error) throw error;
      
      setIsWorkoutStarted(true);
      setCurrentExerciseIndex(0);
      startTimeRef.current = new Date();
      
      toast({
        title: "C'est parti !",
        description: "Votre séance d'entraînement a commencé.",
      });
    } catch (error) {
      console.error('Error starting workout:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du démarrage de l'entraînement",
        variant: "destructive",
      });
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

  const confirmEndWorkout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('workout_sessions')
        .update({ status: 'completed' })
        .eq('user_id', user.id)
        .eq('status', 'in_progress');

      if (error) throw error;

      toast({
        title: "Entraînement terminé",
        description: "Votre séance a été enregistrée avec succès.",
      });
      navigate(-1);
    } catch (error) {
      console.error('Error completing workout:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la finalisation de l'entraînement",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-8 space-y-8">
        <WorkoutHeader />

        {!isWorkoutStarted ? (
          <div className="space-y-8">
            <Card className="border p-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Exercices prévus</h2>
                <div className="grid gap-4">
                  {SAMPLE_EXERCISES.map((exercise, index) => (
                    <ExercisePreview key={index} exercise={exercise} />
                  ))}
                </div>
              </div>
            </Card>
            
            <StartWorkoutButton onClick={handleStartWorkout} />
          </div>
        ) : (
          <WorkoutInProgress
            exercises={SAMPLE_EXERCISES}
            currentExerciseIndex={currentExerciseIndex}
            onExerciseClick={handleExerciseClick}
            onEndWorkout={handleEndWorkout}
          />
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