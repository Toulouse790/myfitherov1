import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WorkoutTimer } from "./WorkoutTimer";
import { ExerciseList } from "./NextWorkoutDetail/ExerciseList";
import { supabase } from "@/integrations/supabase/client";
import { WorkoutSummaryDialog } from "./NextWorkoutDetail/WorkoutSummaryDialog";
import { ExerciseSets } from "./ExerciseSets";
import { useToast } from "@/hooks/use-toast";
import { Dumbbell, Timer, Flame } from "lucide-react";

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

  const confirmEndWorkout = () => {
    toast({
      title: "Entraînement terminé",
      description: "Votre séance a été enregistrée avec succès.",
    });
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Dos, Biceps & Épaules</h1>
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Timer className="w-5 h-5" />
              <span>61 mins</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Dumbbell className="w-5 h-5" />
              <span>8 exercices</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Flame className="w-5 h-5" />
              <span>~350 kcal</span>
            </div>
          </div>
        </div>

        {!isWorkoutStarted ? (
          <div className="space-y-8">
            <Card className="bg-white border p-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Exercices prévus</h2>
                <div className="grid gap-4">
                  {SAMPLE_EXERCISES.map((exercise, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Dumbbell className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{exercise}</h3>
                          <p className="text-sm text-gray-600">3 séries • 12 répétitions</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            
            <div className="flex justify-center">
              <Button 
                className="w-64 bg-gradient-to-r from-primary to-secondary hover:scale-105 transform transition-all duration-300 text-white font-bold py-6 text-xl rounded-full shadow-lg hover:shadow-xl"
                onClick={handleStartWorkout}
              >
                🔥 C'EST PARTI ! 💪
              </Button>
            </div>
          </div>
        ) : (
          <Card className="bg-white border">
            <div className="p-4 space-y-6">
              {currentExerciseIndex !== null && (
                <ExerciseSets
                  exerciseName={SAMPLE_EXERCISES[currentExerciseIndex]}
                />
              )}
              <ExerciseList
                exercises={SAMPLE_EXERCISES}
                currentExerciseIndex={currentExerciseIndex}
                isWorkoutStarted={isWorkoutStarted}
                onExerciseClick={handleExerciseClick}
              />
            </div>
          </Card>
        )}

        {isWorkoutStarted && (
          <div className="fixed bottom-8 left-0 right-0 px-4">
            <Button 
              variant="destructive"
              onClick={handleEndWorkout}
              className="w-full max-w-2xl mx-auto"
            >
              Terminer l'entraînement
            </Button>
          </div>
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