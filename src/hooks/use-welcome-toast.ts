import { useEffect } from "react";
import { useToast } from "./use-toast";
import { useLocalStorage } from "./use-local-storage";

export const useWelcomeToast = () => {
  const { toast } = useToast();
  const [hasSeenWelcome, setHasSeenWelcome] = useLocalStorage("has-seen-welcome", false);

  useEffect(() => {
    if (!hasSeenWelcome) {
      toast({
        title: "Bienvenue sur HealthSync",
        description: "Suivez vos progrès et atteignez vos objectifs fitness.",
        duration: 2000,
        className: "animate-fade-up bg-gradient-to-br from-primary/80 to-secondary/80 text-white border-none",
      });
      setHasSeenWelcome(true);
    }
  }, [hasSeenWelcome, setHasSeenWelcome, toast]);
};