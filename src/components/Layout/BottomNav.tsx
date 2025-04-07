
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Dumbbell, Apple, ChartBar, User } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Accueil", path: "/" },
  { icon: Dumbbell, label: "Workouts", path: "/workouts" },
  { icon: ChartBar, label: "Stats", path: "/stats" },
  { icon: Apple, label: "Nutrition", path: "/nutrition" },
  { icon: User, label: "Profil", path: "/profile" }
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-2 sm:px-4 bottom-nav z-50">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                            (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 py-2 px-1 sm:px-3 rounded-lg transition-colors ${
                  isActive 
                  ? 'text-primary bg-gray-100 dark:bg-gray-800' 
                  : 'text-muted-foreground'
                }`}
              >
                <Icon className="bottom-nav-icon" />
                <span className="bottom-nav-text">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
