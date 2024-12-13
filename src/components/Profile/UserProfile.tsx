import { useState, useEffect } from "react";
import { UserProfile as UserProfileType } from "@/types/user";
import { ProfileHeader } from "./ProfileHeader";
import { AppSettings } from "./Sections/AppSettings";
import { AccountActions } from "./Sections/AccountActions";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ChevronRight, Crown, Dumbbell, User2 } from "lucide-react";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { ProfileForm } from "./Sections/ProfileForm";
import { Progress } from "@/components/ui/progress";

export const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

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
          primary: "general_fitness",
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
  const totalFields = 6; // username, avatar, birthDate, gender, height, weight
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
        {/* Informations personnelles */}
        <div className="p-6 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
          <ProfileForm
            initialData={{
              birth_date: profile.birthDate,
              gender: profile.gender,
              height_cm: profile.height,
              weight_kg: profile.weight,
            }}
            onUpdate={fetchProfile}
          />
        </div>

        {/* Subscription Status */}
        <div className="p-6 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow">
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
            {!profile.isPremium && (
              <Button variant="default" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white" onClick={() => {
                toast({
                  title: "Bientôt disponible",
                  description: "L'abonnement premium sera bientôt disponible !",
                });
              }}>
                Passer Premium
              </Button>
            )}
          </div>
        </div>

        <Link to="/training-preferences">
          <div className="p-6 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Dumbbell className="text-primary group-hover:text-primary/80 transition-colors" />
                <div>
                  <h2 className="text-xl font-semibold">Préférences d'entraînement</h2>
                  <p className="text-sm text-muted-foreground">
                    Objectif, niveau d'activité, équipement disponible
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <div className="p-6 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow space-y-6">
          <AppSettings language="Français" />
        </div>

        <div className="p-6 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow">
          <AccountActions />
        </div>
      </div>
    </div>
  );
};