import { useState, useEffect } from "react";
import { UserProfile as UserProfileType } from "@/types/user";
import { ProfileHeader } from "./ProfileHeader";
import { AppSettings } from "./Sections/AppSettings";
import { AccountActions } from "./Sections/AccountActions";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Crown, Dumbbell, User2 } from "lucide-react";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setProfile({
        id: data.id,
        username: data.username || '',
        email: user.email || '',
        avatar: data.avatar_url,
        birthDate: data.birth_date,
        gender: data.gender,
        height: data.height_cm,
        weight: data.weight_kg,
        goals: {
          primary: "maintenance",
          weeklyWorkouts: 4,
          dailyCalories: 2500,
          sleepHours: 8
        },
        preferences: {
          theme: "system",
          language: "fr",
          notifications: true,
          useTutorial: true,
          equipment: []
        },
        stats: {
          workoutsCompleted: 0,
          totalWorkoutMinutes: 0,
          streakDays: 0,
          points: data.points || 0,
          level: data.level || 1
        },
        achievements: [],
        isPremium: false
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user, toast]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <User2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  // Calculate profile completion percentage
  const totalFields = 6;
  let completedFields = 0;
  if (profile.username) completedFields++;
  if (profile.avatar) completedFields++;
  if (profile.birthDate) completedFields++;
  if (profile.gender) completedFields++;
  if (profile.height) completedFields++;
  if (profile.weight) completedFields++;
  
  const completionPercentage = (completedFields / totalFields) * 100;

  return (
    <div className="container mx-auto p-4 space-y-6 pb-24 animate-fade-up">
      <ProfileHeader 
        profile={profile} 
        onProfileUpdate={(updatedProfile) => {
          setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
        }}
      />

      {completionPercentage < 100 && (
        <div className="p-4 bg-card rounded-lg border shadow-sm space-y-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Complétez votre profil</h3>
            <span className="text-sm text-muted-foreground">{Math.round(completionPercentage)}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Complétez votre profil pour débloquer toutes les fonctionnalités
          </p>
        </div>
      )}

      <div className="space-y-4">
        <Card 
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/personal-info')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User2 className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Informations personnelles</h2>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Card>

        <Card 
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/training-preferences')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dumbbell className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Préférences d'entraînement</h2>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Card>

        <Card 
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/subscription')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className={profile.isPremium ? "text-yellow-500" : "text-muted-foreground"} />
              <div>
                <h2 className="text-xl font-semibold">Abonnement</h2>
                <p className="text-sm text-muted-foreground">
                  {profile.isPremium ? "Premium" : "Gratuit"}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Card>

        <Card 
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/app-settings')}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Paramètres de l'application</h2>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-6">
          <AccountActions />
        </Card>
      </div>
    </div>
  );
};