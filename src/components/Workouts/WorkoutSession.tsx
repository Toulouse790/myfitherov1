
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
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { WorkoutSummaryDialog } from "./NextWorkoutDetail/WorkoutSummaryDialog";

export const WorkoutSession = () => {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<string[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [startTime] = useState<number>(Date.now());
  const [showSummary, setShowSummary] = useState(false);
  const [workoutStats, setWorkoutStats] = useState({
    duration: 0,
    totalWeight: 0,
    totalCalories: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // État pour suivre la progression de chaque exercice
  const [exerciseProgress, setExerciseProgress] = useState<Record<string, {
    completed: boolean;
    sets: number;
    totalSets: number;
  }>>({});

  // Timer pour la durée de la séance
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setSessionDuration(elapsed);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime]);

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
          .select('exercises, status, created_at')
          .eq('id', sessionId)
          .single();
        
        if (error) {
          debugLogger.error("WorkoutSession", "Erreur lors du chargement de la session:", error);
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
          title: t("common.error") || "Erreur",
          description: t("workouts.unableToLoadSessionDetails") || "Impossible de charger les exercices de la séance",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSessionData();
  }, [sessionId, toast, t]);

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
  
  // Préparation à la fin de l'entraînement
  const handleFinishWorkout = () => {
    const durationMinutes = Math.floor(sessionDuration / 60);
    const totalWeight = Object.values(exerciseProgress).reduce((sum, ex) => sum + (ex.sets * 20), 0);
    const totalCalories = Math.floor(durationMinutes * 9);
    
    setWorkoutStats({
      duration: durationMinutes,
      totalWeight,
      totalCalories
    });
    
    debugLogger.log("WorkoutSession", "Préparation à la finalisation, statistiques calculées:", {
      duration: durationMinutes,
      totalWeight,
      totalCalories
    });
    
    setShowSummary(true);
  };
  
  // Confirmation de fin d'entraînement
  const handleConfirmEnd = async (difficulty: string, duration: number, muscleGroups: string[]) => {
    if (!sessionId || !user) {
      toast({
        title: t("common.error") || "Erreur",
        description: t("workouts.errors.sessionFinalizeDescription") || "Impossible de finaliser la séance",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      debugLogger.log("WorkoutSession", "Finalisation de la session:", {
        sessionId, 
        difficulty, 
        duration,
        muscleGroups,
        totalWeight: workoutStats.totalWeight,
        caloriesBurned: workoutStats.totalCalories
      });
      
      // Mise à jour du statut de la session
      const { error: updateError } = await supabase
        .from('workout_sessions')
        .update({
          status: 'completed',
          total_duration_minutes: duration,
          perceived_difficulty: difficulty,
          calories_burned: workoutStats.totalCalories,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);
      
      if (updateError) {
        debugLogger.error("WorkoutSession", "Erreur lors de la mise à jour du statut:", updateError);
        throw updateError;
      }
      
      // Vérification si des statistiques existent déjà
      const { data: existingStats, error: statsCheckError } = await supabase
        .from('training_stats')
        .select('*')
        .eq('session_id', sessionId)
        .maybeSingle();
      
      if (statsCheckError) {
        debugLogger.error("WorkoutSession", "Erreur lors de la vérification des statistiques:", statsCheckError);
      }
      
      // Préparation des données pour les statistiques
      const statsData = {
        user_id: user.id,
        session_id: sessionId,
        perceived_difficulty: difficulty,
        session_duration_minutes: duration,
        muscle_groups_worked: muscleGroups,
        calories_burned: workoutStats.totalCalories,
        total_weight_lifted: workoutStats.totalWeight,
        created_at: new Date().toISOString()
      };
      
      let statsResult;
      // Si des statistiques existent déjà, les mettre à jour, sinon les créer
      if (existingStats) {
        const { data, error: statsUpdateError } = await supabase
          .from('training_stats')
          .update(statsData)
          .eq('id', existingStats.id)
          .select();
        
        if (statsUpdateError) {
          debugLogger.error("WorkoutSession", "Erreur lors de la mise à jour des statistiques:", statsUpdateError);
          throw statsUpdateError;
        }
        statsResult = data;
      } else {
        const { data, error: statsInsertError } = await supabase
          .from('training_stats')
          .insert(statsData)
          .select();
        
        if (statsInsertError) {
          debugLogger.error("WorkoutSession", "Erreur lors de l'ajout des statistiques:", statsInsertError);
          throw statsInsertError;
        }
        statsResult = data;
      }
      
      debugLogger.log("WorkoutSession", "Session finalisée avec succès, statistiques:", statsResult);
      
      // Mettre à jour le streak de l'utilisateur
      try {
        const { data: streakData, error: streakError } = await supabase
          .from('user_streaks')
          .select('*')
          .eq('user_id', user.id)
          .eq('streak_type', 'workout')
          .single();
        
        if (streakError && streakError.code !== 'PGRST116') {
          // PGRST116 = not found, which is expected if no streak exists yet
          debugLogger.error("WorkoutSession", "Erreur lors de la récupération du streak:", streakError);
        }
        
        const today = new Date().toISOString().split('T')[0];
        
        if (streakData) {
          // Mise à jour du streak existant
          await supabase
            .from('user_streaks')
            .update({
              current_streak: streakData.current_streak + 1,
              last_activity_date: today
            })
            .eq('id', streakData.id);
        } else {
          // Création d'un nouveau streak
          await supabase
            .from('user_streaks')
            .insert({
              user_id: user.id,
              streak_type: 'workout',
              current_streak: 1,
              longest_streak: 1,
              last_activity_date: today
            });
        }
        
        debugLogger.log("WorkoutSession", "Streak mis à jour avec succès");
      } catch (streakUpdateError) {
        debugLogger.error("WorkoutSession", "Erreur lors de la mise à jour du streak:", streakUpdateError);
        // Ne pas bloquer le flux principal si le streak ne se met pas à jour
      }
      
      toast({
        title: t("workouts.sessionCompleted") || "Séance terminée !",
        description: t("workouts.allExercisesCompleted") || "Félicitations! Tous les exercices ont été complétés.",
      });
      
      // Fermer la fenêtre de résumé
      setShowSummary(false);
      
      // Rediriger vers la page des statistiques
      navigate(`/workouts/summary/${sessionId}`);
    } catch (error) {
      debugLogger.error("WorkoutSession", "Erreur lors de la finalisation:", error);
      toast({
        title: t("common.error") || "Erreur",
        description: t("workouts.errors.sessionFinalizeDescription") || "Impossible de finaliser la séance",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{t("workouts.workoutSession")}</h1>
        <div className="text-sm text-muted-foreground">
          {t("workouts.duration")}: {formatTime(sessionDuration)}
        </div>
      </div>
      
      {!showDetail ? (
        <div className="space-y-4">
          <ExerciseList 
            exercises={exercises}
            currentExerciseIndex={currentExerciseIndex}
            exerciseProgress={exerciseProgress}
            onExerciseSelect={handleExerciseSelect}
          />
          
          <div className="flex justify-center">
            <Button 
              onClick={handleFinishWorkout} 
              className="w-full sm:w-auto"
            >
              {t("workouts.finishWorkout")}
            </Button>
          </div>
        </div>
      ) : (
        <ExerciseDetail 
          exerciseName={exercises[currentExerciseIndex]}
          onComplete={handleExerciseComplete}
          onBack={handleBackToList}
          initialSets={exerciseProgress[exercises[currentExerciseIndex]]?.totalSets || 3}
        />
      )}
      
      <WorkoutSummaryDialog
        open={showSummary}
        onOpenChange={setShowSummary}
        stats={workoutStats}
        onConfirm={handleConfirmEnd}
      />
    </div>
  );
};
