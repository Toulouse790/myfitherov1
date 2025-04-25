
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { AppSettings } from "@/components/Profile/Sections/AppSettings";
import { debugLogger } from "@/utils/debug-logger";
import { useState, useEffect } from "react";
import { useUserPreferences } from "@/hooks/use-user-preferences";

const Settings = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { preferences, isLoading } = useUserPreferences();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Log lors du chargement initial
    debugLogger.log("Settings", "Settings page loaded");
    
    // Un court délai pour s'assurer que les préférences sont chargées
    const timer = setTimeout(() => {
      setPageLoading(false);
      debugLogger.log("Settings", "Settings page ready", { 
        preferences: preferences || "No preferences yet",
        loading: isLoading
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, [preferences, isLoading]);

  // État de chargement
  if (isLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="container max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-muted"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">
              {t('settings.title', { fallback: 'Paramètres' })}
            </h1>
          </div>
          
          <div className="animate-pulse space-y-8">
            <div className="h-16 bg-muted rounded"></div>
            <div className="h-48 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24"
      >
        <div className="flex items-center gap-4 sticky top-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-muted"
            aria-label={t('common.back', { fallback: 'Retour' })}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {t('settings.title', { fallback: 'Paramètres' })}
          </h1>
        </div>

        {/* Paramètres de l'application */}
        <Card className="p-6 border border-border shadow-sm">
          <AppSettings />
        </Card>

        {/* Confidentialité */}
        <Card className="p-6 border border-border shadow-sm">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold">
                {t('settings.privacy', { fallback: 'Confidentialité' })}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('settings.privacyPolicy', { fallback: 'Politique de confidentialité' })}
              </p>
            </div>
          </div>
        </Card>

        {/* Suppression de compte */}
        <Card className="p-6 border border-border shadow-sm mb-16">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold text-destructive">
                {t('settings.deleteAccount', { fallback: 'Supprimer le compte' })}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('settings.deleteAccountDescription', { fallback: 'Supprimer définitivement votre compte' })}
              </p>
            </div>
            
            <Button variant="destructive">
              {t('settings.deleteAccount', { fallback: 'Supprimer le compte' })}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Settings;
