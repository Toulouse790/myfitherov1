
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { debugLogger } from "@/utils/debug-logger";
import Home from "./Home";

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    debugLogger.log("Index", "État de l'authentification: " + (!!user ? "connecté" : "non connecté") + ", chargement: " + loading);
    
    if (!loading && !user) {
      // Si l'utilisateur n'est pas connecté, rediriger vers l'inscription
      debugLogger.log("Index", "Utilisateur non connecté, redirection vers l'inscription");
      navigate("/signup");
    }
  }, [navigate, user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Afficher la page d'accueil si l'utilisateur est connecté
  return user ? <Home /> : null;
}
