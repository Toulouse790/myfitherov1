
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { debugLogger } from "@/utils/debug-logger";

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    debugLogger.log("Index", "État de l'authentification:", { user: !!user, loading });
    
    if (!loading) {
      if (user) {
        // Si l'utilisateur est connecté, rester sur la page d'accueil
        debugLogger.log("Index", "Utilisateur connecté, restant sur l'accueil");
      } else {
        // Si l'utilisateur n'est pas connecté, rediriger vers l'inscription
        debugLogger.log("Index", "Utilisateur non connecté, redirection vers l'inscription");
        navigate("/signup");
      }
    }
  }, [navigate, user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Afficher le contenu de la page d'accueil si l'utilisateur est connecté
  return user ? (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Bienvenue sur MyFitHero</h1>
      <p className="text-lg mb-4">Votre parcours fitness commence ici.</p>
    </div>
  ) : null;
}
