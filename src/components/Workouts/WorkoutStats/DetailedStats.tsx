import { Card } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity, Dumbbell, Scale, Flame, RefreshCw, AlertCircle, Target } from "lucide-react";
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
import { Link } from "react-router-dom";

export const DetailedStats = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [lastLoadTime, setLastLoadTime] = useState<Date | null>(null);

  useEffect(() => {
    setLastLoadTime(new Date());
    
    const refreshInterval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['exercise-stats'] });
      setLastLoadTime(new Date());
    }, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [queryClient]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    queryClient.invalidateQueries({ queryKey: ['exercise-stats'] });
    queryClient.invalidateQueries({ queryKey: ['workout-sessions'] });
    queryClient.invalidateQueries({ queryKey: ['training-stats'] });
    setLastLoadTime(new Date());
    
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

      const { data: trainingStats, error: statsError } = await supabase
        .from('training_stats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (statsError) {
        debugLogger.error("DetailedStats", "Erreur lors de la récupération des statistiques:", statsError);
        return { 
          stats: [], 
          weekly: { weight: 0, duration: 0, calories: 0 }, 
          monthly: { weight: 0, duration: 0, calories: 0 }, 
          yearly: { weight: 0, duration: 0, calories: 0 } 
        };
      }

      debugLogger.log("DetailedStats", `Found ${trainingStats?.length || 0} training stats`);

      const weeklyTotals = { weight: 0, duration: 0, calories: 0 };
      const monthlyTotals = { weight: 0, duration: 0, calories: 0 };
      const yearlyTotals = { weight: 0, duration: 0, calories: 0 };

      let weeklyStats = 0;
      let monthlyStats = 0;
      let yearlyStats = 0;

      if (trainingStats) {
        for (const stat of trainingStats) {
          const createdAt = new Date(stat.created_at);
          
          const weight = typeof stat.total_weight_lifted === 'number' ? stat.total_weight_lifted : 0;
          const duration = typeof stat.session_duration_minutes === 'number' ? stat.session_duration_minutes : 0;
          const calories = typeof stat.calories_burned === 'number' ? stat.calories_burned : 0;
          
          if (createdAt >= weekStart) {
            weeklyTotals.weight += weight;
            weeklyTotals.duration += duration;
            weeklyTotals.calories += calories;
            weeklyStats++;
          }
          
          if (createdAt >= monthStart) {
            monthlyTotals.weight += weight;
            monthlyTotals.duration += duration;
            monthlyTotals.calories += calories;
            monthlyStats++;
          }
          
          if (createdAt >= yearStart) {
            yearlyTotals.weight += weight;
            yearlyTotals.duration += duration;
            yearlyTotals.calories += calories;
            yearlyStats++;
          }
        }
      }

      debugLogger.log("DetailedStats", "Statistiques traitées:", {
        totalStats: trainingStats?.length || 0,
        weeklyStats,
        monthlyStats,
        yearlyStats,
        weeklyTotals,
        monthlyTotals,
        yearlyTotals
      });

      return {
        stats: trainingStats || [],
        weekly: weeklyTotals,
        monthly: monthlyTotals,
        yearly: yearlyTotals
      };
    },
    refetchOnWindowFocus: false,
    staleTime: 300000,
  });

  if (isLoading) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p>Chargement des statistiques...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p>Erreur lors du chargement des statistiques</p>
          <Button onClick={handleRefresh}>Réessayer</Button>
        </div>
      </Card>
    );
  }

  const hasData = exerciseStats && 
    (exerciseStats.weekly.weight > 0 || 
     exerciseStats.weekly.duration > 0 ||
     exerciseStats.weekly.calories > 0 ||
     exerciseStats.monthly.weight > 0 ||
     exerciseStats.monthly.duration > 0 ||
     exerciseStats.monthly.calories > 0);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Statistiques d'entraînement</h3>
        <div className="flex gap-2">
          <Link to="/goals/weekly">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Objectifs
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {!hasData ? (
        <div className="text-center py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <Dumbbell className="h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium">Aucune statistique disponible</h3>
            <p className="text-muted-foreground max-w-md">
              Terminez une séance d'entraînement pour commencer à voir vos statistiques ici
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Cette semaine" 
              icon={<Activity className="h-5 w-5" />}
              weight={exerciseStats.weekly.weight} 
              duration={exerciseStats.weekly.duration}
              calories={exerciseStats.weekly.calories}
            />
            <StatCard 
              title="Ce mois" 
              icon={<Activity className="h-5 w-5" />}
              weight={exerciseStats.monthly.weight} 
              duration={exerciseStats.monthly.duration}
              calories={exerciseStats.monthly.calories}
            />
            <StatCard 
              title="Cette année" 
              icon={<Activity className="h-5 w-5" />}
              weight={exerciseStats.yearly.weight} 
              duration={exerciseStats.yearly.duration}
              calories={exerciseStats.yearly.calories}
            />
          </div>

          {exerciseStats.stats.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Durée (min)</TableHead>
                    <TableHead>Poids (kg)</TableHead>
                    <TableHead>Calories</TableHead>
                    <TableHead>Difficulté</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exerciseStats.stats.slice(0, 5).map((stat) => (
                    <TableRow key={stat.id}>
                      <TableCell>
                        {format(new Date(stat.created_at), 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell>{stat.session_duration_minutes || 0}</TableCell>
                      <TableCell>{Math.round(stat.total_weight_lifted || 0)}</TableCell>
                      <TableCell>{stat.calories_burned || 0}</TableCell>
                      <TableCell>{stat.perceived_difficulty || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {lastLoadTime && (
            <div className="text-xs text-muted-foreground text-right pt-2">
              Dernière mise à jour: {format(lastLoadTime, 'dd/MM/yyyy à HH:mm')}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  weight: number;
  duration: number;
  calories: number;
}

const StatCard = ({ title, icon, weight, duration, calories }: StatCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className="font-medium">{title}</h4>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-muted-foreground" />
          <span className="font-bold">{Math.round(weight)} kg</span>
        </div>
        <div className="flex items-center gap-2">
          <Dumbbell className="h-4 w-4 text-muted-foreground" />
          <span className="font-bold">{duration} min</span>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-muted-foreground" />
          <span className="font-bold">{calories} kcal</span>
        </div>
      </div>
    </Card>
  );
};
