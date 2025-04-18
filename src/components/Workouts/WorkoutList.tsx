
import { useNavigate } from "react-router-dom";
import { WorkoutCard } from "./WorkoutCard";
import { WorkoutData } from "./types/workout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";

interface WorkoutListProps {
  workouts: WorkoutData[];
}

export const WorkoutList = ({ workouts }: WorkoutListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();

  const uniqueWorkouts = Array.from(
    new Map(workouts.map(workout => [workout.id, workout])).values()
  );

  const handleWorkoutClick = async (workout: WorkoutData) => {
    if (!user) {
      toast({
        title: t("common.error"),
        description: t("workouts.errors.loginRequired"),
        variant: "destructive",
      });
      return;
    }

    try {
      debugLogger.log("WorkoutList", "Récupération du profil utilisateur");
      const { data: profile } = await supabase
        .from('profiles')
        .select('experience_level, main_objective')
        .eq('id', user.id)
        .single();

      // Récupérer les exercices adaptés au niveau et à l'objectif de l'utilisateur
      const { data: recommendedExercises } = await supabase
        .from('unified_exercises')
        .select('*')
        .in('difficulty', profile?.experience_level === 'beginner' ? ['beginner'] : ['beginner', 'intermediate'])
        .in('muscle_group', workout.muscleGroups)
        .eq('est_publié', true)
        .limit(6);

      const exercisesToUse = recommendedExercises?.map(ex => ({
        name: ex.name,
        sets: profile?.experience_level === 'beginner' ? 3 : 4,
        reps: profile?.experience_level === 'beginner' ? 12 : 10,
        rest: profile?.experience_level === 'beginner' ? 90 : 60,
        weight: 0,
        notes: "",
      })) || workout.exercises;

      debugLogger.log("WorkoutList", "Création de la session avec les exercices recommandés:", exercisesToUse);
      
      const { data: session, error } = await supabase
        .from('workout_sessions')
        .insert([
          { 
            user_id: user.id,
            type: 'strength', 
            status: 'in_progress',
            exercises: exercisesToUse.map(ex => ex.name),
            workout_type: 'strength',
            exercise_progress: exercisesToUse.reduce((acc, ex) => ({
              ...acc,
              [ex.name]: {
                completed: false,
                sets: ex.sets,
                reps: ex.reps,
                rest: ex.rest,
                currentSet: 0
              }
            }), {})
          }
        ])
        .select()
        .single();

      if (error) {
        debugLogger.error('WorkoutList', 'Erreur lors de la création de la session:', error);
        toast({
          title: t("common.error"),
          description: t("workouts.errors.sessionCreationFailed"),
          variant: "destructive",
        });
        return;
      }

      debugLogger.log("WorkoutList", "Session créée avec succès:", session);

      if (session) {
        navigate(`/workouts/session/${session.id}`);
      }
    } catch (error) {
      debugLogger.error('WorkoutList', 'Error creating workout session:', error);
      toast({
        title: t("common.error"),
        description: t("workouts.errors.sessionCreationError"),
        variant: "destructive",
      });
    }
  };

  if (uniqueWorkouts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground animate-fade-in">
        {t("workouts.noMatchingWorkouts")}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
      {uniqueWorkouts.map((workout, index) => (
        <div
          key={workout.id}
          className="opacity-0 animate-fade-in cursor-pointer"
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'forwards'
          }}
          onClick={() => handleWorkoutClick(workout)}
        >
          <WorkoutCard workout={{
            title: workout.title,
            muscleGroup: Array.isArray(workout.muscleGroups) && workout.muscleGroups.length > 0 
              ? workout.muscleGroups[0] 
              : "",
            exercises: workout.exercises.map(ex => ({
              name: ex.name,
              sets: ex.sets,
              reps: ex.reps,
              calories: ex.calories
            })),
            totalCalories: workout.exercises.reduce((acc, ex) => acc + ex.calories, 0)
          }} />
        </div>
      ))}
    </div>
  );
};
