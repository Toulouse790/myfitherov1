import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface HeaderProps {
  children?: React.ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
  const { user } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center space-x-2">
              <span className="hidden font-bold text-xl sm:inline-block">
                MyFitHero
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
                Accueil
              </Link>
              <Link to="/workouts" className="text-sm font-medium transition-colors hover:text-primary">
                Entraînements
              </Link>
              <Link to="/nutrition" className="text-sm font-medium transition-colors hover:text-primary">
                Nutrition
              </Link>
              <Link to="/sleep" className="text-sm font-medium transition-colors hover:text-primary">
                Sommeil
              </Link>
              <Link to="/stats" className="text-sm font-medium transition-colors hover:text-primary">
                Statistiques
              </Link>
            </nav>
          </div>
        </div>
      </header>
      {children && <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>}
    </>
  );
};