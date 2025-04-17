
import { Card } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity, Dumbbell, Scale, Flame, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, startOfWeek, startOfMonth, startOfYear, addMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { calculateExerciseCalories } from "@/utils/calorieCalculation";
import { useAuth } from "@/hooks/use-auth";
import { debugLogger } from "@/utils/debug-logger";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const DetailedStats = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // État pour suivre le temps écoulé depuis le dernier chargement
  const [lastLoadTime, setLastLoadTime] = useState<Date | null>(null);

  useEffect(() => {
    // Mettre à jour lastLoadTime lorsque le composant est monté
    setLastLoadTime(new Date());
    
    // Invalidation périodique des données pour assurer leur fraîcheur
    const refreshInterval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['exercise-stats'] });
      setLastLoadTime(new Date());
    }, 5 * 60 * 1000); // Rafraîchir toutes les 5 minutes
    
    return () => clearInterval(refreshInterval);
  }, [queryClient]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Invalidation de la requête et des autres données associées
    queryClient.invalidateQueries({ queryKey: ['exercise-stats'] });
    queryClient.invalidateQueries({ queryKey: ['workout-sessions'] });
    queryClient.invalidateQueries({ queryKey: ['training-stats'] });
    setLastLoadTime(new Date());
    
    // Afficher un toast pour confirmer le rafraîchissement
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Statistiques rafraîchies",
        description: "Les données ont été rechargées avec succès",
      });
    }, 1000);
  };

  const { data: exerciseStats, isLoading, error } = useQuery({
    queryKey: ['exercise-stats'],
    queryFn: async () => {
      if (!user?.id) {
        debugLogger.log("DetailedStats", "No user found");
        return { 
          stats: [], 
          weekly: { weight: 0, duration: 0, calories: 0 }, 
          monthly: { weight: 0, duration: 0, calories: 0 }, 
          yearly: { weight: 0, duration: 0, calories: 0 } 
        };
      }

      debugLogger.log("DetailedStats", "Chargement des statistiques d'entraînement pour l'utilisateur:", user.id);

      const now = new Date();
      const weekStart = startOfWeek(now, { locale: fr });
      const monthStart = startOfMonth(now);
      const yearStart = startOfYear(now);

      // Récupérer le poids et le genre de l'utilisateur pour le calcul des calories
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('weight_kg, gender')
        .eq('id', user.id)
        .single();

      if (profileError) {
        debugLogger.error("DetailedStats", "Erreur lors de la récupération du profil utilisateur:", profileError);
      }

      const weightKg = userProfile?.weight_kg || 75;
      const gender = (userProfile?.gender || 'male') as 'male' | 'female';

      debugLogger.log("DetailedStats", `User weight: ${weightKg}kg, gender: ${gender}`);

      // Récupérer les statistiques d'entraînement
      const { data: stats, error: statsError } = await supabase
        .from('training_stats')
        .select(`
          id,
          user_id,
          session_id,
          created_at,
          perceived_difficulty,
          session_duration_minutes,
          calories_burned,
          total_weight_lifted,
          muscle_groups_worked
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (statsError) {
        debugLogger.error("DetailedStats", "Erreur lors de la récupération des statistiques d'entraînement:", statsError);
        throw statsError;
      }

      debugLogger.log("DetailedStats", `Found ${stats?.length || 0} training stats`);

      // Si aucune statistique n'est trouvée, récupérer directement les sessions
      let workoutSessions = [];
      if (!stats || stats.length === 0) {
        const { data: sessions, error: sessionsError } = await supabase
          .from('workout_sessions')
          .select('id, user_id, created_at, total_duration_minutes, perceived_difficulty, total_weight_lifted, calories_burned, status')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(100);
          
        if (sessionsError) {
          debugLogger.error("DetailedStats", "Erreur lors de la récupération des sessions d'entraînement:", sessionsError);
        } else {
          workoutSessions = sessions || [];
          debugLogger.log("DetailedStats", `Found ${workoutSessions.length} workout sessions directly`);
        }
      }

      // Filtrage par période
      const weeklyStats = stats?.filter(stat => new Date(stat.created_at) >= weekStart) || [];
      const monthlyStats = stats?.filter(stat => new Date(stat.created_at) >= monthStart) || [];
      const yearlyStats = stats?.filter(stat => new Date(stat.created_at) >= yearStart) || [];

      // Filtrer également les sessions directes si on a dû les récupérer
      const weeklySessionsOnly = workoutSessions.filter(session => new Date(session.created_at) >= weekStart);
      const monthlySessionsOnly = workoutSessions.filter(session => new Date(session.created_at) >= monthStart);
      const yearlySessionsOnly = workoutSessions.filter(session => new Date(session.created_at) >= yearStart);

      // Fonction pour calculer les totaux par période
      const calculateTotals = (data: any[], sessionsOnly: any[] = []) => {
        // Si on a des stats, on les utilise
        if (data && data.length > 0) {
          let totalWeight = 0;
          let totalDuration = 0;
          let totalCalories = 0;

          data.forEach(stat => {
            // Validation des valeurs pour éviter NaN
            const weight = typeof stat.total_weight_lifted === 'number' ? stat.total_weight_lifted : 0;
            const duration = typeof stat.session_duration_minutes === 'number' ? stat.session_duration_minutes : 0;
            const calories = typeof stat.calories_burned === 'number' ? stat.calories_burned : 0;
            
            // Accumuler les totaux
            totalWeight += weight;
            totalDuration += duration;
            
            // Utiliser calories_burned s'il existe, sinon calculer
            if (calories > 0) {
              totalCalories += calories;
            } else {
              const intensity = stat.perceived_difficulty === 'hard' ? 'high' : 
                               stat.perceived_difficulty === 'easy' ? 'low' : 'moderate';
              
              totalCalories += calculateExerciseCalories(
                weightKg,
                duration,
                intensity,
                gender
              );
            }
          });

          return { weight: totalWeight, duration: totalDuration, calories: totalCalories };
        }
        // Sinon on utilise les sessions récupérées directement
        else if (sessionsOnly.length > 0) {
          let totalDuration = 0;
          let totalWeight = 0;
          let totalCalories = 0;

          sessionsOnly.forEach(session => {
            // Validation des valeurs pour éviter NaN
            const weight = typeof session.total_weight_lifted === 'number' ? session.total_weight_lifted : 0;
            const duration = typeof session.total_duration_minutes === 'number' ? session.total_duration_minutes : 0;
            const calories = typeof session.calories_burned === 'number' ? session.calories_burned : 0;
            
            // Accumuler les totaux
            totalWeight += weight;
            totalDuration += duration;
            
            // Utiliser calories_burned s'il existe, sinon calculer
            if (calories > 0) {
              totalCalories += calories;
            } else {
              const intensity = session.perceived_difficulty === 'hard' ? 'high' : 
                              session.perceived_difficulty === 'easy' ? 'low' : 'moderate';
              
              totalCalories += calculateExerciseCalories(
                weightKg,
                duration,
                intensity,
                gender
              );
            }
          });

          return { weight: totalWeight, duration: totalDuration, calories: totalCalories };
        }
        
        return { weight: 0, duration: 0, calories: 0 };
      };

      // Préparation des données de statistiques
      const processedStats = stats?.map(stat => {
        const intensity = stat.perceived_difficulty === 'hard' ? 'high' : 
                      stat.perceived_difficulty === 'easy' ? 'low' : 'moderate';
        const duration = typeof stat.session_duration_minutes === 'number' ? stat.session_duration_minutes : 0;
        const calories = typeof stat.calories_burned === 'number' && stat.calories_burned > 0 
          ? stat.calories_burned 
          : calculateExerciseCalories(weightKg, duration, intensity, gender);
        
        return {
          ...stat,
          session_duration_minutes: duration,
          calories: calories,
          total_weight_lifted: typeof stat.total_weight_lifted === 'number' ? stat.total_weight_lifted : 0
        };
      }) || [];

      // Si nous n'avons pas de stats mais des sessions, transformons-les pour l'affichage
      const processedSessions = workoutSessions.map(session => {
        const intensity = session.perceived_difficulty === 'hard' ? 'high' : 
                      session.perceived_difficulty === 'easy' ? 'low' : 'moderate';
        const duration = typeof session.total_duration_minutes === 'number' ? session.total_duration_minutes : 0;
        const calories = typeof session.calories_burned === 'number' && session.calories_burned > 0
          ? session.calories_burned
          : calculateExerciseCalories(weightKg, duration, intensity, gender);
          
        return {
          id: session.id,
          created_at: session.created_at,
          total_weight_lifted: typeof session.total_weight_lifted === 'number' ? session.total_weight_lifted : 0,
          session_duration_minutes: duration,
          calories: calories
        };
      });

      const finalStats = processedStats.length > 0 ? processedStats : processedSessions;
      
      // Log détaillé des données récupérées
      debugLogger.log("DetailedStats", "Statistiques traitées:", {
        totalStats: finalStats.length,
        weeklyStats: weeklyStats.length,
        monthlyStats: monthlyStats.length,
        yearlyStats: yearlyStats.length,
        weeklyTotals: calculateTotals(weeklyStats, weeklySessionsOnly),
        monthlyTotals: calculateTotals(monthlyStats, monthlySessionsOnly),
        yearlyTotals: calculateTotals(yearlyStats, yearlySessionsOnly)
      });

      return {
        stats: finalStats,
        weekly: calculateTotals(weeklyStats, weeklySessionsOnly),
        monthly: calculateTotals(monthlyStats, monthlySessionsOnly),
        yearly: calculateTotals(yearlyStats, yearlySessionsOnly)
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes de validité
    refetchOnWindowFocus: true
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
    debugLogger.error("DetailedStats", "Error in DetailedStats:", error);
    return (
      <div className="text-center py-8 text-destructive">
        <p>Une erreur est survenue lors du chargement des statistiques d'entraînement.</p>
        <div className="mt-2 text-sm text-muted-foreground">
          Détail: {(error as Error)?.message || "Erreur inconnue"}
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          className="mt-4"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Réessayer
        </Button>
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

  const hasNoData = !exerciseStats?.stats.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Statistiques détaillées</h2>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm" 
          className="ml-auto"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>
      
      {lastLoadTime && (
        <div className="text-xs text-muted-foreground text-right">
          Dernière mise à jour: {format(lastLoadTime, 'dd/MM/yyyy à HH:mm')}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Dumbbell className="w-5 h-5" />
            Cette semaine
          </h3>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {Math.round(exerciseStats?.weekly.weight || 0).toLocaleString()} kg
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Flame className="w-4 h-4" />
              {Math.round(exerciseStats?.weekly.calories || 0).toLocaleString()} kcal
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
              {Math.round(exerciseStats?.monthly.weight || 0).toLocaleString()} kg
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Flame className="w-4 h-4" />
              {Math.round(exerciseStats?.monthly.calories || 0).toLocaleString()} kcal
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
              {Math.round(exerciseStats?.yearly.weight || 0).toLocaleString()} kg
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Flame className="w-4 h-4" />
              {Math.round(exerciseStats?.yearly.calories || 0).toLocaleString()} kcal
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Historique des séances</h3>
        {hasNoData ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucune donnée d'entraînement disponible.</p>
            <p className="mt-2">Commencez à vous entraîner pour voir vos statistiques!</p>
          </div>
        ) : (
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
                {exerciseStats?.stats.slice(0, 10).map((stat: any) => (
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
        )}
      </Card>
    </div>
  );
};

export default DetailedStats;
