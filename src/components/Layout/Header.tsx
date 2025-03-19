
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { navigationItems } from "./navigationItems";

interface HeaderProps {
  children?: React.ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
  const { user } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl text-primary">MyFitHero</span>
            </Link>
            <span className="text-sm text-muted-foreground">Votre bien-être, notre priorité</span>
          </div>
          
          {user && (
            <div className="hidden md:flex items-center gap-4">
              {navigationItems.map((item) => (
                <Link 
                  key={item.href}
                  to={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>
      {children && <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>}
    </>
  );
};
