
import { User2, Dumbbell, Bell, Crown, Settings } from "lucide-react";
import { ProfileNavItem } from "./ProfileNavItem";

interface ProfileNavigationProps {
  isPremium: boolean;
}

export const ProfileNavigation = ({ isPremium }: ProfileNavigationProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold px-1 mb-2">Paramètres</h3>
      
      <ProfileNavItem
        icon={<User2 className="w-6 h-6 text-primary" />}
        title="Informations personnelles"
        description="Gérez vos informations de base"
        path="/personal-info"
      />

      <ProfileNavItem
        icon={<Dumbbell className="w-6 h-6 text-primary" />}
        title="Préférences d'entraînement"
        description="Équipement, horaires et objectifs"
        path="/training-preferences"
      />
      
      <ProfileNavItem
        icon={<Bell className="w-6 h-6 text-primary" />}
        title="Notifications et préférences"
        description="Gérez vos paramètres d'application"
        path="/app-settings"
      />

      <ProfileNavItem
        icon={<Crown className={`w-6 h-6 ${isPremium ? "text-yellow-500" : "text-primary"}`} />}
        title="Abonnement"
        description={isPremium ? "Premium" : "Passez à la version Premium"}
        path="/subscription"
        highlight={!isPremium}
      />
    </div>
  );
};
