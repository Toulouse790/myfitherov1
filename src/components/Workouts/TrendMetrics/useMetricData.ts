import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMetricData = (days: number) => {
  return useQuery({
    queryKey: ['trend-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_stats')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(days);

      if (error) throw error;

      const dailyData = data.map(stat => ({
        date: new Date(stat.created_at).toLocaleDateString(),
        value: stat.total_sets
      }));

      const weeklyData = Array.from({ length: 4 }, (_, i) => ({
        date: `S-${3-i}`,
        value: Math.floor(Math.random() * 400)
      }));

      const monthlyData = Array.from({ length: 6 }, (_, i) => ({
        date: `M-${5-i}`,
        value: Math.floor(Math.random() * 1200)
      }));

      return {
        daily: dailyData,
        weekly: weeklyData,
        monthly: monthlyData
      };
    }
  });
};