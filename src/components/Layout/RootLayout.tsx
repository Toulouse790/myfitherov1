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
      setShowScrollTop(window.scrollY > 100); // Reduced threshold to show button earlier
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
          size="lg"
          className="fixed bottom-20 right-4 rounded-full shadow-xl z-50 p-3 bg-primary hover:bg-primary/90"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-6 w-6 text-primary-foreground" />
        </Button>
      )}
      <Toaster />
    </>
  );
};