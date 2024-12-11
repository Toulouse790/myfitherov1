import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Activity, Dumbbell, Scale, Flame } from "lucide-react";

const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE'];

export const DetailedStats = () => {
  const { data: exerciseStats } = useQuery({
    queryKey: ['exercise-stats'],
    queryFn: async () => {
      // Récupérer les statistiques d'exercices
      const { data: sets, error: setsError } = await supabase
        .from('exercise_sets')
        .select(`
          weight,
          reps,
          calories_burned,
          exercise_name,
          session_id,
          workout_sessions (
            muscle_groups_worked
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (setsError) throw setsError;

      // Récupérer les mesures de poids
      const { data: measurements, error: measurementsError } = await supabase
        .from('muscle_measurements')
        .select('weight_kg, measurement_date')
        .order('measurement_date', { ascending: true })
        .limit(10);

      if (measurementsError) throw measurementsError;

      // Calculer les statistiques
      const totalWeight = sets?.reduce((acc, set) => acc + (set.weight * set.reps), 0) || 0;
      const totalCalories = sets?.reduce((acc, set) => acc + (set.calories_burned || 0), 0) || 0;

      // Grouper par groupe musculaire
      const muscleGroups = sets?.reduce((acc: any, set) => {
        const groups = set.workout_sessions?.muscle_groups_worked || [];
        groups.forEach((group: string) => {
          acc[group] = (acc[group] || 0) + 1;
        });
        return acc;
      }, {});

      const muscleGroupData = Object.entries(muscleGroups || {}).map(([name, value]) => ({
        name,
        value
      }));

      // Préparer les données de poids
      const weightData = measurements?.map(m => ({
        date: new Date(m.measurement_date).toLocaleDateString(),
        weight: m.weight_kg
      })) || [];

      return {
        totalWeight,
        totalCalories,
        muscleGroupData,
        weightData
      };
    }
  });

  if (!exerciseStats) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Statistiques générales */}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Répartition des groupes musculaires */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Groupes musculaires travaillés</h3>
          <div className="w-full h-[300px] flex justify-center">
            <PieChart width={300} height={300}>
              <Pie
                data={exerciseStats.muscleGroupData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {exerciseStats.muscleGroupData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </Card>

        {/* Évolution du poids */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5" />
            Évolution du poids
          </h3>
          <div className="w-full h-[300px]">
            <BarChart
              width={400}
              height={300}
              data={exerciseStats.weightData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="weight" fill="#8884d8" />
            </BarChart>
          </div>
        </Card>
      </div>
    </div>
  );
};