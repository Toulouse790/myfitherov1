import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExerciseSets } from "../ExerciseSets";
import { InitialEnergyDialog } from "./InitialEnergyDialog";
import { WorkoutSummaryDialog } from "./WorkoutSummaryDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface WorkoutInProgressProps {
  exercises: string[];
  currentExerciseIndex: number | null;
  onExerciseClick: (index: number) => void;
  sessionId?: string | null;
  onRegenerateWorkout: () => void;
}

export const WorkoutInProgress = ({
  exercises,
  currentExerciseIndex,
  onExerciseClick,
  sessionId,
  onRegenerateWorkout,
}: WorkoutInProgressProps) => {
  const [showEnergyDialog, setShowEnergyDialog] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEnergyLevel = async (level: "good" | "bad") => {
    if (!sessionId) return;

    try {
      const { error } = await supabase
        .from('workout_sessions')
        .update({ initial_energy_level: level })
        .eq('id', sessionId);

      if (error) throw error;

      setShowEnergyDialog(false);
    } catch (error) {
      console.error('Error updating energy level:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre niveau d'énergie",
        variant: "destructive",
      });
    }
  };

  const handleEndWorkout = () => {
    setShowSummary(true);
  };

  const handleConfirmEndWorkout = async (difficulty: "easy" | "medium" | "hard") => {
    if (!sessionId) {
      toast({
        title: "Erreur",
        description: "Session non trouvée",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update training stats with perceived difficulty
      const { error: statsError } = await supabase
        .from('training_stats')
        .insert([{
          session_id: sessionId,
          perceived_difficulty: difficulty,
          duration_minutes: 0, // You might want to track actual duration
          total_sets: 0,      // You might want to track actual sets
          total_reps: 0,      // You might want to track actual reps
          total_weight: 0     // You might want to track actual weight
        }]);

      if (statsError) throw statsError;

      // Update session status
      const { error: sessionError } = await supabase
        .from('workout_sessions')
        .update({ status: 'completed' })
        .eq('id', sessionId);

      if (sessionError) throw sessionError;

      toast({
        title: "Entraînement terminé",
        description: "Vos retours ont été enregistrés et seront pris en compte pour votre prochain entraînement.",
      });

      navigate('/workouts');
    } catch (error) {
      console.error('Error completing workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de terminer l'entraînement",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <InitialEnergyDialog
        open={showEnergyDialog}
        onOpenChange={setShowEnergyDialog}
        onEnergyLevel={handleEnergyLevel}
        onRegenerateWorkout={onRegenerateWorkout}
      />

      <Card className="border">
        <div className="p-4 space-y-6">
          <ExerciseSets exercises={exercises} />
        </div>
      </Card>

      <div className="fixed bottom-8 left-0 right-0 px-4">
        <Button 
          variant="destructive"
          onClick={handleEndWorkout}
          className="w-full max-w-2xl mx-auto"
        >
          Terminer l'entraînement
        </Button>
      </div>

      <WorkoutSummaryDialog 
        open={showSummary} 
        onOpenChange={setShowSummary}
        stats={{
          duration: 0,
          totalWeight: 0,
          totalCalories: 0
        }}
        onConfirm={handleConfirmEndWorkout}
      />
    </>
  );
};