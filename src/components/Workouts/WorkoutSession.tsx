
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExerciseList } from "./WorkoutSession/ExerciseList";
import { ExerciseDetail } from "./WorkoutSession/ExerciseDetail";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { debugLogger } from "@/utils/debug-logger";

export const WorkoutSession = () => {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<string[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // État pour suivre la progression de chaque exercice
  const [exerciseProgress, setExerciseProgress] = useState<Record<string, {
    completed: boolean;
    sets: number;
    totalSets: number;
  }>>({});

  // Charger les exercices de la séance d'entraînement
  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) {
        debugLogger.log("WorkoutSession", "ID de session manquant, impossible de charger les données", {});
        return;
      }
      
      debugLogger.log("WorkoutSession", "Chargement des données de la session:", sessionId);
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('exercises')
          .eq('id', sessionId)
          .single();
        
        if (error) {
          debugLogger.log("WorkoutSession", "Erreur lors du chargement de la session:", error);
          throw error;
        }
        
        debugLogger.log("WorkoutSession", "Données de session chargées:", data);
        
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
    setShowDetail(true);
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
    
    setShowDetail(false);
    
    // Passer automatiquement à l'exercice suivant si ce n'est pas le dernier
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  // Retour à la liste des exercices
  const handleBackToList = () => {
    setShowDetail(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {!showDetail ? (
        <ExerciseList 
          exercises={exercises}
          currentExerciseIndex={currentExerciseIndex}
          exerciseProgress={exerciseProgress}
          onExerciseSelect={handleExerciseSelect}
        />
      ) : (
        <ExerciseDetail 
          exerciseName={exercises[currentExerciseIndex]}
          onComplete={handleExerciseComplete}
          onBack={handleBackToList}
          initialSets={exerciseProgress[exercises[currentExerciseIndex]]?.totalSets || 3}
        />
      )}
    </div>
  );
};
