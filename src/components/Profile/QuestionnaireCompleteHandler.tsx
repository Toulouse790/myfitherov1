
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { appCache } from '@/utils/cache';
import { useAuth } from '@/contexts/AuthContext';

export const QuestionnaireCompleteHandler = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (user) {
      // Marquer le questionnaire comme complété dans le cache
      appCache.set(`questionnaire_completed_${user.id}`, true, 900);
      
      // Récupérer la destination d'origine depuis l'état de location
      const state = location.state as { from?: { pathname: string } };
      const returnTo = state?.from?.pathname || "/";
      
      // Rediriger vers la destination précédente ou vers l'accueil
      navigate(returnTo, { replace: true });
    } else {
      // Si pas d'utilisateur, rediriger vers la connexion
      navigate("/signin", { replace: true });
    }
  }, [user, navigate, location]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
};
