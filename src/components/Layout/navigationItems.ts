import {
  LayoutDashboard,
  Settings,
} from "lucide-react";

export const navigationItems = [
  {
    title: "Tableau de bord",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    divider: true,
  },
  {
    title: "Admin",
    icon: Settings,
    path: "/admin",
    hidden: true,
  },
];