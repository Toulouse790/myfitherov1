import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              MyFitHero
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center">
            {user ? (
              <Link to="/profile">
                <Button variant="ghost" className="h-8 w-8 rounded-full">
                  <span className="sr-only">Profile</span>
                  <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </Button>
              </Link>
            ) : (
              <Link to="/signin">
                <Button variant="ghost">Connexion</Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};