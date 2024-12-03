import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, LogOut, User, Bell, Moon, Sun, Languages } from "lucide-react";
import { UserProfile as UserProfileType } from "@/types/user";
import { ProfileHeader } from "./ProfileHeader";
import { ThemeSelector } from "@/components/Theme/ThemeSelector";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { ColorCustomization } from "./ColorCustomization";

const mockUserProfile: UserProfileType = {
  id: "1",
  username: "John Doe",
  email: "john@example.com",
  avatar: "/placeholder.svg",
  goals: {
    primary: "muscle_gain",
    weeklyWorkouts: 4,
    dailyCalories: 2500,
    sleepHours: 8
  },
  preferences: {
    theme: "system",
    language: "fr",
    notifications: true,
    useTutorial: true,
    equipment: ["haltères", "tapis"]
  },
  stats: {
    workoutsCompleted: 48,
    totalWorkoutMinutes: 1440,
    streakDays: 7,
    points: 1250,
    level: 5
  },
  achievements: [],
  isPremium: false
};

export const UserProfile = () => {
  const [profile] = useState<UserProfileType>(mockUserProfile);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("Français");

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
      return;
    }
    navigate("/signin");
  };

  const handlePreferenceChange = (preference: string, value: boolean) => {
    toast({
      title: "Préférence mise à jour",
      description: `${preference} a été ${value ? 'activé' : 'désactivé'}`,
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6 pb-24">
      <Card>
        <CardContent className="pt-6">
          <ProfileHeader profile={profile} />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Préférences d'entraînement</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Niveau</p>
                    <p className="text-sm text-muted-foreground">Intermédiaire</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-sm text-muted-foreground">Rappels d'entraînement</p>
                  </div>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={(checked) => {
                    setNotifications(checked);
                    handlePreferenceChange("Notifications", checked);
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Paramètres de l'application</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <div>
                    <p className="font-medium">Mode sombre</p>
                    <p className="text-sm text-muted-foreground">Changer l'apparence</p>
                  </div>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={(checked) => {
                    setDarkMode(checked);
                    handlePreferenceChange("Mode sombre", checked);
                  }}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Languages className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Langue</p>
                    <p className="text-sm text-muted-foreground">{language}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Thème</p>
                  <p className="text-sm text-muted-foreground">Personnaliser les couleurs</p>
                </div>
                <ThemeSelector />
              </div>
            </div>
          </CardContent>
        </Card>

        <ColorCustomization />

        <div className="space-y-4">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
          </Button>
          <Button
            variant="ghost"
            className="w-full text-destructive hover:text-destructive"
            onClick={() => {
              toast({
                title: "Attention",
                description: "Cette action est irréversible. Contactez le support pour supprimer votre compte.",
                variant: "destructive",
              });
            }}
          >
            Supprimer le compte
          </Button>
        </div>
      </div>
    </div>
  );
};