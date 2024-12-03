import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkoutTimer } from "./WorkoutTimer";
import { ExerciseList } from "./NextWorkoutDetail/ExerciseList";
import { WorkoutHeader } from "./NextWorkoutDetail/WorkoutHeader";
import { StartWorkoutButton } from "./NextWorkoutDetail/StartWorkoutButton";
import { exerciseImages } from "./data/exerciseImages";

const EXERCISES = [
  "Rowing avec Haltères",
  "Tirage à la poulie barre en V",
  "Curl Biceps aux Haltères",
  "Curl Marteau",
  "Développé Militaire",
  "Élévations Latérales",
  "Crunch",
  "Planche"
];

const DEFAULT_SETS = [
  { id: 1, reps: 12, weight: 10 },
  { id: 2, reps: 12, weight: 10 },
  { id: 3, reps: 12, weight: 10 },
];

export const NextWorkoutDetail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);

  const handleExerciseClick = (index: number) => {
    setCurrentExerciseIndex(index);
    navigate(`/workout-exercise/${index}`, { 
      state: { 
        exerciseName: EXERCISES[index],
        sets: DEFAULT_SETS,
        videoUrl: exerciseImages[EXERCISES[index]]
      }
    });
  };

  const startWorkout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: session, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert([
          { 
            user_id: user.id,
            started_at: new Date().toISOString(),
            status: 'in_progress'
          }
        ])
        .select()
        .single();

      if (sessionError) throw sessionError;

      setIsWorkoutStarted(true);
      toast({
        title: "C'est parti !",
        description: "Votre entraînement a commencé. Bon courage !",
      });
    } catch (error) {
      console.error('Error starting workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer l'entraînement",
        variant: "destructive",
      });
    }
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

      <Card className="bg-[#1E2330]">
        <div className="p-6 space-y-6">
          <WorkoutHeader 
            title="Prochain entraînement"
            duration={61}
          />

          <ExerciseList
            exercises={EXERCISES}
            currentExerciseIndex={currentExerciseIndex}
            isWorkoutStarted={isWorkoutStarted}
            onExerciseClick={handleExerciseClick}
          />

          {!isWorkoutStarted && (
            <StartWorkoutButton onStart={startWorkout} />
          )}
        </div>
      </Card>
    </div>
  );
};