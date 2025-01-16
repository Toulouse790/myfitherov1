import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/Layout/BottomNav";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

export const RootLayout = () => {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Ne pas afficher la barre de navigation sur les pages admin et pendant une séance
  const isWorkoutSession = location.pathname.includes("/workouts/");
  const showBottomNav = !location.pathname.includes("admin") && !isWorkoutSession;

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Outlet />
      {showBottomNav && <BottomNav />}
      {isWorkoutSession && showScrollTop && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full shadow-lg z-50"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}
      <Toaster />
    </>
  );
};