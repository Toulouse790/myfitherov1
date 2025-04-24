
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { debugLogger } from "@/utils/debug-logger";
import Home from "./Home";
import { VerifyConnection } from "@/components/Workouts/VerifyConnection";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthenticationStatus } from "@/components/Home/AuthenticationStatus";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

export default function Index() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    debugLogger.log("Index", "Initialisation de la page d'accueil", { 
      isAuthenticated: !!user,
      isLoading: loading
    });
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="ml-2">{t('common.loading', { fallback: 'Chargement...' })}</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-4xl mx-auto p-4 space-y-6"
    >
      {/* Afficher AuthenticationStatus uniquement pour les utilisateurs non connectés */}
      {!user && <AuthenticationStatus />}
      
      {/* Afficher le contenu principal de l'application pour les utilisateurs connectés */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <VerifyConnection />
          <Home />
        </motion.div>
      )}
      
      {/* Contenu pour les utilisateurs non connectés (présentation de l'application) */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 p-6 bg-muted/40 rounded-lg text-center"
        >
          <h2 className="text-xl font-semibold mb-4">Découvrez MyFitHero</h2>
          <p className="mb-4">
            L'application qui vous aide à atteindre vos objectifs fitness avec des programmes personnalisés,
            un suivi de vos progrès et une communauté motivante.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-background rounded-lg shadow-sm">
              <h3 className="font-medium mb-2">Programmes sur mesure</h3>
              <p className="text-sm text-muted-foreground">Adaptés à votre niveau et vos objectifs</p>
            </div>
            <div className="p-4 bg-background rounded-lg shadow-sm">
              <h3 className="font-medium mb-2">Suivi intelligent</h3>
              <p className="text-sm text-muted-foreground">Visualisez vos progrès et votre évolution</p>
            </div>
            <div className="p-4 bg-background rounded-lg shadow-sm">
              <h3 className="font-medium mb-2">Nutrition personnalisée</h3>
              <p className="text-sm text-muted-foreground">Des conseils adaptés à votre activité</p>
            </div>
          </div>
          
          {/* Boutons d'action pour se connecter ou s'inscrire */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/signin">
              <Button size="lg" className="flex items-center gap-2 w-full sm:w-auto">
                <LogIn className="h-4 w-4" />
                {t("auth.signIn", { fallback: "Connexion" })}
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" size="lg" className="flex items-center gap-2 w-full sm:w-auto">
                <UserPlus className="h-4 w-4" />
                {t("auth.signUp", { fallback: "Inscription" })}
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
