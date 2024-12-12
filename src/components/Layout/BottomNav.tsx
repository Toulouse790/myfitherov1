import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Dumbbell, Apple, Moon } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Accueil", path: "/" },
  { icon: Dumbbell, label: "Workouts", path: "/workouts" },
  { icon: Apple, label: "Nutrition", path: "/nutrition" },
  { icon: Moon, label: "Sommeil", path: "/sleep" }
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-6 py-2 z-50">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex flex-col items-center gap-1 w-16 py-1 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs text-center">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};