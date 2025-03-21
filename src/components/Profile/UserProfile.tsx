
import { useState, useEffect } from "react";
import { UserProfile as UserProfileType } from "@/types/user";
import { ProfileHeader } from "./ProfileHeader";
import { AccountActions } from "./Sections/AccountActions";
import { useToast } from "@/hooks/use-toast";
import { User2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ProfileStats } from "./Sections/Stats/ProfileStats";
import { ProfileCompletion } from "./Sections/ProfileCompletion";
import { ProfileNavigation } from "./Sections/Navigation/ProfileNavigation";

export const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Fetch subscription status
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        // PGRST116 means no rows found, which is expected for free users
        throw subscriptionError;
      }

      // Fetch progression data (points & level)
      const { data: progressionData, error: progressionError } = await supabase
        .from('user_progression')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (progressionError && progressionError.code !== 'PGRST116') {
        console.error('Error fetching progression data:', progressionError);
      }

      const isPremium = subscriptionData?.subscription_type === 'premium' && 
                       subscriptionData?.status === 'active' &&
                       (subscriptionData?.end_date ? new Date(subscriptionData.end_date) > new Date() : true);

      if (profileData) {
        setProfile({
          id: profileData.id,
          username: profileData.username || '',
          email: user.email || '',
          avatar: profileData.avatar_url,
          birthDate: profileData.birth_date,
          gender: profileData.gender,
          height: profileData.height_cm,
          weight: profileData.weight_kg,
          goals: {
            primary: profileData.main_objective || "maintenance",
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
            workoutsCompleted: progressionData?.workout_count || 0,
            totalWorkoutMinutes: progressionData?.total_workout_minutes || 0,
            streakDays: progressionData?.current_streak || 0,
            points: progressionData?.total_points || profileData.points || 0,
            level: progressionData?.current_level || profileData.level || 1
          },
          achievements: [],
          isPremium: isPremium
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil",
        variant: "destructive",
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

  return (
    <div className="container mx-auto p-4 space-y-6 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <ProfileHeader 
          profile={profile} 
          onProfileUpdate={(updatedProfile) => {
            setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
            fetchProfile(); // Refresh all profile data after update
          }}
        />

        <ProfileStats stats={profile.stats} />
        
        <ProfileCompletion profile={profile} />

        <ProfileNavigation isPremium={profile.isPremium} />

        <Card className="p-6">
          <AccountActions />
        </Card>
      </motion.div>
    </div>
  );
};
