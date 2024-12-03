import { useState } from "react";
import { UserProfile as UserProfileType } from "@/types/user";
import { ProfileHeader } from "./ProfileHeader";
import { TrainingPreferences } from "./Sections/TrainingPreferences";
import { AppSettings } from "./Sections/AppSettings";
import { AccountActions } from "./Sections/AccountActions";
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
  achievements: [],
  isPremium: false
};

export const UserProfile = () => {
  const [profile] = useState<UserProfileType>(mockUserProfile);
  const [notifications, setNotifications] = useState(true);
  const { toast } = useToast();

  const handlePreferenceChange = (preference: string, value: boolean) => {
    toast({
      title: "Préférence mise à jour",
      description: `${preference} a été ${value ? 'activé' : 'désactivé'}`,
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6 pb-24">
      <ProfileHeader profile={profile} />

      <div className="space-y-6">
        <TrainingPreferences
          notifications={notifications}
          onNotificationsChange={(checked) => {
            setNotifications(checked);
            handlePreferenceChange("Notifications", checked);
          }}
        />

        <AppSettings language="Français" />

        <AccountActions />
      </div>
    </div>
  );
};