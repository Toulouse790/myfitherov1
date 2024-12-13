import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/Layout/BottomNav";

export const RootLayout = () => {
  const location = useLocation();
  const showBottomNav = !location.pathname.includes("admin");

  return (
    <>
      <Outlet />
      {showBottomNav && <BottomNav />}
      <Toaster />
    </>
  );
};