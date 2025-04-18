
import { Button } from "@/components/ui/button";
import { CheckSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface FinishWorkoutButtonProps {
  onCompleteWorkout: () => void;
  sessionId?: string;
  duration?: number;
}

export const FinishWorkoutButton = ({ 
  onCompleteWorkout, 
  sessionId,
  duration = 0 
}: FinishWorkoutButtonProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleFinishWorkout = async () => {
    if (!user || !sessionId) {
      onCompleteWorkout();
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Mettre à jour le statut de la séance
      const { error: sessionError } = await supabase
        .from('workout_sessions')
        .update({ 
          status: 'completed',
          total_duration_minutes: duration,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (sessionError) throw sessionError;

      // 2. Mettre à jour les statistiques utilisateur
      try {
        // Obtenir les données du profil pour les calculs
        const { data: profileData } = await supabase
          .from('profiles')
          .select('experience_level, weight_kg, gender')
          .eq('id', user.id)
          .single();

        // Calculer calories brûlées estimées
        const weight = profileData?.weight_kg || 70;
        const gender = profileData?.gender || 'male';
        const intensity = profileData?.experience_level === 'beginner' ? 'low' : 
                         (profileData?.experience_level === 'advanced' ? 'high' : 'medium');
        
        // Appel à l'API pour calculer les calories
        const { data: apiData } = await supabase.rpc('calculate_exercise_calories', {
          weight_kg: weight,
          duration_minutes: duration,
          intensity: intensity,
          gender: gender
        });

        const caloriesBurned = apiData || Math.round(duration * 7 * (weight/70));

        // Mettre à jour les stats d'entraînement
        await supabase
          .from('training_stats')
          .upsert({
            session_id: sessionId,
            user_id: user.id,
            session_duration_minutes: duration,
            calories_burned: caloriesBurned,
            updated_at: new Date().toISOString()
          });
        
      } catch (statsError) {
        console.error("Erreur lors de la mise à jour des statistiques:", statsError);
        // On continue même si cette partie échoue
      }

      // 3. Mettre à jour les streaks d'entraînement
      try {
        const { data: streakData } = await supabase
          .from('user_streaks')
          .select('*')
          .eq('user_id', user.id)
          .eq('streak_type', 'workout')
          .single();

        if (streakData) {
          const today = new Date().toISOString().split('T')[0];
          const lastActivity = streakData.last_activity_date ? 
                              new Date(streakData.last_activity_date).toISOString().split('T')[0] : null;
          
          // Vérifier si on a déjà enregistré un entraînement aujourd'hui
          if (lastActivity !== today) {
            const yesterdayDate = new Date();
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            const yesterday = yesterdayDate.toISOString().split('T')[0];
            
            // Incrémentation du streak si c'est un nouveau jour et que le dernier entraînement 
            // était hier ou c'est le premier entraînement
            const isConsecutive = lastActivity === yesterday || !lastActivity;
            const newStreak = isConsecutive ? (streakData.current_streak || 0) + 1 : 1;
            const longestStreak = Math.max(newStreak, streakData.longest_streak || 0);
            
            await supabase
              .from('user_streaks')
              .update({
                current_streak: newStreak,
                longest_streak: longestStreak,
                last_activity_date: today
              })
              .eq('id', streakData.id);
          }
        } else {
          // Créer le premier streak
          await supabase
            .from('user_streaks')
            .insert({
              user_id: user.id,
              streak_type: 'workout',
              current_streak: 1,
              longest_streak: 1,
              last_activity_date: new Date().toISOString().split('T')[0]
            });
        }
      } catch (streakError) {
        console.error("Erreur lors de la mise à jour des streaks:", streakError);
        // On continue même si cette partie échoue
      }

      toast({
        title: t("workouts.completed") || "Entraînement terminé",
        description: t("workouts.sessionSaved") || "Votre séance a été enregistrée avec succès",
      });

      onCompleteWorkout();
    } catch (error) {
      console.error("Erreur lors de la finalisation de l'entraînement:", error);
      toast({
        title: t("common.error") || "Erreur",
        description: t("workouts.savingError") || "Erreur lors de l'enregistrement de la séance",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={handleFinishWorkout}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <span className="flex items-center">
          <span className="h-4 w-4 mr-2 border-2 border-current border-t-transparent animate-spin rounded-full" />
          {t("common.saving") || "Enregistrement..."}
        </span>
      ) : (
        <>
          <CheckSquare className="mr-2 h-5 w-5" />
          {t("workouts.finishWorkout") || "Terminer l'entraînement"}
        </>
      )}
    </Button>
  );
};
