import { Header } from "@/components/Layout/Header";
import { Card } from "@/components/ui/card";
import { Users, DollarSign, Edit2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { WidgetGrid } from "@/components/Admin/Dashboard/WidgetGrid";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const { data: userStats } = useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      return { totalUsers: count || 0 };
    }
  });

  const { data: widgetConfigs, isLoading } = useQuery({
    queryKey: ['widget-configs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_widget_configs')
        .select('*')
        .order('position');

      if (error) throw error;
      return data;
    }
  });

  const { data: monthlyUsers } = useQuery({
    queryKey: ['monthly-users'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('created_at');
      return data || [];
    }
  });

  const { data: monthlyWorkouts } = useQuery({
    queryKey: ['monthly-workouts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('workout_sessions')
        .select('created_at');
      return data || [];
    }
  });

  const { data: publishedExercises } = useQuery({
    queryKey: ['published-exercises'],
    queryFn: async () => {
      const { data } = await supabase
        .from('unified_exercises')
        .select('*')
        .eq('est_publié', true);
      return data || [];
    }
  });

  const handleDragEnd = async (event: any) => {
    if (!event.active || !event.over || event.active.id === event.over.id) {
      return;
    }

    const oldIndex = widgetConfigs?.findIndex(w => w.id === event.active.id);
    const newIndex = widgetConfigs?.findIndex(w => w.id === event.over.id);

    if (oldIndex === undefined || newIndex === undefined || !widgetConfigs) return;

    const newConfigs = [...widgetConfigs];
    const [movedItem] = newConfigs.splice(oldIndex, 1);
    newConfigs.splice(newIndex, 0, movedItem);

    // Mise à jour des positions dans la base de données
    try {
      const updates = newConfigs.map((config, index) => ({
        id: config.id,
        position: index
      }));

      const { error } = await supabase
        .from('admin_widget_configs')
        .upsert(updates);

      if (error) throw error;

      toast({
        title: "Position mise à jour",
        description: "La nouvelle disposition a été enregistrée"
      });
    } catch (error) {
      console.error('Error updating positions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la nouvelle disposition",
        variant: "destructive"
      });
    }
  };

  const handleUpdateConfig = async (data: any) => {
    try {
      const { error } = await supabase
        .from('admin_widget_configs')
        .update(data)
        .eq('id', data.id);

      if (error) throw error;

      toast({
        title: "Widget mis à jour",
        description: "Les modifications ont été enregistrées"
      });
    } catch (error) {
      console.error('Error updating widget:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le widget",
        variant: "destructive"
      });
    }
  };

  const handleDeleteConfig = async (id: string) => {
    try {
      const { error } = await supabase
        .from('admin_widget_configs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Widget supprimé",
        description: "Le widget a été supprimé avec succès"
      });
    } catch (error) {
      console.error('Error deleting widget:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le widget",
        variant: "destructive"
      });
    }
  };

  return (
    <Header>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tableau de bord administrateur</h1>
          <Button 
            variant={isEditing ? "destructive" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {isEditing ? "Terminer" : "Réorganiser"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

        <WidgetGrid
          isEditing={isEditing}
          widgetConfigs={widgetConfigs || []}
          monthlyUsers={monthlyUsers || []}
          monthlyWorkouts={monthlyWorkouts || []}
          publishedExercises={publishedExercises || []}
          onDragEnd={handleDragEnd}
          onUpdateConfig={handleUpdateConfig}
          onDeleteConfig={handleDeleteConfig}
        />
      </div>
    </Header>
  );
}