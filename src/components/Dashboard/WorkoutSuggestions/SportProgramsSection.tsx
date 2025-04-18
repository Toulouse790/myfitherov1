
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const SportProgramsSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleNavigateToSportsPrograms = () => {
    navigate('/sport-programs');
  };

  return (
    <div className="mt-6">
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2 py-2"
        onClick={handleNavigateToSportsPrograms}
      >
        {t('workouts.sportPrograms')}
      </Button>
    </div>
  );
};
