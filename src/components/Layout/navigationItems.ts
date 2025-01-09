import { Home, Dumbbell, User, Pizza, Moon, ChartBar, FolderOpen } from "lucide-react";

export const navigationItems = [
  {
    title: "Accueil",
    href: "/",
    icon: Home,
  },
  {
    title: "Entraînements",
    href: "/entrainements",
    icon: Dumbbell,
  },
  {
    title: "Nutrition",
    href: "/nutrition",
    icon: Pizza,
  },
  {
    title: "Sommeil",
    href: "/sleep",
    icon: Moon,
  },
  {
    title: "Statistiques",
    href: "/stats",
    icon: ChartBar,
  },
  {
    title: "Admin",
    href: "/admin",
    icon: FolderOpen,
    admin: true,
    children: [
      {
        title: "Tableau de bord",
        href: "/admin",
      },
      {
        title: "Gestion des médias",
        href: "/admin/media",
      }
    ]
  },
  {
    title: "Profil",
    href: "/profile",
    icon: User,
  },
];