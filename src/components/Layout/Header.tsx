
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { LogIn, LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  children?: React.ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: t("auth.signOutSuccess", { fallback: "Déconnexion réussie" }),
        description: t("auth.signOutMessage", { fallback: "À bientôt !" })
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("auth.signOutError", { fallback: "Erreur de déconnexion" }),
        description: t("auth.signOutErrorMessage", { fallback: "Une erreur est survenue" })
      });
    }
  };

  // Get username from metadata if available
  const username = user?.user_metadata?.username || 
                  user?.user_metadata?.name || 
                  user?.email?.split('@')[0];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl text-primary">MyFitHero</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm hidden md:inline-block">
                  {username && `Bonjour, ${username}`}
                </span>
                <Link to="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  variant="outline"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  {t("auth.signOut", { fallback: "Déconnexion" })}
                </Button>
              </>
            ) : (
              <Link to="/signin">
                <Button className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  {t("auth.signIn", { fallback: "Connexion" })}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      {children && <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>}
    </>
  );
};
