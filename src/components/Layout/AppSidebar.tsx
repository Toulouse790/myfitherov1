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
      <SidebarTrigger>
        <button className="fixed top-4 left-4 z-50 md:hidden p-3 rounded-md bg-white border shadow-sm">
          <Menu className="w-7 h-7" />
        </button>
      </SidebarTrigger>
      
      <Sidebar className="z-50 bg-white shadow-md">
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
                    >
                      <Link to={item.path} className="flex items-center gap-3 px-3 py-3 md:px-4 w-full">
                        <item.icon className="w-6 h-6 md:w-5 md:h-5" />
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