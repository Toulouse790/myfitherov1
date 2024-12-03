import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, LogOut } from "lucide-react";
import { UserProfile as UserProfileType } from "@/types/user";
import { ProfileHeader } from "./ProfileHeader";
import { ThemeSelector } from "@/components/Theme/ThemeSelector";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

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
  achievements: [
    {
      id: "1",
      name: "Premier Pas",
      description: "Compléter votre première séance",
      icon: "🏃",
      unlockedAt: new Date(),
      type: "workout"
    },
    {
      id: "2",
      name: "Série Gagnante",
      description: "7 jours consécutifs d'entraînement",
      icon: "🔥",
      unlockedAt: new Date(),
      type: "streak"
    }
  ],
  isPremium: false
};

export const UserProfile = () => {
  const [profile] = useState<UserProfileType>(mockUserProfile);
  const { toast } = useToast();
  const navigate = useNavigate();

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
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardContent className="pt-6">
          <ProfileHeader profile={profile} />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Compte</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Adresse e-mail</Label>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Notifications</Label>
                <Switch
                  id="notifications"
                  checked={profile.preferences.notifications}
                  onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Thème</Label>
                <ThemeSelector />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Unités</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Unité de mesure</Label>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">Kg (Kilogrammes)</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label>Unité de distance</Label>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">Kilomètres</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Légal</h2>
            <div className="space-y-4">
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => navigate("/terms")}
              >
                Conditions générales
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => navigate("/privacy")}
              >
                Politique de confidentialité
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

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