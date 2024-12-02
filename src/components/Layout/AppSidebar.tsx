import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { navigationItems } from "./navigationItems";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenuButton, SidebarTrigger, useSidebarContext } from "@/components/ui/sidebar";

export const AppSidebar = () => {
  const location = useLocation();
  const { isOpen } = useSidebarContext();

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
            <SidebarGroupLabel className="md:block hidden text-gray-900 font-medium">Menu</SidebarGroupLabel>
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div key={item.path}>
                  {item.divider && <div className="h-px bg-gray-200 my-2" />}
                  {!item.hidden && (
                    <SidebarMenuButton
                      isActive={location.pathname === item.path}
                      tooltip={item.title}
                    >
                      <Link to={item.path} className="flex items-center gap-3 px-3 py-3 md:px-4 w-full text-gray-900">
                        <item.icon className="w-6 h-6 md:w-5 md:h-5" />
                        <span className="hidden md:block font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </div>
              );
            })}
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
};