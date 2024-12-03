import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WorkoutTimer } from "./WorkoutTimer";
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
    } catch (error) {
      console.error('Error starting workout:', error);
    }
  };

  const handleExerciseClick = (index: number) => {
    if (!isWorkoutStarted) return;
    setCurrentExerciseIndex(index);
  };

  const handleEndWorkout = () => {
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
      {isWorkoutStarted && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <WorkoutTimer />
        </div>
      )}
      
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <Button 
          variant="ghost" 
          onClick={handleEndWorkout}
          className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive"
        >
          <span>Terminer l'entraînement</span>
        </Button>

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
      </div>

      <AlertDialog open={showEndWorkoutDialog} onOpenChange={setShowEndWorkoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminer l'entraînement ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir terminer cet entraînement ? Cette action ne peut pas être annulée.
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