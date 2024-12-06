import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExerciseSets } from "../ExerciseSets";
import { InitialEnergyDialog } from "./InitialEnergyDialog";
import { WorkoutSummaryDialog } from "./WorkoutSummaryDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
  console.log("WorkoutInProgress - Exercises:", exercises);
  console.log("WorkoutInProgress - Session ID:", sessionId);

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
      toast({
        title: "Niveau d'énergie enregistré",
        description: "Votre niveau d'énergie a été pris en compte pour cet entraînement.",
      });
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
      const { error: statsError } = await supabase
        .from('training_stats')
        .insert([{
          session_id: sessionId,
          perceived_difficulty: difficulty,
          duration_minutes: 0,
          total_sets: 0,
          total_reps: 0,
          total_weight: 0
        }]);

      if (statsError) throw statsError;

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

  if (!exercises || exercises.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Aucun exercice n'a été sélectionné pour cette séance.
        </p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/workouts')}
          className="mt-4"
        >
          Retour aux entraînements
        </Button>
      </div>
    );
  }

  return (
    <>
      <InitialEnergyDialog
        open={showEnergyDialog}
        onOpenChange={setShowEnergyDialog}
        onEnergyLevel={handleEnergyLevel}
        onRegenerateWorkout={onRegenerateWorkout}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border shadow-lg">
          <div className="p-6 space-y-6">
            <ExerciseSets exercises={exercises} />
          </div>
        </Card>
      </motion.div>

      <motion.div 
        className="fixed bottom-8 left-0 right-0 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button 
          variant="destructive"
          onClick={handleEndWorkout}
          className="w-full max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow"
        >
          Terminer l'entraînement
        </Button>
      </motion.div>

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
