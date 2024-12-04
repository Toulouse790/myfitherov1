import { useState } from "react";
import { UserProfile as UserProfileType } from "@/types/user";
import { ProfileHeader } from "./ProfileHeader";
import { AppSettings } from "./Sections/AppSettings";
import { AccountActions } from "./Sections/AccountActions";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

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

  return (
    <div className="container mx-auto p-4 space-y-6 pb-24">
      <ProfileHeader profile={profile} />

      <div className="space-y-6">
        <Link to="/training-preferences">
          <div className="p-6 hover:bg-accent/10 rounded-lg transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Préférences d'entraînement</h2>
                <p className="text-sm text-muted-foreground">
                  Objectif, niveau d'activité, équipement disponible
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </Link>

        <div className="p-6 space-y-6 rounded-lg">
          <AppSettings language="Français" />
        </div>

        <div className="p-6 rounded-lg">
          <AccountActions />
        </div>
      </div>
    </div>
  );
};