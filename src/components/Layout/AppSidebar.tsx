import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { navigationItems } from "./navigationItems";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";

export const AppSidebar = () => {
  const location = useLocation();

  return (
    <>
      <SidebarTrigger>
        <button className="fixed top-4 left-4 z-50 md:hidden p-3 rounded-md bg-white border shadow-sm">
          <Menu className="w-8 h-8" />
        </button>
      </SidebarTrigger>
      
      <Sidebar className="z-50 bg-white shadow-md">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="md:block hidden text-gray-900 font-medium text-base px-4 py-2">Menu</SidebarGroupLabel>
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div key={item.path || 'divider'}>
                  {item.divider && <div className="h-px bg-gray-200 my-2" />}
                  {!item.hidden && !item.divider && (
                    <SidebarMenuButton
                      isActive={location.pathname === item.path}
                      tooltip={item.title}
                    >
                      <Link to={item.path} className="flex items-center gap-4 px-4 py-3 w-full text-gray-900">
                        <item.icon className="w-7 h-7 md:w-6 md:h-6" />
                        <span className="hidden md:block text-base font-medium">{item.title}</span>
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