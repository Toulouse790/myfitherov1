import { Card } from "@/components/ui/card";
import { Activity, Dumbbell, Heart } from "lucide-react";

export const PreviewDashboardStats = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5" />
            <div>
              <p className="text-sm text-muted-foreground">Séances ce mois</p>
              <p className="text-2xl font-bold">12/16</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            <div>
              <p className="text-sm text-muted-foreground">Minutes d'entraînement</p>
              <p className="text-2xl font-bold">320/400</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            <div>
              <p className="text-sm text-muted-foreground">Calories brûlées</p>
              <p className="text-2xl font-bold">2400/2800</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};