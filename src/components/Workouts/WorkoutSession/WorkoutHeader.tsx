import { Timer, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatWorkoutTime } from "@/utils/time";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface WorkoutHeaderProps {
  sessionId: string;
  estimatedCalories: number;
  progress: number;
}

export const WorkoutHeader = ({ 
  sessionId,
  estimatedCalories,
  progress 
}: WorkoutHeaderProps) => {
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    const fetchSessionStats = async () => {
      if (!sessionId) return;

      const { data: sets } = await supabase
        .from('exercise_sets')
        .select('calories_burned, rest_time_seconds')
        .eq('session_id', sessionId);

      if (sets) {
        // Calculer les calories totales
        const calories = sets.reduce((sum, set) => sum + (set.calories_burned || 0), 0);
        setTotalCalories(calories);

        // Calculer la durée totale basée sur le temps de repos
        const duration = sets.reduce((sum, set) => sum + (set.rest_time_seconds || 0), 0);
        setTotalDuration(duration);
      }
    };

    fetchSessionStats();
    
    // Mettre en place un listener pour les mises à jour
    const channel = supabase
      .channel('exercise_sets_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'exercise_sets',
          filter: `session_id=eq.${sessionId}`
        },
        () => {
          fetchSessionStats();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [sessionId]);

  return (
    <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <div className="container max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Timer className="h-6 w-6 text-primary" />
            <span className="text-xl font-mono">{formatWorkoutTime(totalDuration)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="font-medium">{totalCalories} kcal</span>
          </div>
        </div>
        
        <div className="space-y-2 mt-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>
  );
};