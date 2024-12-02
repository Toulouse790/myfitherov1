import {
  Dumbbell,
  LayoutDashboard,
  Utensils,
  Moon,
  User,
  Settings,
} from "lucide-react";

export const navigationItems = [
  {
    title: "Tableau de bord",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Entraînements",
    icon: Dumbbell,
    path: "/workouts",
  },
  {
    title: "Nutrition",
    icon: Utensils,
    path: "/nutrition",
  },
  {
    title: "Sommeil",
    icon: Moon,
    path: "/sleep",
  },
  {
    divider: true,
  },
  {
    title: "Profil",
    icon: User,
    path: "/profile",
  },
  {
    title: "Admin",
    icon: Settings,
    path: "/admin",
    hidden: true,
  },
];