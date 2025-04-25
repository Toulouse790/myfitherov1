
import { UserProfile } from "@/types/user";
import { ProfileStats } from "./Sections/Stats/ProfileStats";
import { Card } from "@/components/ui/card";
import { UserInfo } from "./Sections/UserInfo";
import { ProfileCompletion } from "./Sections/ProfileCompletion";
import { ProfileNavigation } from "./Sections/Navigation/ProfileNavigation";
import { AccountActions } from "./Sections/AccountActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileSectionsProps {
  profile: UserProfile;
  refreshProfile: () => void;
}

export const ProfileSections = ({ profile, refreshProfile }: ProfileSectionsProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Fonction pour naviguer vers la page des statistiques
  const handleNavigateToStats = () => {
    console.log("Navigation vers la page des statistiques");
    navigate('/stats', { replace: true });
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="overview">{t("profile.settings.overview")}</TabsTrigger>
          <TabsTrigger value="settings">{t("profile.settings.settings")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Statistiques utilisateur - Uniquement dans l'onglet Aperçu */}
          <ProfileStats stats={profile.stats} />
          
          {/* Informations utilisateur - Uniquement dans l'onglet Aperçu */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t("profile.myInformation")}</h3>
            <UserInfo profile={profile} onUpdate={refreshProfile} />
          </Card>
          
          {/* Complétion du profil - Uniquement dans l'onglet Aperçu */}
          <ProfileCompletion profile={profile} />
          
          {/* Carte pour accéder aux mesures corporelles - Uniquement dans l'onglet Aperçu */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t("profile.stats.detailedTitle")}</h3>
              <Button 
                variant="ghost" 
                onClick={handleNavigateToStats}
                className="flex items-center text-primary"
              >
                {t("common.seeAll")} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <p className="text-muted-foreground mt-1">
              {t("profile.stats.description")}
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          {/* Navigation vers les pages de paramètres - Uniquement dans l'onglet Paramètres */}
          <ProfileNavigation isPremium={profile.isPremium} />
          
          {/* Actions du compte - Uniquement dans l'onglet Paramètres */}
          <Card className="p-6">
            <AccountActions />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
