
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
      setShowScrollTop(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`min-h-screen ${showBottomNav ? 'pb-14 sm:pb-16' : ''}`}>
      <Outlet />
      {showBottomNav && <BottomNav />}
      {showScrollTop && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-16 sm:bottom-20 right-4 rounded-full shadow-lg z-50 w-8 h-8 sm:w-10 sm:h-10 bg-primary hover:bg-primary/90"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
        </Button>
      )}
      <Toaster />
    </div>
  );
};

export default RootLayout;
