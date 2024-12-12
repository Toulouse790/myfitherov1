import { Card } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp } from "lucide-react";
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

  const { data: retentionRate } = useQuery({
    queryKey: ['admin-retention-rate'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: activeUsers } = await supabase
        .from('workout_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      return totalUsers ? Math.round((activeUsers || 0) / totalUsers * 100) : 0;
    }
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            <h3 className="text-2xl font-bold">-</h3>
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
            <h3 className="text-2xl font-bold">{retentionRate || 0}%</h3>
          </div>
        </div>
      </Card>
    </div>
  );
};