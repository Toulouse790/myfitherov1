import { Activity, Dumbbell, Heart } from "lucide-react";
import { DashboardCard } from "./DashboardCard";

export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Séances ce mois"
        value={12}
        icon={<Dumbbell className="w-6 h-6 md:w-8 md:h-8" />}
      />
      <DashboardCard
        title="Minutes d'entraînement"
        value={360}
        icon={<Activity className="w-6 h-6 md:w-8 md:h-8" />}
      />
      <DashboardCard
        title="Calories brûlées"
        value="2,450"
        icon={<Heart className="w-6 h-6 md:w-8 md:h-8" />}
        className="sm:col-span-2 lg:col-span-1"
      />
    </div>
  );
};