import { useState, useEffect } from "react";
import { UserProfile as UserProfileType } from "@/types/user";
import { ProfileHeader } from "./ProfileHeader";
import { AppSettings } from "./Sections/AppSettings";
import { AccountActions } from "./Sections/AccountActions";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ChevronRight, Crown } from "lucide-react";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
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

    fetchProfile();
  }, [user, toast]);

  if (!profile) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6 pb-24">
      <ProfileHeader 
        profile={profile} 
        onProfileUpdate={(updatedProfile) => {
          setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
        }}
      />

      <div className="space-y-6">
        {/* Subscription Status */}
        <div className="p-6 hover:bg-accent/10 rounded-lg transition-colors">
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
              <Button variant="default" onClick={() => {
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