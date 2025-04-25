
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToastWithTranslation } from "@/hooks/use-toast-with-translation";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const AccountActions = () => {
  const { toastFromKey } = useToastWithTranslation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Le toast sera géré par l'événement onAuthStateChange
      
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toastFromKey('auth.logoutError', 'auth.logoutErrorMessage', { variant: "destructive" });
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
        <span>{t('auth.signOut')}</span>
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
