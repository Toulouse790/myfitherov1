
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/Language/LanguageSelector";
import { ThemeSelector } from "@/components/Theme/ThemeSelector";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/Theme/useTheme";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { useEffect } from "react";

const Settings = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { preferences, isLoading } = useUserPreferences();

  useEffect(() => {
    // Log pour déboggage
    console.log("Page Settings chargée", { preferences });
  }, [preferences]);

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
            aria-label={t('common.back')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {t('settings.title', { fallback: 'Paramètres' })}
          </h1>
        </div>

        <Card className="p-6 border border-border shadow-sm">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold">
                {t('settings.themeSettings', { fallback: 'Thème' })}
              </h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  {t('settings.theme', { fallback: 'Thème' })}
                </label>
                <Badge variant="outline" className="text-xs font-normal">
                  {theme === 'light' 
                    ? t('theme.lightMode', { fallback: 'Mode clair' }) 
                    : theme === 'dark' 
                      ? t('theme.darkMode', { fallback: 'Mode sombre' }) 
                      : t('theme.systemMode', { fallback: 'Mode système' })}
                </Badge>
              </div>
              <ThemeSelector />
              <p className="text-xs text-muted-foreground mt-1">
                {t('settings.themeDescription', { fallback: 'Choisissez le thème qui vous convient le mieux' })}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border shadow-sm">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold">
                {t('settings.language', { fallback: 'Langue' })}
              </h2>
            </div>
            
            <LanguageSelector />
          </div>
        </Card>

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
