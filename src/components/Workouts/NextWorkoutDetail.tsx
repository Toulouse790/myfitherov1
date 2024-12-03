import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WorkoutTimer, formatWorkoutTime } from "./WorkoutTimer";
import { ExerciseList } from "./NextWorkoutDetail/ExerciseList";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ExerciseSets } from "./ExerciseSets";

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

      const { data, error } = await supabase
        .from('workout_sessions')
        .insert([
          { user_id: user.id }
        ])
        .select()
        .single();

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
      
      // Calculer les statistiques totales de la séance
      // Note: Dans une vraie application, ces valeurs devraient être accumulées pendant la séance
      setWorkoutStats({
        duration: durationInSeconds,
        totalWeight: 1250, // À remplacer par le vrai calcul
        totalCalories: 350, // À remplacer par le vrai calcul
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 pb-20">
      {isWorkoutStarted && <WorkoutTimer />}
      
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <Card className="overflow-hidden border-none bg-card shadow-lg">
          <div className="p-6 space-y-8">
            {!isWorkoutStarted && (
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleStartWorkout}
              >
                Commencer l'entraînement
              </Button>
            )}

            <div className="space-y-6">
              {currentExerciseIndex !== null && isWorkoutStarted ? (
                <ExerciseSets
                  exerciseName={SAMPLE_EXERCISES[currentExerciseIndex]}
                />
              ) : (
                <ExerciseList
                  exercises={SAMPLE_EXERCISES}
                  currentExerciseIndex={currentExerciseIndex}
                  isWorkoutStarted={isWorkoutStarted}
                  onExerciseClick={handleExerciseClick}
                />
              )}
            </div>
          </div>
        </Card>

        {isWorkoutStarted && (
          <div className="fixed bottom-8 left-0 right-0 px-4">
            <Button 
              variant="destructive"
              onClick={handleEndWorkout}
              className="w-full max-w-4xl mx-auto"
            >
              Terminer l'entraînement
            </Button>
          </div>
        )}
      </div>

      <AlertDialog open={showEndWorkoutDialog} onOpenChange={setShowEndWorkoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Résumé de l'entraînement</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">{formatWorkoutTime(workoutStats.duration)}</p>
                  <p className="text-sm text-muted-foreground">Durée</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">{workoutStats.totalCalories}</p>
                  <p className="text-sm text-muted-foreground">Calories</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">{workoutStats.totalWeight}kg</p>
                  <p className="text-sm text-muted-foreground">Poids total</p>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Voulez-vous terminer cet entraînement ?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuer l'entraînement</AlertDialogCancel>
            <AlertDialogAction onClick={confirmEndWorkout} className="bg-destructive hover:bg-destructive/90">
              Terminer l'entraînement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};