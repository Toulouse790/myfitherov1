
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AuthConfirmPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session) {
          // L'utilisateur est connecté, rediriger vers la page d'accueil
          toast({
            title: "Connexion réussie",
            description: "Bienvenue sur MyFitHero !",
          });
          navigate('/', { replace: true });
        } else {
          // Pas de session, rediriger vers la page de connexion
          toast({
            variant: "destructive",
            title: "Session expirée",
            description: "Veuillez vous reconnecter",
          });
          navigate('/signin', { replace: true });
        }
      } catch (error) {
        console.error('Erreur lors de la confirmation:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la confirmation",
        });
        navigate('/signin', { replace: true });
      }
    };

    handleAuthRedirect();
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Vérification en cours...</h2>
        <p className="text-muted-foreground">Veuillez patienter pendant que nous vérifions vos informations.</p>
      </div>
    </div>
  );
};
