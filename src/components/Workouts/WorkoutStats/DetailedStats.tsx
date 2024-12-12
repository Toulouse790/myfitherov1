import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Activity, Dumbbell, Scale, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const DetailedStats = () => {
  const { data: exerciseStats } = useQuery({
    queryKey: ['exercise-stats'],
    queryFn: async () => {
      const { data: stats, error: statsError } = await supabase
        .from('training_stats')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (statsError) throw statsError;

      const totalWeight = stats?.reduce((acc, stat) => acc + (stat.total_weight_lifted || 0), 0) || 0;
      const totalCalories = stats?.reduce((acc, stat) => acc + (stat.session_duration_minutes * 7.5), 0) || 0;

      return {
        stats: stats || [],
        totalWeight,
        totalCalories
      };
    }
  });

  if (!exerciseStats?.stats.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune donnée d'entraînement disponible.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Dumbbell className="w-5 h-5" />
            Volume total
          </h3>
          <div className="text-2xl font-bold">
            {Math.round(exerciseStats.totalWeight).toLocaleString()} kg
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5" />
            Calories brûlées
          </h3>
          <div className="text-2xl font-bold">
            {Math.round(exerciseStats.totalCalories).toLocaleString()} kcal
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
                    {new Date(stat.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{stat.session_duration_minutes}</TableCell>
                  <TableCell>{Math.round(stat.total_weight_lifted || 0)}</TableCell>
                  <TableCell>{Math.round(stat.session_duration_minutes * 7.5)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};