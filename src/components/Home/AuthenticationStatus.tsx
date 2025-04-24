
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn, Dumbbell } from "lucide-react";

export const AuthenticationStatus = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) {
    return (
      <Card className="p-6 text-center">
        <div className="flex justify-center mb-4">
          <Dumbbell className="h-12 w-12 text-primary opacity-70" />
        </div>
        <h2 className="text-2xl font-bold mb-4">
          {t("auth.welcomeGuest", { fallback: "Bienvenue sur MyFitHero" })}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("auth.loginPrompt", { 
            fallback: "Connectez-vous pour commencer votre parcours fitness" 
          })}
        </p>
        <div className="flex justify-center">
          <Link to="/signin">
            <Button size="lg" className="flex items-center gap-2 px-6">
              <LogIn className="h-4 w-4" />
              {t("auth.signIn", { fallback: "Connexion" })}
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return null; // Ne plus afficher de message pour les utilisateurs connectés
};
