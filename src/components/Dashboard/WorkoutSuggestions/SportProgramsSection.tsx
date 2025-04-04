
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const SportProgramsSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleNavigateToSportsPrograms = () => {
    navigate('/workouts');
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">{t('workouts.sportPrograms')}</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={handleNavigateToSportsPrograms}
        >
          <Users size={16} />
          {t('workouts.teamSports')}
        </Button>
      </div>
      <div className="border rounded-md p-4 bg-muted/10">
        <p className="text-sm text-muted-foreground mb-3">
          {t('workouts.sportSpecificDescription')}
        </p>
        <Button 
          variant="default" 
          className="w-full"
          onClick={handleNavigateToSportsPrograms}
        >
          {t('common.view')}
        </Button>
      </div>
    </div>
  );
};
