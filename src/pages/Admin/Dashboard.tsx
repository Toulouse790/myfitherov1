import { Header } from "@/components/Layout/Header";
import { Card } from "@/components/ui/card";
import { Users, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const { data: userStats } = useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      return { totalUsers: count || 0 };
    }
  });

  return (
    <Header>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Tableau de bord administrateur</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Utilisateurs totaux</p>
                <p className="text-2xl font-bold">{userStats?.totalUsers || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chiffre d'affaires</p>
                <p className="text-2xl font-bold">0 €</p>
                <p className="text-xs text-gray-500">Fonctionnalité à venir</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Header>
  );
}