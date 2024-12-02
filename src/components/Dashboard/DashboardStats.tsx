import { Activity, Dumbbell, Heart } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export const DashboardStats = () => {
  const { toast } = useToast();
  const workoutsThisMonth = 12;

  useEffect(() => {
    if (workoutsThisMonth > 24) { // Plus de 6 entraînements par semaine (24 par mois)
      toast({
        title: "Attention à votre santé",
        description: "Il est recommandé de ne pas dépasser 6 entraînements par semaine pour permettre une bonne récupération.",
        variant: "destructive"
      });
    }
  }, [workoutsThisMonth, toast]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <DashboardCard
        title="Séances ce mois"
        value={workoutsThisMonth}
        icon={<Dumbbell className="w-5 h-5" />}
        className={workoutsThisMonth > 24 ? "border-red-500" : ""}
      />
      <DashboardCard
        title="Minutes d'entraînement"
        value={360}
        icon={<Activity className="w-5 h-5" />}
      />
      <DashboardCard
        title="Calories brûlées"
        value="2,450"
        icon={<Heart className="w-5 h-5" />}
      />
    </div>
  );
};