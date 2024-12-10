import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export const useAdminStats = () => {
  const { data: monthlyUsers } = useQuery({
    queryKey: ['admin-monthly-users'],
    queryFn: async () => {
      const startDate = startOfMonth(new Date());
      const endDate = endOfMonth(new Date());
      const days = eachDayOfInterval({ start: startDate, end: endDate });

      const { data: signups } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      return days.map(day => ({
        day: format(day, 'EEE', { locale: fr }),
        users: signups?.filter(signup => 
          format(parseISO(signup.created_at), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
        ).length || 0
      }));
    }
  });

  const { data: monthlyWorkouts } = useQuery({
    queryKey: ['admin-monthly-workouts'],
    queryFn: async () => {
      const startDate = startOfMonth(new Date());
      const endDate = endOfMonth(new Date());
      const days = eachDayOfInterval({ start: startDate, end: endDate });

      const { data: workouts } = await supabase
        .from('workout_sessions')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      return days.map(day => ({
        day: format(day, 'EEE', { locale: fr }),
        workouts: workouts?.filter(workout => 
          format(parseISO(workout.created_at), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
        ).length || 0
      }));
    }
  });

  const { data: publishedExercises } = useQuery({
    queryKey: ['admin-published-exercises'],
    queryFn: async () => {
      const startDate = startOfMonth(new Date());
      const endDate = endOfMonth(new Date());
      const days = eachDayOfInterval({ start: startDate, end: endDate });

      const { data: exercises } = await supabase
        .from('unified_exercises')
        .select('created_at')
        .eq('is_published', true)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      return days.map(day => ({
        day: format(day, 'EEE', { locale: fr }),
        exercises: exercises?.filter(exercise => 
          format(parseISO(exercise.created_at), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
        ).length || 0
      }));
    }
  });

  return {
    monthlyUsers,
    monthlyWorkouts,
    publishedExercises
  };
};