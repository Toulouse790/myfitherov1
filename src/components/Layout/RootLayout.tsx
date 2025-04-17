
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/Layout/BottomNav";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

export const RootLayout = () => {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Ne pas afficher la barre de navigation pendant une séance active (session ou start)
  const isWorkoutSession = location.pathname.includes("/workouts/session/") || 
                          location.pathname.includes("/workouts/start/");
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
    <div className={`min-h-screen ${showBottomNav ? 'pb-12 sm:pb-14 md:pb-16' : ''}`}>
      <Outlet />
      {showBottomNav && <BottomNav />}
      {showScrollTop && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-14 sm:bottom-16 md:bottom-20 right-2 sm:right-3 md:right-4 rounded-full shadow-lg z-50 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-primary hover:bg-primary/90"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary-foreground" />
        </Button>
      )}
      <Toaster />
    </div>
  );
};

export default RootLayout;
