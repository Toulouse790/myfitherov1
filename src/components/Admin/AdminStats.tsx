import { Card } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, Percent } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AdminStats = () => {
  const { data: usersCount } = useQuery({
    queryKey: ['admin-users-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  // Pour l'exemple, nous utilisons des données statiques pour les revenus
  // Ces métriques devront être connectées à une vraie source de données plus tard
  const monthlyRevenue = 1500;
  const yearlyRevenue = 18000;
  const conversionRate = 2.5;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <Users className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Utilisateurs actifs
            </p>
            <h3 className="text-2xl font-bold">{usersCount || 0}</h3>
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
            <h3 className="text-2xl font-bold">{monthlyRevenue}€</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <TrendingUp className="h-8 w-8 text-purple-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Revenu annuel
            </p>
            <h3 className="text-2xl font-bold">{yearlyRevenue}€</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <Percent className="h-8 w-8 text-orange-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Taux de conversion
            </p>
            <h3 className="text-2xl font-bold">{conversionRate}%</h3>
          </div>
        </div>
      </Card>
    </div>
  );
};