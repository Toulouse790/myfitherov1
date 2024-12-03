import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Timer } from "lucide-react";
import { WorkoutTimer } from "./WorkoutTimer";
import { ExerciseList } from "./NextWorkoutDetail/ExerciseList";
import { MetricComparison } from "./NextWorkoutDetail/MetricComparison";
import { supabase } from "@/integrations/supabase/client";

const SAMPLE_EXERCISES = [
  "Rowing avec Haltères",
  "Tirage à la poulie barre en V",
  "Curl Biceps aux Haltères",
  "Développé Militaire"
];

export const NextWorkoutDetail = () => {
  const navigate = useNavigate();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);

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

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </Button>

      {isWorkoutStarted && <WorkoutTimer />}

      <Card className="p-6 space-y-6 bg-[#1E2330]">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Dos, Biceps, Épaules</h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Timer className="w-4 h-4" />
            <span>61 mins</span>
          </div>
        </div>

        {!isWorkoutStarted && (
          <Button 
            className="w-full"
            onClick={handleStartWorkout}
          >
            Commencer l'entraînement
          </Button>
        )}

        <div className="grid gap-4">
          <MetricComparison
            planned={8}
            actual={currentExerciseIndex !== null ? currentExerciseIndex + 1 : 0}
            unit="exercices"
            icon={Timer}
            label="Progression"
          />
        </div>

        <ExerciseList
          exercises={SAMPLE_EXERCISES}
          currentExerciseIndex={currentExerciseIndex}
          isWorkoutStarted={isWorkoutStarted}
          onExerciseClick={handleExerciseClick}
        />
      </Card>
    </div>
  );
};