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

  const { data: exerciseStats } = useQuery({
    queryKey: ['exercise-stats'],
    queryFn: async () => {
      const now = new Date();
      const weekStart = startOfWeek(now, { locale: fr });
      const monthStart = startOfMonth(now);
      const yearStart = startOfYear(now);

      // Récupérer d'abord les informations de l'utilisateur pour le calcul des calories
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

      const weightKg = userProfile?.weight_kg || 75; // Valeur par défaut si non disponible
      const gender = (userQuestionnaire?.gender || 'male') as 'male' | 'female';

      const { data: stats, error: statsError } = await supabase
        .from('training_stats')
        .select(`
          *,
          workout_sessions (
            total_weight_lifted,
            session_duration_minutes,
            perceived_difficulty
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (statsError) throw statsError;

      const weeklyStats = stats?.filter(stat => new Date(stat.created_at) >= weekStart);
      const monthlyStats = stats?.filter(stat => new Date(stat.created_at) >= monthStart);
      const yearlyStats = stats?.filter(stat => new Date(stat.created_at) >= yearStart);

      const calculateTotals = (data: any[]) => ({
        weight: data.reduce((acc, stat) => acc + (stat.total_weight_lifted || 0), 0),
        duration: data.reduce((acc, stat) => acc + (stat.session_duration_minutes || 0), 0),
        calories: data.reduce((acc, stat) => {
          const intensity = stat.perceived_difficulty === 'hard' ? 'high' : 
                          stat.perceived_difficulty === 'easy' ? 'low' : 'moderate';
          return acc + calculateExerciseCalories(
            weightKg,
            stat.session_duration_minutes || 0,
            intensity,
            gender
          );
        }, 0)
      });

      return {
        stats: stats?.map(stat => ({
          ...stat,
          calories: calculateExerciseCalories(
            weightKg,
            stat.session_duration_minutes || 0,
            stat.perceived_difficulty === 'hard' ? 'high' : 
            stat.perceived_difficulty === 'easy' ? 'low' : 'moderate',
            gender
          )
        })) || [],
        weekly: calculateTotals(weeklyStats || []),
        monthly: calculateTotals(monthlyStats || []),
        yearly: calculateTotals(yearlyStats || [])
      };
    }
  });

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
        Aucune donnée d'entraînement disponible.
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
              {exerciseStats.stats.map((stat: any) => (
                <TableRow key={stat.id}>
                  <TableCell>
                    {format(new Date(stat.created_at), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>{stat.session_duration_minutes}</TableCell>
                  <TableCell>{Math.round(stat.total_weight_lifted || 0)}</TableCell>
                  <TableCell>{Math.round(stat.calories)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};