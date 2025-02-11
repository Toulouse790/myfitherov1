
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

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
    type: NotificationType,
    options: NotificationOptions = {}
  ) => {
    // Show toast notification
    toast({
      title,
      description: message,
      variant: type === 'error' ? 'destructive' : 'default',
      duration: options.duration || 1000, // Changed from 5000 to 1000 (1 second)
    });

    // If it's an important notification and user is authenticated, store it
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
        console.error('Error storing notification:', error);
      }
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
      console.error('Error marking notification as read:', error);
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
      console.error('Error fetching notifications:', error);
      return [];
    }
  };

  return {
    notify,
    markAsRead,
    getUnreadNotifications,
  };
};
