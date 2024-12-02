import { Activity, Dumbbell, Heart } from "lucide-react";
import { DashboardCard } from "./DashboardCard";

export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4">
      <DashboardCard
        title="Séances ce mois"
        value={12}
        icon={<Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />}
      />
      <DashboardCard
        title="Minutes d'entraînement"
        value={360}
        icon={<Activity className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />}
      />
      <DashboardCard
        title="Calories brûlées"
        value="2,450"
        icon={<Heart className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />}
      />
    </div>
  );
};