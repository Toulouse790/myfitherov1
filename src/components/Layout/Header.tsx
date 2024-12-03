import { Dumbbell, User, BarChart, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUsername(profile.username);
        }
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate("/signin");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-b z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Dumbbell className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl">FitTrack</span>
        </Link>
        
        <nav className="flex items-center space-x-4">
          <Link to="/stats" className="p-2 hover:text-primary transition-colors">
            <BarChart className="w-5 h-5" />
          </Link>
          {username ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">{username}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hover:text-primary transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <Link to="/signup" className="p-2 hover:text-primary transition-colors">
              <User className="w-5 h-5" />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};