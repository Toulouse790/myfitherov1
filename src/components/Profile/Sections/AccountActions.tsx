
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const AccountActions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: t('auth.logoutSuccess', { fallback: "Déconnexion réussie" }),
        description: t('auth.logoutMessage', { fallback: "Vous avez été déconnecté avec succès" }),
      });
      
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast({
        title: t('auth.logoutError', { fallback: "Erreur de déconnexion" }),
        description: t('auth.logoutErrorMessage', { fallback: "Une erreur est survenue lors de la déconnexion" }),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        className="w-full flex justify-center items-center gap-2" 
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        <span>{t('common.logout')}</span>
      </Button>
      
      <Button 
        variant="destructive" 
        className="w-full"
      >
        {t('common.deleteAccount')}
      </Button>
    </div>
  );
};
