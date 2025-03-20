
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Activity, Dumbbell, Scale, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, startOfWeek, startOfMonth, startOfYear } from "date-fns";
import { fr } from "date-fns/locale";
import { calculateExerciseCalories } from "@/utils/calorieCalculation";
import { useAuth } from "@/hooks/use-auth";

export const DetailedStats = () => {
  const { user } = useAuth();

  const { data: exerciseStats, isLoading, error } = useQuery({
    queryKey: ['exercise-stats'],
    queryFn: async () => {
      if (!user?.id) {
        console.log("No user found");
        return { stats: [], weekly: { weight: 0, duration: 0, calories: 0 }, 
                 monthly: { weight: 0, duration: 0, calories: 0 }, 
                 yearly: { weight: 0, duration: 0, calories: 0 } };
      }

      const now = new Date();
      const weekStart = startOfWeek(now, { locale: fr });
      const monthStart = startOfMonth(now);
      const yearStart = startOfYear(now);

      // Récupérer le poids de l'utilisateur pour le calcul des calories
      const { data: userProfile } = await supabase
        .from('muscle_measurements')
        .select('weight_kg')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { data: userQuestionnaire } = await supabase
        .from('questionnaire_responses')
        .select('gender')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const weightKg = userProfile?.weight_kg || 75;
      const gender = (userQuestionnaire?.gender || 'male') as 'male' | 'female';

      console.log(`User weight: ${weightKg}kg, gender: ${gender}`);

      // Récupérer les statistiques d'entraînement
      const { data: stats, error: statsError } = await supabase
        .from('training_stats')
        .select(`
          *,
          workout_sessions (
            session_duration_minutes,
            perceived_difficulty
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (statsError) {
        console.error("Error fetching training stats:", statsError);
        throw statsError;
      }

      console.log(`Found ${stats?.length || 0} training stats`);

      const weeklyStats = stats?.filter(stat => new Date(stat.created_at) >= weekStart) || [];
      const monthlyStats = stats?.filter(stat => new Date(stat.created_at) >= monthStart) || [];
      const yearlyStats = stats?.filter(stat => new Date(stat.created_at) >= yearStart) || [];

      const calculateTotals = (data: any[]) => {
        const totalWeight = data.reduce((acc, stat) => acc + (stat.total_weight_lifted || 0), 0);
        const totalDuration = data.reduce((acc, stat) => {
          const sessionDuration = stat.workout_sessions?.session_duration_minutes || 0;
          return acc + sessionDuration;
        }, 0);

        const totalCalories = data.reduce((acc, stat) => {
          const intensity = stat.workout_sessions?.perceived_difficulty === 'hard' ? 'high' : 
                          stat.workout_sessions?.perceived_difficulty === 'easy' ? 'low' : 'moderate';
          const duration = stat.workout_sessions?.session_duration_minutes || 0;
          const calories = calculateExerciseCalories(
            weightKg,
            duration,
            intensity,
            gender
          );
          return acc + calories;
        }, 0);

        return { weight: totalWeight, duration: totalDuration, calories: totalCalories };
      };

      return {
        stats: stats?.map(stat => {
          const intensity = stat.workout_sessions?.perceived_difficulty === 'hard' ? 'high' : 
                        stat.workout_sessions?.perceived_difficulty === 'easy' ? 'low' : 'moderate';
          const duration = stat.workout_sessions?.session_duration_minutes || 0;
          return {
            ...stat,
            session_duration_minutes: duration,
            calories: calculateExerciseCalories(
              weightKg,
              duration,
              intensity,
              gender
            )
          };
        }) || [],
        weekly: calculateTotals(weeklyStats),
        monthly: calculateTotals(monthlyStats),
        yearly: calculateTotals(yearlyStats)
      };
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="bg-muted-foreground/20 h-5 w-32 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="bg-muted-foreground/20 h-8 w-24 rounded"></div>
                <div className="bg-muted-foreground/20 h-4 w-40 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error in DetailedStats:", error);
    return (
      <div className="text-center py-8 text-destructive">
        Une erreur est survenue lors du chargement des statistiques d'entraînement.
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Connectez-vous pour voir vos statistiques d'entraînement.
      </div>
    );
  }

  if (!exerciseStats?.stats.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune donnée d'entraînement disponible. Commencez à vous entraîner pour voir vos statistiques!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Dumbbell className="w-5 h-5" />
            Cette semaine
          </h3>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {Math.round(exerciseStats.weekly.weight).toLocaleString()} kg
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Flame className="w-4 h-4" />
              {Math.round(exerciseStats.weekly.calories).toLocaleString()} kcal
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Ce mois
          </h3>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {Math.round(exerciseStats.monthly.weight).toLocaleString()} kg
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Flame className="w-4 h-4" />
              {Math.round(exerciseStats.monthly.calories).toLocaleString()} kcal
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5" />
            Cette année
          </h3>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {Math.round(exerciseStats.yearly.weight).toLocaleString()} kg
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Flame className="w-4 h-4" />
              {Math.round(exerciseStats.yearly.calories).toLocaleString()} kcal
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Historique des séances</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Durée (min)</TableHead>
                <TableHead>Poids total (kg)</TableHead>
                <TableHead>Calories</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exerciseStats.stats.slice(0, 10).map((stat: any) => (
                <TableRow key={stat.id}>
                  <TableCell>
                    {format(new Date(stat.created_at), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>{stat.session_duration_minutes || 0}</TableCell>
                  <TableCell>{Math.round(stat.total_weight_lifted || 0)}</TableCell>
                  <TableCell>{Math.round(stat.calories || 0)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default DetailedStats;
