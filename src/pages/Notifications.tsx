
import { Header } from "@/components/Layout/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationManager } from "@/hooks/use-notification-manager";

export default function Notifications() {
  const { user } = useAuth();
  const { markAsRead } = useNotificationManager();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      return data;
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <Header>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Header>
    );
  }

  return (
    <Header>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Bell className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Notifications</h1>
        </div>
        
        <div className="grid gap-4">
          {notifications?.map((notification) => (
            <Card 
              key={notification.id} 
              className={`p-6 ${!notification.is_read ? 'border-primary' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{notification.title}</h3>
                  <p className="text-muted-foreground">{notification.message}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
                {!notification.is_read && (
                  <Button
                    variant="ghost"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Marquer comme lu
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Header>
  );
}
