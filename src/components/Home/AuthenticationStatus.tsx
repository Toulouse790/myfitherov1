
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn, User, Dumbbell } from "lucide-react";

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

  // Extract username from email or metadata
  const username = user.user_metadata?.username || 
                  user.user_metadata?.name || 
                  user.email?.split('@')[0] || 
                  "Sportif";

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {t("auth.welcomeBack", { fallback: `Bon retour, ${username}!` })}
          </h2>
          <p className="text-muted-foreground">
            {user.email}
          </p>
        </div>
        <Link to="/profile">
          <Button variant="outline" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {t("profile.viewProfile", { fallback: "Voir le profil" })}
          </Button>
        </Link>
      </div>
    </Card>
  );
};
