import { Activity, Dumbbell, Heart } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const DashboardStats = () => {
  const { toast } = useToast();

  const { data: trainingStats } = useQuery({
    queryKey: ['training-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_stats')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data;
    }
  });

  const workoutsThisMonth = trainingStats?.length || 0;
  const plannedWorkouts = 16;
  const totalMinutes = trainingStats?.reduce((acc, stat) => acc + (stat.duration_minutes || 0), 0) || 0;
  const totalCalories = Math.round((totalMinutes * 7.5)); // Estimation basique des calories

  useEffect(() => {
    if (workoutsThisMonth > 24) {
      toast({
        title: "Attention à votre santé",
        description: "Il est recommandé de ne pas dépasser 6 entraînements par semaine pour permettre une bonne récupération.",
        variant: "destructive",
        duration: 6000,
      });
    }
  }, [workoutsThisMonth, toast]);

  return (
    <div className="space-y-4">
      {workoutsThisMonth > 24 && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Risque de surentraînement détecté</AlertTitle>
          <AlertDescription>
            Votre fréquence d'entraînement est très élevée. Pensez à inclure suffisamment de repos
            pour permettre à votre corps de récupérer et éviter les blessures.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <DashboardCard
          title="Séances ce mois"
          value={workoutsThisMonth}
          target={plannedWorkouts}
          icon={<Dumbbell className="w-5 h-5" />}
          className={workoutsThisMonth > 24 ? "border-red-500" : ""}
        />
        <DashboardCard
          title="Minutes d'entraînement"
          value={totalMinutes}
          target={400}
          icon={<Activity className="w-5 h-5" />}
        />
        <DashboardCard
          title="Calories brûlées"
          value={totalCalories}
          target={2800}
          icon={<Heart className="w-5 h-5" />}
        />
      </div>
    </div>
  );
};