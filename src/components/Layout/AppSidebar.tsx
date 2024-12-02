import {
  Dumbbell,
  LayoutDashboard,
  Utensils,
  Moon,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
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
    title: "Profil",
    icon: User,
    path: "/profile",
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="z-50">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                    className="w-full md:w-auto"
                  >
                    <Link to={item.path} className="w-full flex items-center gap-2 px-4 py-2">
                      <item.icon className="w-5 h-5" />
                      <span className="block">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}