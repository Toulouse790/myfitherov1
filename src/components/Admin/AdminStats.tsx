import { Card } from "@/components/ui/card";
import { Users, DollarSign, Activity, TrendingUp } from "lucide-react";

export const AdminStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <Users className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Utilisateurs actifs
            </p>
            <h3 className="text-2xl font-bold">2,350</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <DollarSign className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Revenu mensuel
            </p>
            <h3 className="text-2xl font-bold">4,250€</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <Activity className="h-8 w-8 text-purple-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Séances créées
            </p>
            <h3 className="text-2xl font-bold">1,240</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <TrendingUp className="h-8 w-8 text-orange-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Taux de rétention
            </p>
            <h3 className="text-2xl font-bold">85%</h3>
          </div>
        </div>
      </Card>
    </div>
  );
};