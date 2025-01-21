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
        <div className="container flex h-14 items-center">
          <div className="flex items-center">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold text-xl sm:inline-block">
                MyFitHero
              </span>
            </Link>
            <nav className="flex items-center space-x-4">
              {navigationItems.map((item) => (
                !item.admin && (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    {item.title}
                  </Link>
                )
              ))}
            </nav>
          </div>
        </div>
      </header>
      {children && <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>}
    </>
  );
};