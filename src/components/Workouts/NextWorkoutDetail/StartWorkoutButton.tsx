
import { Button } from "@/components/ui/button";
import { debugLogger } from "@/utils/debug-logger";
import { useLanguage } from "@/contexts/LanguageContext";

interface StartWorkoutButtonProps {
  onClick: () => void;
}

export const StartWorkoutButton = ({ onClick }: StartWorkoutButtonProps) => {
  const { t } = useLanguage();
  
  const handleClick = () => {
    debugLogger.log("StartWorkoutButton", "Bouton Commencer cliqué");
    debugLogger.log("StartWorkoutButton", "Démarrage de la navigation vers la page de session");
    onClick();
  };

  return (
    <div className="flex justify-center">
      <Button 
        className="w-64 bg-gradient-to-r from-primary to-primary hover:opacity-90 transform transition-all duration-300 text-primary-foreground font-bold py-6 text-xl rounded-full shadow-lg hover:shadow-xl"
        onClick={handleClick}
      >
        {t("common.startSession")}
      </Button>
    </div>
  );
};
