
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Dumbbell, Moon, User, Apple } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const BottomNav = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { icon: LayoutDashboard, label: t("common.home", { fallback: "Accueil" }), path: "/" },
    { icon: Dumbbell, label: t("workouts.title", { fallback: "Entraînements" }), path: "/workouts" },
    { icon: Moon, label: t("sleep.title", { fallback: "Sommeil" }), path: "/sleep" },
    { icon: Apple, label: t("nutrition.title", { fallback: "Nutrition" }), path: "/nutrition" },
    { icon: User, label: t("profile.title", { fallback: "Profil" }), path: "/profile" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-1 sm:px-2 md:px-4 bottom-nav z-50">
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
                className={`flex flex-col items-center gap-0.5 py-1 sm:py-2 px-0.5 sm:px-1 md:px-3 rounded-lg transition-colors ${
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
};
