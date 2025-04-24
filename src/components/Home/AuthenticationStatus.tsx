
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn, User } from "lucide-react";

export const AuthenticationStatus = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">
          {t("auth.welcomeGuest", { fallback: "Bienvenue sur MyFitHero" })}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("auth.loginPrompt", { 
            fallback: "Connectez-vous pour accéder à toutes les fonctionnalités" 
          })}
        </p>
        <Link to="/signin">
          <Button className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            {t("auth.signIn")}
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {t("auth.welcomeBack", { fallback: "Bon retour" })}
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
