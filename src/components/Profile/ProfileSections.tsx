
import { UserProfile } from "@/types/user";
import { ProfileStats } from "./Sections/Stats/ProfileStats";
import { Card } from "@/components/ui/card";
import { UserInfo } from "./Sections/UserInfo";
import { ProfileCompletion } from "./Sections/ProfileCompletion";
import { ProfileNavigation } from "./Sections/Navigation/ProfileNavigation";
import { AccountActions } from "./Sections/AccountActions";
import { Separator } from "@/components/ui/separator";
import { MeasurementsSection } from "./Sections/MeasurementsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfileSectionsProps {
  profile: UserProfile;
  refreshProfile: () => void;
}

export const ProfileSections = ({ profile, refreshProfile }: ProfileSectionsProps) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <ProfileStats stats={profile.stats} />
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Mes informations</h3>
            <UserInfo profile={profile} onUpdate={refreshProfile} />
          </Card>
          
          <ProfileCompletion profile={profile} />
          
          <MeasurementsSection />
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-6">
          <ProfileStats stats={profile.stats} detailed />
          {/* Composant futur pour afficher plus de statistiques */}
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <ProfileNavigation isPremium={profile.isPremium} />
          
          <Card className="p-6">
            <AccountActions />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
