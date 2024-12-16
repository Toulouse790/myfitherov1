import { useNavigate } from "react-router-dom";
import { WorkoutCard } from "./WorkoutCard";
import { WorkoutData } from "./types/workout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface WorkoutListProps {
  workouts: WorkoutData[];
}

export const WorkoutList = ({ workouts }: WorkoutListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleWorkoutClick = async (workout: WorkoutData) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer une séance",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Création de la session avec les exercices:", workout.exercises);
      const { data: session, error } = await supabase
        .from('workout_sessions')
        .insert([
          { 
            user_id: user.id,
            type: 'strength', 
            status: 'in_progress',
            exercises: workout.exercises.map(ex => ex.name),
            workout_type: 'strength'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création de la session:', error);
        toast({
          title: "Erreur",
          description: "Impossible de créer la session d'entraînement",
          variant: "destructive",
        });
        return;
      }

      console.log("Session créée avec succès:", session);

      if (session) {
        navigate(`/workouts/exercise/next-workout?session=${session.id}`);
      }
    } catch (error) {
      console.error('Error creating workout session:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la séance",
        variant: "destructive",
      });
    }
  };

  if (workouts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground animate-fade-in">
        Aucune séance ne correspond à vos critères.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
      {workouts.map((workout, index) => (
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