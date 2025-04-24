
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
import { UserInfo } from "./Sections/UserInfo";
import { Separator } from "@/components/ui/separator";
import { LanguageSelector } from "@/components/Language/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

export const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Fetch questionnaire data to ensure we have the most up-to-date information
      const { data: questionnaireData, error: questionnaireError } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Combine questionnaire data with profile if available
      const combinedProfileData = {
        ...profileData,
        ...(questionnaireData && {
          gender: questionnaireData.gender || profileData.gender,
          height: questionnaireData.height || profileData.height_cm,
          weight: questionnaireData.weight || profileData.weight_kg,
          mainObjective: questionnaireData.objective || profileData.main_objective
        })
      };

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
          mainObjective: profileData.main_objective || "maintenance",
          goals: {
            primary: combinedProfileData.mainObjective || "maintenance",
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
      toast({
        title: t("common.error", { fallback: "Erreur" }),
        description: t("profile.unavailable", { fallback: "Impossible de charger le profil" }),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user, toast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </Card>
        <Card className="p-6">
          <Skeleton className="h-4 w-48 mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full mt-2" />
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <User2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {t("profile.unavailable", { fallback: "Profil non disponible" })}
          </p>
        </div>
      </div>
    );
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
          onProfileUpdate={(updatedProfile) => {
            setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
            fetchProfile();
          }}
        />

        <ProfileStats stats={profile.stats} />
        
        <Card className="p-6 overflow-hidden">
          <h3 className="text-lg font-semibold mb-4">
            {t("profile.myInformation", { fallback: "Mes informations" })}
          </h3>
          <UserInfo profile={profile} onUpdate={fetchProfile} />
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("settings.language", { fallback: "Langue" })}
          </h3>
          <LanguageSelector />
        </Card>
        
        <ProfileCompletion profile={profile} />

        <Separator className="my-6" />

        <ProfileNavigation isPremium={profile.isPremium} />

        <Card className="p-6">
          <AccountActions />
        </Card>
      </motion.div>
    </div>
  );
};
