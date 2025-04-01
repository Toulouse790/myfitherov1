
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronLeft, ChevronRight, Loader2, Timer } from "lucide-react";
import { ExerciseItem } from "./ExerciseItem";
import { ExerciseDetail } from "./ExerciseDetail";

export const CleanWorkoutSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [exercises, setExercises] = useState<string[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showExerciseDetail, setShowExerciseDetail] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [startTime] = useState(Date.now());
  
  // État pour suivre la progression de chaque exercice
  const [exerciseProgress, setExerciseProgress] = useState<Record<string, {
    completed: boolean;
    sets: number;
    totalSets: number;
  }>>({});

  // Timer pour la durée de séance
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime]);

  // Formatage de la durée
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Charger les exercices de la séance d'entraînement
  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('exercises')
          .eq('id', sessionId)
          .single();
        
        if (error) throw error;
        
        if (data?.exercises) {
          // Initialiser la progression pour chaque exercice
          const progress: Record<string, { completed: boolean; sets: number; totalSets: number }> = {};
          data.exercises.forEach((exercise: string) => {
            progress[exercise] = {
              completed: false,
              sets: 0,
              totalSets: 3, // Par défaut 3 séries
            };
          });
          
          setExercises(data.exercises);
          setExerciseProgress(progress);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la séance:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les exercices de la séance",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSessionData();
  }, [sessionId, toast]);

  // Gestion du changement d'exercice actuel
  const handleExerciseSelect = (index: number) => {
    setCurrentExerciseIndex(index);
    setShowExerciseDetail(true);
  };

  // Gestion de la complétion d'un exercice
  const handleExerciseComplete = (exerciseName: string, totalSets: number) => {
    setExerciseProgress(prev => ({
      ...prev,
      [exerciseName]: {
        ...prev[exerciseName],
        completed: true,
        sets: totalSets,
        totalSets
      }
    }));
    
    setShowExerciseDetail(false);
    
    // Passer automatiquement à l'exercice suivant si ce n'est pas le dernier
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  // Terminer la séance
  const handleFinishWorkout = async () => {
    if (!sessionId) return;
    
    try {
      // Calculer les statistiques de la séance
      const durationMinutes = Math.ceil(sessionDuration / 60);
      const caloriesBurned = Math.round(durationMinutes * 10);
      
      await supabase
        .from('workout_sessions')
        .update({
          status: 'completed',
          total_duration_minutes: durationMinutes,
          calories_burned: caloriesBurned,
          perceived_difficulty: 'moderate',
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      toast({
        title: "Séance terminée",
        description: `Durée: ${durationMinutes} min, Calories: ${caloriesBurned}`,
      });
      
      navigate('/workouts');
    } catch (error) {
      console.error('Erreur lors de la finalisation de la séance:', error);
      toast({
        title: "Erreur",
        description: "Impossible de finaliser la séance",
        variant: "destructive",
      });
    }
  };

  // Calculer la progression globale
  const completedExercises = Object.values(exerciseProgress).filter(ex => ex.completed).length;
  const progress = exercises.length > 0 ? (completedExercises / exercises.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto px-4 pt-12 pb-20 space-y-6">
      {/* En-tête avec durée et progression */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/workouts')}
          >
            <ChevronLeft />
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-semibold">Séance d'entraînement</h2>
            <div className="text-sm text-muted-foreground">
              {formatDuration(sessionDuration)}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleFinishWorkout}
          >
            <Check />
          </Button>
        </div>
        
        <Progress value={progress} className="h-2" />
        <div className="mt-2 text-xs text-right text-muted-foreground">
          {completedExercises}/{exercises.length} exercices
        </div>
      </div>

      {!showExerciseDetail ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Exercices</h3>
          
          {exercises.map((exercise, index) => (
            <ExerciseItem
              key={index}
              exerciseName={exercise}
              isCompleted={exerciseProgress[exercise]?.completed || false}
              isCurrent={index === currentExerciseIndex}
              onClick={() => handleExerciseSelect(index)}
            />
          ))}
          
          <Button 
            className="w-full mt-6" 
            onClick={handleFinishWorkout}
          >
            <Timer className="mr-2 h-4 w-4" />
            Terminer la séance
          </Button>
        </div>
      ) : (
        <ExerciseDetail
          exerciseName={exercises[currentExerciseIndex]}
          onComplete={handleExerciseComplete}
          onBack={() => setShowExerciseDetail(false)}
          initialSets={3}
        />
      )}
      
      {/* Navigation entre exercices */}
      {!showExerciseDetail && exercises.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center space-x-4 p-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentExerciseIndex(prev => Math.max(0, prev - 1))}
            disabled={currentExerciseIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="flex items-center px-4 font-medium">
            {currentExerciseIndex + 1} / {exercises.length}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentExerciseIndex(prev => Math.min(exercises.length - 1, prev + 1))}
            disabled={currentExerciseIndex === exercises.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
