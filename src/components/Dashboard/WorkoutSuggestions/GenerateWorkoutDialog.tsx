import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useExerciseFetching } from "@/hooks/use-exercise-fetching";
import { generateWorkoutPlan } from "./workoutPlanGenerator";
import { GeneratedWorkoutPreview } from "./GeneratedWorkoutPreview";
import { WorkoutPlan } from "./workoutPlanGenerator";
import { LoadingButton } from "./GenerateWorkout/LoadingButton";
import { WorkoutActions } from "./GenerateWorkout/WorkoutActions";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface GenerateWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkoutGenerated?: (workout: WorkoutPlan) => void;
}

export const GenerateWorkoutDialog = ({
  open,
  onOpenChange,
  onWorkoutGenerated
}: GenerateWorkoutDialogProps) => {
  const [availableExercises, setAvailableExercises] = useState<string[]>([]);
  const [generatedWorkout, setGeneratedWorkout] = useState<WorkoutPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { fetchExercises } = useExerciseFetching();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      const loadExercises = async () => {
        try {
          console.log("Chargement des exercices disponibles...");
          const exercises = await fetchExercises();
          console.log(`${exercises.length} exercices chargés avec succès`);
          setAvailableExercises(exercises);
        } catch (error) {
          console.error('Erreur lors du chargement des exercices:', error);
          toast({
            title: "Erreur de chargement",
            description: "Impossible de charger les exercices",
            variant: "destructive",
            duration: 2000,
          });
          onOpenChange(false);
        }
      };
      loadExercises();
    } else {
      setGeneratedWorkout(null);
    }
  }, [open, fetchExercises, toast, onOpenChange]);

  const handleGenerateWorkout = async () => {
    if (availableExercises.length === 0) {
      toast({
        title: "Information",
        description: "Aucun exercice disponible",
        duration: 2000,
      });
      return;
    }

    setIsGenerating(true);
    console.log("Génération du programme d'entraînement...");
    
    try {
      const workout = generateWorkoutPlan(availableExercises);
      console.log("Programme généré avec succès:", workout);
      setGeneratedWorkout(workout);
      toast({
        title: "Succès",
        description: "Programme d'entraînement généré avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le programme",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirm = async () => {
    if (!user) {
      navigate("/signin", { 
        state: { 
          from: location.pathname,
          workoutPlan: generatedWorkout
        } 
      });
      return;
    }

    if (generatedWorkout) {
      try {
        console.log("Création de la session d'entraînement...");
        const { data: session, error } = await supabase
          .from('workout_sessions')
          .insert([{
            user_id: user.id,
            exercises: generatedWorkout.exercises.map(ex => ex.name),
            type: 'strength',
            target_duration_minutes: 45
          }])
          .select()
          .single();

        if (error) throw error;

        console.log("Session créée avec succès:", session);
        
        if (onWorkoutGenerated) {
          onWorkoutGenerated(generatedWorkout);
        }
        
        onOpenChange(false);
        navigate(`/workouts/${session.id}`);
        
        toast({
          title: "Session créée",
          description: "Votre session d'entraînement est prête",
        });
      } catch (error) {
        console.error("Erreur lors de la création de la session:", error);
        toast({
          title: "Erreur",
          description: "Impossible de créer la session d'entraînement",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Programme d'entraînement personnalisé</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!generatedWorkout ? (
            <LoadingButton 
              isLoading={isGenerating}
              disabled={availableExercises.length === 0 || isGenerating}
              onClick={handleGenerateWorkout}
            />
          ) : (
            <div className="space-y-4">
              <GeneratedWorkoutPreview plan={generatedWorkout} />
              <WorkoutActions 
                onRegenerate={() => setGeneratedWorkout(null)}
                onConfirm={handleConfirm}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};