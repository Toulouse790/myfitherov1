
import { User2, Dumbbell, Bell, Crown, Settings, Scale } from "lucide-react";
import { ProfileNavItem } from "./ProfileNavItem";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileNavigationProps {
  isPremium: boolean;
}

export const ProfileNavigation = ({ isPremium }: ProfileNavigationProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold px-1 mb-2">{t('settings.title', { fallback: 'Paramètres' })}</h3>
      
      <ProfileNavItem
        icon={<User2 className="w-6 h-6 text-primary" />}
        title={t('profile.personalInfo', { fallback: 'Informations personnelles' })}
        description={t('profile.manageBasicInfo', { fallback: 'Gérez vos informations de base' })}
        path="/personal-info"
      />

      <ProfileNavItem
        icon={<Dumbbell className="w-6 h-6 text-primary" />}
        title={t('profile.trainingPreferences', { fallback: 'Préférences d\'entraînement' })}
        description={t('profile.equipmentScheduleGoals', { fallback: 'Équipement, horaires et objectifs' })}
        path="/training-preferences"
      />
      
      <ProfileNavItem
        icon={<Bell className="w-6 h-6 text-primary" />}
        title={t('profile.notifications.title', { fallback: 'Notifications' })}
        description={t('profile.manageAppSettings', { fallback: 'Gérez vos paramètres de notifications' })}
        path="/notifications"
      />

      <ProfileNavItem
        icon={<Scale className="w-6 h-6 text-primary" />}
        title={t('profile.bodyMeasurements', { fallback: 'Mesures corporelles' })}
        description={t('profile.trackMeasurements', { fallback: 'Suivez vos mesures dans le temps' })}
        path="/measurements"
      />

      <ProfileNavItem
        icon={<Settings className="w-6 h-6 text-primary" />}
        title={t('settings.title', { fallback: 'Paramètres généraux' })}
        description={t('profile.languageThemePrivacy', { fallback: 'Langue, thème et confidentialité' })}
        path="/settings"
      />

      <ProfileNavItem
        icon={<Crown className={`w-6 h-6 ${isPremium ? "text-yellow-500" : "text-primary"}`} />}
        title={t('profile.subscription', { fallback: 'Abonnement' })}
        description={isPremium ? t('profile.premium', { fallback: 'Premium' }) : t('profile.upgradeToPremium', { fallback: 'Passez à la version Premium' })}
        path="/subscription"
        highlight={!isPremium}
      />
    </div>
  );
};
