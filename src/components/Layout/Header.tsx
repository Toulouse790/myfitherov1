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

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="w-full md:w-auto">
              <input
                type="search"
                placeholder="Rechercher..."
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:w-[200px]"
              />
            </div>
          </div>
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