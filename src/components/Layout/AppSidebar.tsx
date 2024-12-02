import {
  Dumbbell,
  LayoutDashboard,
  Utensils,
  Moon,
  User,
  Menu,
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
  SidebarTrigger,
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
    <>
      <SidebarTrigger asChild className="fixed top-4 left-4 z-50 md:hidden">
        <button className="p-2 rounded-md bg-background border">
          <Menu className="w-6 h-6" />
        </button>
      </SidebarTrigger>
      
      <Sidebar className="z-50">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="md:block hidden">Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.path}
                      tooltip={item.title}
                      className="w-full"
                    >
                      <Link to={item.path} className="flex items-center gap-2 px-2 py-2 md:px-4">
                        <item.icon className="w-5 h-5" />
                        <span className="hidden md:block">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}