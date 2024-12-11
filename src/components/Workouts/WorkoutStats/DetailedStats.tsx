import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Activity, Dumbbell, Scale, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE'];

interface ExerciseSet {
  weight: number;
  reps: number;
  calories_burned: number;
  exercise_name: string;
  session_id: string;
  created_at: string;
}

export const DetailedStats = () => {
  // Récupérer les séries d'exercices
  const { data: exerciseStats } = useQuery({
    queryKey: ['exercise-stats'],
    queryFn: async () => {
      const { data: sets, error: setsError } = await supabase
        .from('exercise_sets')
        .select(`
          weight,
          reps,
          calories_burned,
          exercise_name,
          session_id,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (setsError) throw setsError;

      // Calculer les statistiques
      const totalWeight = (sets || []).reduce((acc: number, set: any) => 
        acc + ((set.weight || 0) * (set.reps || 0)), 0);
      
      const totalCalories = (sets || []).reduce((acc: number, set: any) => 
        acc + (set.calories_burned || 0), 0);

      return {
        sets: sets || [],
        totalWeight,
        totalCalories
      };
    }
  });

  if (!exerciseStats?.sets.length) {
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
            {exerciseStats.totalCalories.toLocaleString()} kcal
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
                <TableHead>Exercice</TableHead>
                <TableHead>Séries</TableHead>
                <TableHead>Répétitions</TableHead>
                <TableHead>Poids</TableHead>
                <TableHead>Calories</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exerciseStats.sets.map((set: ExerciseSet, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(set.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{set.exercise_name}</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>{set.reps}</TableCell>
                  <TableCell>{set.weight} kg</TableCell>
                  <TableCell>{set.calories_burned} kcal</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};