
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";

export const AuthConfirmPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        debugLogger.log("AuthConfirm", "Vérification de la session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          debugLogger.error("AuthConfirm", "Erreur lors de la vérification de la session:", error);
          throw error;
        }

        if (session) {
          // L'utilisateur est connecté, rediriger vers le questionnaire
          debugLogger.log("AuthConfirm", "Session trouvée, redirection vers le questionnaire");
          toast({
            title: "Connexion réussie",
            description: "Bienvenue sur MyFitHero !",
          });
          navigate('/initial-questionnaire', { replace: true });
        } else {
          // Pas de session, rediriger vers la page de connexion
          debugLogger.warn("AuthConfirm", "Aucune session trouvée");
          toast({
            variant: "destructive",
            title: t("auth.error"),
            description: t("auth.sessionExpired"),
          });
          navigate('/signin', { replace: true });
        }
      } catch (error) {
        debugLogger.error("AuthConfirm", "Erreur lors de la confirmation:", error);
        toast({
          variant: "destructive",
          title: t("common.error"),
          description: t("auth.confirmError"),
        });
        navigate('/signin', { replace: true });
      }
    };

    handleAuthRedirect();
  }, [navigate, toast, t]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">{t("auth.verifying")}</h2>
        <p className="text-muted-foreground">{t("auth.pleaseWait")}</p>
      </div>
    </div>
  );
};
