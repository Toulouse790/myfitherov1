
import { UserProfile } from "@/types/user";
import { ProfileStats } from "./Sections/Stats/ProfileStats";
import { Card } from "@/components/ui/card";
import { UserInfo } from "./Sections/UserInfo";
import { ProfileCompletion } from "./Sections/ProfileCompletion";
import { ProfileNavigation } from "./Sections/Navigation/ProfileNavigation";
import { AccountActions } from "./Sections/AccountActions";
import { MeasurementsSection } from "./Sections/MeasurementsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileSectionsProps {
  profile: UserProfile;
  refreshProfile: () => void;
}

export const ProfileSections = ({ profile, refreshProfile }: ProfileSectionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
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
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Statistiques détaillées</h3>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/stats')}
                className="flex items-center text-primary"
              >
                Voir toutes les statistiques <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <p className="text-muted-foreground mt-1">Accédez à vos performances et à votre progression</p>
          </Card>
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
