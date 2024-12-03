import { Link, useLocation } from "react-router-dom";
import { Dumbbell, Calendar, Search, User } from "lucide-react";

const navItems = [
  { icon: Dumbbell, label: "Accueil", path: "/" },
  { icon: Calendar, label: "Flux", path: "/flux" },
  { icon: Search, label: "Rechercher", path: "/search" },
  { icon: User, label: "Profil", path: "/profile" }
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1E2330] border-t border-[#2A2F3F] px-6 py-2">
      <div className="flex justify-between items-center">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className="flex flex-col items-center gap-1"
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              <span className={`text-xs ${isActive ? 'text-white' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};