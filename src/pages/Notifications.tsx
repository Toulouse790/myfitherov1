
import { Header } from "@/components/Layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { useState, useEffect } from "react";

const Notifications = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { preferences, updatePreferences, isLoading } = useUserPreferences();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (preferences) {
      setNotificationsEnabled(preferences.notifications_enabled);
    }
  }, [preferences]);

  const handleNotificationsToggle = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    updatePreferences({ notifications_enabled: enabled });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container max-w-4xl mx-auto px-4 py-6 space-y-6"
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
            {t('profile.notifications.title', { fallback: 'Notifications' })}
          </h1>
        </div>

        <Card className="p-6 space-y-6">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">
                    {t('profile.notifications.pushEnabled', { fallback: 'Activer les notifications push' })}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t('profile.notifications.pushDescription', { fallback: 'Recevez des notifications sur votre appareil' })}
                  </p>
                </div>
                <Switch 
                  checked={notificationsEnabled}
                  onCheckedChange={handleNotificationsToggle}
                />
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default Notifications;
