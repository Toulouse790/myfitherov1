
import { TrainingPreferences as TrainingPreferencesComponent } from "@/components/Profile/Sections/Training/TrainingPreferences";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const TrainingPreferencesPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 sticky top-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-muted"
            aria-label={t('common.back')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{t('profile.training.title')}</h1>
        </div>
        <div className="max-w-2xl mx-auto mt-6">
          <TrainingPreferencesComponent />
        </div>
      </div>
    </div>
  );
};

export default TrainingPreferencesPage;
