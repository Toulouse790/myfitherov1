
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { debugLogger } from "@/utils/debug-logger";

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationOptions {
  isImportant?: boolean;
  duration?: number;
}

export const useNotificationManager = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const notify = async (
    title: string,
    message: string,
    type: NotificationType = 'info',
    options: NotificationOptions = {}
  ) => {
    try {
      // Déterminer la variante du toast en fonction du type
      const variant = type === 'error' ? 'destructive' : 
                      type === 'success' ? 'default' : 
                      type === 'warning' ? 'default' : 'default';
      
      // Afficher le toast de notification
      toast({
        title,
        description: message,
        variant,
        duration: options.duration || 3000, // Par défaut 3 secondes
      });

      // Si c'est une notification importante et que l'utilisateur est authentifié, la stocker
      if (options.isImportant && user) {
        try {
          await supabase
            .from('notifications')
            .insert({
              user_id: user.id,
              title,
              message,
              type,
              is_important: true
            });
        } catch (error) {
          debugLogger.error("NotificationManager", "Erreur lors du stockage de la notification:", error);
        }
      }
    } catch (error) {
      debugLogger.error("NotificationManager", "Erreur lors de l'affichage de la notification:", error);
      // Tentative de fallback avec un toast simple
      toast({
        title: "Erreur de notification",
        description: "Impossible d'afficher la notification correctement",
        variant: "destructive",
      });
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);
    } catch (error) {
      debugLogger.error("NotificationManager", "Erreur lors du marquage de la notification comme lue:", error);
    }
  };

  const getUnreadNotifications = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      debugLogger.error("NotificationManager", "Erreur lors de la récupération des notifications:", error);
      return [];
    }
  };

  return {
    notify,
    markAsRead,
    getUnreadNotifications,
  };
};
