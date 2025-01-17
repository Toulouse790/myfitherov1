import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Dumbbell, Apple, Moon, User } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Accueil", path: "/" },
  { icon: Dumbbell, label: "Workouts", path: "/workouts" },
  { icon: Apple, label: "Nutrition", path: "/nutrition" },
  { icon: Moon, label: "Sommeil", path: "/sleep" },
  { icon: User, label: "Profil", path: "/profile" }
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-3 z-50">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${
                  isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">
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