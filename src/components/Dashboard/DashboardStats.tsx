import { Activity, Dumbbell, Heart } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const DashboardStats = () => {
  const { toast } = useToast();
  const workoutsThisMonth = 12;
  const plannedWorkouts = 16;

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
          value={360}
          target={400}
          icon={<Activity className="w-5 h-5" />}
        />
        <DashboardCard
          title="Calories brûlées"
          value="2,450"
          target="2,800"
          icon={<Heart className="w-5 h-5" />}
        />
      </div>
    </div>
  );
};