import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExerciseSets } from "../ExerciseSets";
import { useState, useEffect } from "react";
import { InitialEnergyDialog } from "./InitialEnergyDialog";
import { WorkoutSummaryDialog } from "./WorkoutSummaryDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface WorkoutInProgressProps {
  exercises: string[];
  currentExerciseIndex: number | null;
  onExerciseClick: (index: number) => void;
  sessionId?: string;
}

export const WorkoutInProgress = ({
  exercises,
  currentExerciseIndex,
  onExerciseClick,
  sessionId,
}: WorkoutInProgressProps) => {
  const [showEnergyDialog, setShowEnergyDialog] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEnergyLevel = async (level: "good" | "bad") => {
    if (!sessionId) return;

    const { error } = await supabase
      .from('workout_sessions')
      .update({ initial_energy_level: level })
      .eq('id', sessionId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre niveau d'énergie",
        variant: "destructive",
      });
    }
  };

  const handleRegenerateWorkout = () => {
    navigate('/dashboard');
  };

  const handleEndWorkout = async (difficulty: "easy" | "medium" | "hard") => {
    if (!sessionId) return;

    try {
      // Mettre à jour les statistiques d'entraînement
      const { error: statsError } = await supabase
        .from('training_stats')
        .update({ perceived_difficulty: difficulty })
        .eq('session_id', sessionId);

      if (statsError) throw statsError;

      // Mettre à jour le statut de la session
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
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer vos retours",
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
        onRegenerateWorkout={handleRegenerateWorkout}
      />

      <Card className="border">
        <div className="p-4 space-y-6">
          <ExerciseSets exercises={exercises} />
        </div>
      </Card>

      <div className="fixed bottom-8 left-0 right-0 px-4">
        <Button 
          variant="destructive"
          onClick={() => setShowSummary(true)}
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
        onConfirm={handleEndWorkout}
      />
    </>
  );
};