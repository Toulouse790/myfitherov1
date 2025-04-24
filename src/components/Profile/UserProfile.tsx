
import { useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useProfileData } from "@/hooks/use-profile-data";
import { LoadingSkeleton } from "./Sections/LoadingSkeleton";
import { EmptyProfile } from "./Sections/EmptyProfile";
import { ProfileSections } from "./ProfileSections";
import { ProfileHeader } from "./ProfileHeader";

export const UserProfile = () => {
  const { user } = useAuth();
  const { profile, loading, setLoading, setProfile, handleProfileUpdate } = useProfileData();

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const { data: questionnaireData } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { data: subscriptionData } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      const { data: progressionData } = await supabase
        .from('user_progression')
        .select('*')
        .eq('user_id', user.id)
        .single();

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
          mainObjective: profileData.main_objective || "maintenance",
          goals: {
            primary: questionnaireData?.objective || profileData.main_objective || "maintenance",
            weeklyWorkouts: questionnaireData?.training_frequency ? parseInt(questionnaireData.training_frequency) : 4,
            dailyCalories: 2500,
            sleepHours: 8
          },
          preferences: {
            theme: "system",
            language: "fr",
            notifications: true,
            useTutorial: true,
            equipment: questionnaireData?.available_equipment || []
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!profile) {
    return <EmptyProfile />;
  }

  return (
    <div className="space-y-6 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="space-y-6"
      >
        <ProfileHeader 
          profile={profile} 
          onProfileUpdate={handleProfileUpdate}
        />
        <ProfileSections 
          profile={profile}
          refreshProfile={fetchProfile}
        />
      </motion.div>
    </div>
  );
};
