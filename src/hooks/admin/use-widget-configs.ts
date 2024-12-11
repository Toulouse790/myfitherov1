import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface WidgetConfig {
  id: string;
  widget_id: string;
  title: string;
  description: string | null;
  is_active: boolean;
  config: Record<string, any>;
  position: number;
  user_id: string;
}

export const useWidgetConfigs = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: widgetConfigs, isLoading } = useQuery({
    queryKey: ['widget-configs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_widget_configs')
        .select('*')
        .order('position');

      if (error) {
        console.error('Error fetching widget configs:', error);
        throw error;
      }
      return data as WidgetConfig[];
    }
  });

  const updateConfig = useMutation({
    mutationFn: async (config: Partial<WidgetConfig> & { id: string }) => {
      const { error } = await supabase
        .from('admin_widget_configs')
        .update(config)
        .eq('id', config.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['widget-configs'] });
      toast({
        title: "Configuration mise à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    },
    onError: (error) => {
      console.error('Error updating widget config:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la configuration.",
        variant: "destructive",
      });
    }
  });

  const deleteConfig = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('admin_widget_configs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['widget-configs'] });
      toast({
        title: "Widget supprimé",
        description: "Le widget a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      console.error('Error deleting widget config:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le widget.",
        variant: "destructive",
      });
    }
  });

  const addConfig = useMutation({
    mutationFn: async (config: Omit<WidgetConfig, 'id'>) => {
      const { error } = await supabase
        .from('admin_widget_configs')
        .insert(config);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['widget-configs'] });
      toast({
        title: "Widget ajouté",
        description: "Le nouveau widget a été ajouté avec succès.",
      });
    },
    onError: (error) => {
      console.error('Error adding widget config:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le widget.",
        variant: "destructive",
      });
    }
  });

  return {
    widgetConfigs,
    isLoading,
    updateConfig,
    deleteConfig,
    addConfig
  };
};