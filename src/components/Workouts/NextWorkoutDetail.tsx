import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, ArrowLeft, Plus, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { exerciseImages } from "./data/exerciseImages";
import { WorkoutTimer } from "./WorkoutTimer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

export const NextWorkoutDetail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);
  const [sets, setSets] = useState<Array<{ id: number; reps: number; weight: number; }>>([
    { id: 1, reps: 12, weight: 10 },
    { id: 2, reps: 12, weight: 10 },
    { id: 3, reps: 12, weight: 10 },
  ]);
  const [notes, setNotes] = useState("");

  const startWorkout = async () => {
    try {
      const { data: session, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert([
          { started_at: new Date().toISOString(), status: 'in_progress' }
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

  const handleExerciseClick = (index: number) => {
    setCurrentExerciseIndex(index);
    navigate(`/workout-exercise/${index}`, { 
      state: { 
        exerciseName: EXERCISES[index],
        sets: sets,
        videoUrl: exerciseImages[EXERCISES[index]]
      }
    });
  };

  const handleAddSet = () => {
    const newSet = {
      id: sets.length + 1,
      reps: sets[0].reps,
      weight: sets[0].weight,
    };
    setSets([...sets, newSet]);
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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Prochain entraînement</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Timer className="w-4 h-4" />
              <span>61 mins</span>
            </div>
          </div>

          <div className="space-y-8">
            {EXERCISES.map((exercise, index) => (
              <div 
                key={index} 
                className={`space-y-4 cursor-pointer transition-all duration-300 ${
                  currentExerciseIndex === index ? 'ring-2 ring-primary rounded-lg p-4' : ''
                }`}
                onClick={() => isWorkoutStarted && handleExerciseClick(index)}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <img 
                    src={exerciseImages[exercise]} 
                    alt={exercise}
                    className="w-full h-full object-cover"
                  />
                  {!isWorkoutStarted && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <p className="text-white text-sm">Démarrez l'entraînement pour accéder à l'exercice</p>
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl font-semibold text-white">{exercise}</h2>
              </div>
            ))}
          </div>

          {!isWorkoutStarted && (
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
              onClick={startWorkout}
            >
              <Play className="w-5 h-5 mr-2" />
              GO
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};