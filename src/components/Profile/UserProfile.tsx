import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { UserProfile as UserProfileType } from "@/types/user";
import { ProfileHeader } from "./ProfileHeader";
import { ColorCustomization } from "./ColorCustomization";
import { ThemeSelector } from "@/components/Theme/ThemeSelector";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

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
          <div className="flex justify-between items-start mb-6">
            <ProfileHeader profile={profile} />
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          {isEditing && (
            <div className="space-y-6">
              <ColorCustomization />
              
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Notifications</Label>
                    <Switch
                      id="notifications"
                      checked={profile.preferences.notifications}
                      onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tutorial">Mode tutoriel</Label>
                    <Switch
                      id="tutorial"
                      checked={profile.preferences.useTutorial}
                      onCheckedChange={(checked) => handlePreferenceChange('tutorial', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Thème</Label>
                    <ThemeSelector />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};