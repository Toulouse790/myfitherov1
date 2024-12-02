import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Medal, Star, Dumbbell, Calendar } from "lucide-react";
import { UserProfile as UserProfileType } from "@/types/user";

// Exemple de données (à remplacer par les vraies données plus tard)
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
      unlockedAt: new Date()
    }
  ],
  isPremium: false
};

export const UserProfile = () => {
  const [profile] = useState<UserProfileType>(mockUserProfile);
  const nextLevelPoints = 2000; // À calculer dynamiquement

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar} alt={profile.username} />
              <AvatarFallback>{profile.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{profile.username}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">Niveau {profile.stats.level}</Badge>
                {profile.isPremium && (
                  <Badge variant="default">Premium</Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progression */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression niveau {profile.stats.level + 1}</span>
                <span>{profile.stats.points} / {nextLevelPoints} points</span>
              </div>
              <Progress value={(profile.stats.points / nextLevelPoints) * 100} />
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Séances</p>
                  <p className="font-medium">{profile.stats.workoutsCompleted}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Série actuelle</p>
                  <p className="font-medium">{profile.stats.streakDays} jours</p>
                </div>
              </div>
            </div>

            {/* Succès */}
            <div>
              <h3 className="font-semibold mb-3">Succès récents</h3>
              <div className="grid grid-cols-3 gap-2">
                {profile.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex flex-col items-center p-2 rounded-lg bg-muted/50"
                  >
                    <span className="text-2xl mb-1">{achievement.icon}</span>
                    <span className="text-xs text-center">{achievement.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};