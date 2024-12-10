import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import { useState } from "react";
import { WorkoutSummaryDialog } from "./NextWorkoutDetail/WorkoutSummaryDialog";
import { EndWorkoutButton } from "./NextWorkoutDetail/EndWorkoutButton";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const NextWorkoutDetail = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionId = searchParams.get("session");
  const { exercises, currentExerciseIndex, workoutStarted, duration, handleConfirmEndWorkout } = useWorkoutSession();
  const { toast } = useToast();
  const [showSummary, setShowSummary] = useState(false);

  const handleEndWorkout = () => {
    setShowSummary(true);
  };

  const handleConfirm = (difficulty: string, duration: number, muscleGroups: string[]) => {
    handleConfirmEndWorkout(difficulty, duration, muscleGroups);
  };

  const handleStartTest = async () => {
    // Créer une nouvelle session de test avec des exercices prédéfinis
    const testExercises = ["Pompes", "Squats", "Développé couché"];
    
    try {
      const { data: session, error } = await supabase
        .from('workout_sessions')
        .insert({
          exercises: testExercises,
          type: 'strength',
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;

      // Rediriger vers la nouvelle session
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('session', session.id);
      setSearchParams(newSearchParams);

      toast({
        title: "Session de test créée",
        description: "Vous pouvez maintenant commencer votre entraînement test",
      });
    } catch (error) {
      console.error('Error creating test session:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la session de test",
        variant: "destructive",
      });
    }
  };

  const stats = {
    duration: Math.floor(duration / 60),
    totalWeight: 0,
    totalCalories: Math.round(duration / 60 * 7.5),
  };

  if (!sessionId) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Démarrer un test</h2>
            <p className="text-muted-foreground">
              Cliquez sur le bouton ci-dessous pour commencer une session de test
            </p>
            <Button 
              onClick={handleStartTest}
              size="lg"
              className="w-full sm:w-auto"
            >
              <Timer className="w-5 h-5 mr-2" />
              Commencer le test
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          Session ID: {sessionId}
        </p>
      </Card>

      <EndWorkoutButton 
        workoutStarted={workoutStarted}
        onEndWorkout={handleEndWorkout}
      />

      <WorkoutSummaryDialog
        open={showSummary}
        onOpenChange={setShowSummary}
        stats={stats}
        onConfirm={handleConfirm}
      />
    </div>
  );
};