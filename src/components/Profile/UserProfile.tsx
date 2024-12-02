import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Trophy, Medal, Star, Dumbbell, Calendar, Settings, Camera } from "lucide-react";
import { UserProfile as UserProfileType } from "@/types/user";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

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
  const nextLevelPoints = 2000;
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const handleAvatarUpload = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "Le changement d'avatar sera bientôt disponible",
    });
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
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="relative h-20 w-20 rounded-full">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile.avatar} alt={profile.username} />
                      <AvatarFallback>{profile.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 rounded-full bg-primary p-1">
                      <Camera className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60">
                  <div className="space-y-2">
                    <h4 className="font-medium">Photo de profil</h4>
                    <Button onClick={handleAvatarUpload} className="w-full">
                      Changer l'avatar
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
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
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
              <Settings className="h-5 w-5" />
            </Button>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Points</p>
                  <p className="font-medium">{profile.stats.points}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Medal className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Badges</p>
                  <p className="font-medium">{profile.achievements.length}</p>
                </div>
              </div>
            </div>

            {/* Préférences */}
            {isEditing && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Préférences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
              </Card>
            )}

            {/* Succès et Badges */}
            <div>
              <h3 className="font-semibold mb-3">Succès et Badges</h3>
              <ScrollArea className="h-[200px]">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex flex-col items-center p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                    >
                      <span className="text-3xl mb-2">{achievement.icon}</span>
                      <span className="font-medium text-sm text-center">{achievement.name}</span>
                      <span className="text-xs text-muted-foreground text-center mt-1">
                        {achievement.description}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};