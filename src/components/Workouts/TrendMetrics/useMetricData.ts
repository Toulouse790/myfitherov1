
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { debugLogger } from "@/utils/debug-logger";

export const useMetricData = (days: number) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['trend-metrics', days, user?.id],
    queryFn: async () => {
      if (!user?.id) {
        debugLogger.log("useMetricData", "No user found for metric data");
        return {
          daily: [],
          weekly: [],
          monthly: []
        };
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);
      
      debugLogger.log("useMetricData", `Fetching metrics from ${startDate.toISOString()} to ${endDate.toISOString()}`);

      // Récupérer les statistiques d'entraînement
      const { data, error } = await supabase
        .from('training_stats')
        .select('*, workout_sessions(total_duration_minutes, total_weight_lifted)')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        debugLogger.error("useMetricData", "Error fetching metric data:", error);
        throw error;
      }

      debugLogger.log("useMetricData", `Found ${data?.length || 0} training stats records`);

      // Si aucune donnée n'est trouvée, essayons de récupérer directement les sessions d'entraînement
      if (!data || data.length === 0) {
        const { data: sessionData, error: sessionError } = await supabase
          .from('workout_sessions')
          .select('*, created_at, total_duration_minutes, total_weight_lifted')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
          .order('created_at', { ascending: false });

        if (sessionError) {
          debugLogger.error("useMetricData", "Error fetching workout sessions:", sessionError);
          throw sessionError;
        }

        // Formater les données pour l'affichage quotidien
        const dailyData = (sessionData || []).map(session => {
          const date = new Date(session.created_at);
          return {
            date: date.toLocaleDateString(),
            value: session.total_weight_lifted || 0
          };
        });

        // Agréger les données par semaine
        const weekMap = new Map();
        (sessionData || []).forEach(session => {
          const date = new Date(session.created_at);
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay()); // Début de la semaine (dimanche)
          const weekKey = weekStart.toISOString().split('T')[0];
          
          if (!weekMap.has(weekKey)) {
            weekMap.set(weekKey, { value: 0, count: 0 });
          }
          
          const entry = weekMap.get(weekKey);
          entry.value += (session.total_weight_lifted || 0);
          entry.count += 1;
        });

        const weeklyData = Array.from(weekMap.entries()).map(([date, data]) => ({
          date: `S-${new Date(date).getDate()}/${new Date(date).getMonth() + 1}`,
          value: data.value
        }));

        // Agréger les données par mois
        const monthMap = new Map();
        (sessionData || []).forEach(session => {
          const date = new Date(session.created_at);
          const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          
          if (!monthMap.has(monthKey)) {
            monthMap.set(monthKey, { value: 0, count: 0 });
          }
          
          const entry = monthMap.get(monthKey);
          entry.value += (session.total_weight_lifted || 0);
          entry.count += 1;
        });

        const monthlyData = Array.from(monthMap.entries()).map(([monthKey, data]) => {
          const [year, month] = monthKey.split('-');
          return {
            date: `M-${month}`,
            value: data.value
          };
        });

        return {
          daily: dailyData,
          weekly: weeklyData,
          monthly: monthlyData
        };
      }

      // Formater les données pour l'affichage quotidien
      const dailyData = data.map(stat => {
        const date = new Date(stat.created_at);
        return {
          date: date.toLocaleDateString(),
          value: stat.total_weight_lifted || 0
        };
      });

      // Agréger les données par semaine
      const weekMap = new Map();
      data.forEach(stat => {
        const date = new Date(stat.created_at);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Début de la semaine (dimanche)
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weekMap.has(weekKey)) {
          weekMap.set(weekKey, { value: 0, count: 0 });
        }
        
        const entry = weekMap.get(weekKey);
        entry.value += (stat.total_weight_lifted || 0);
        entry.count += 1;
      });

      const weeklyData = Array.from(weekMap.entries()).map(([date, data]) => ({
        date: `S-${new Date(date).getDate()}/${new Date(date).getMonth() + 1}`,
        value: data.value
      }));

      // Agréger les données par mois
      const monthMap = new Map();
      data.forEach(stat => {
        const date = new Date(stat.created_at);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (!monthMap.has(monthKey)) {
          monthMap.set(monthKey, { value: 0, count: 0 });
        }
        
        const entry = monthMap.get(monthKey);
        entry.value += (stat.total_weight_lifted || 0);
        entry.count += 1;
      });

      const monthlyData = Array.from(monthMap.entries()).map(([monthKey, data]) => {
        const [year, month] = monthKey.split('-');
        return {
          date: `M-${month}`,
          value: data.value
        };
      });

      return {
        daily: dailyData,
        weekly: weeklyData,
        monthly: monthlyData
      };
    },
    enabled: !!user?.id
  });
};
