
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { appCache } from '@/utils/cache';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export const QuestionnaireCompleteHandler = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    if (user) {
      // Marquer le questionnaire comme complété dans le cache
      appCache.set(`questionnaire_completed_${user.id}`, true, 3600);
      
      // Afficher un message de succès
      toast({
        title: "Questionnaire complété",
        description: "Votre profil a été mis à jour avec succès.",
      });
      
      // Rediriger vers la destination précédente ou vers l'accueil
      const state = location.state as { returnTo?: string } | null;
      const returnTo = state?.returnTo || "/";
      
      navigate(returnTo, { replace: true });
    } else {
      // Si pas d'utilisateur, rediriger vers la connexion
      navigate("/signin", { replace: true });
    }
  }, [user, navigate, location, toast]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
};
