import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useWelcomeToast = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    
    if (!hasSeenWelcome) {
      toast({
        title: "Bienvenue sur MyFitHero",
        description: "Suivez vos progrès et atteignez vos objectifs fitness.",
        className: "bg-gradient-to-r from-primary to-secondary text-white",
        duration: 2000,
      });
      
      localStorage.setItem("hasSeenWelcome", "true");
    }
  }, [toast]);
};