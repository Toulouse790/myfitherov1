
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const WelcomeHeader = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
        
      return data;
    },
    enabled: !!user
  });

  if (!user) return null;

  const username = profile?.username || user?.email?.split('@')[0] || 'Fitness Hero';
  const greeting = getGreeting();
  
  return (
    <div className="animate-fade-in space-y-1">
      <h1 className="text-2xl font-bold">
        {greeting}, <span className="text-primary">{username}</span>
      </h1>
      <p className="text-muted-foreground text-sm">
        Votre parcours fitness commence ici
      </p>
    </div>
  );
};

const getGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
};
