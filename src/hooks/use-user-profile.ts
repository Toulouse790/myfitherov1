
import { useState, useEffect } from "react";
import { UserProfile } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const useUserProfileData = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log("Fetching profile for user ID:", user.id);
      
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        // Si le profil n'existe pas, on tente de le créer
        if (profileError.code === 'PGRST116') {
          console.log("Profile not found, creating a new one");
          const { data: newProfileData, error: createProfileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              username: user.email?.split('@')[0] || user.id.slice(0, 8),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select('*')
            .single();
            
          if (createProfileError) {
            throw createProfileError;
          }
          
          console.log("New profile created:", newProfileData);
          // Utiliser les données du nouveau profil
          profileData = newProfileData;
        } else {
          throw profileError;
        }
      }

      // Fetch questionnaire data to ensure we have the most up-to-date information
      const { data: questionnaireData, error: questionnaireError } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (questionnaireError && questionnaireError.code !== 'PGRST116') {
        console.log("No questionnaire data found, this is ok for new users");
      }

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
        console.error("Subscription error:", subscriptionError);
      }

      // Fetch progression data (points & level)
      const { data: progressionData, error: progressionError } = await supabase
        .from('user_progression')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (progressionError) {
        if (progressionError.code === 'PGRST116') {
          console.log("No progression data found, creating default progression");
          const { data: newProgressionData, error: createProgressionError } = await supabase
            .from('user_progression')
            .insert({
              user_id: user.id,
              total_points: 0,
              current_level: 1,
              next_level_threshold: 100,
              workout_points: 0,
              nutrition_points: 0,
              sleep_points: 0
            })
            .select('*')
            .single();
            
          if (createProgressionError) {
            console.error("Error creating progression data:", createProgressionError);
          } else {
            console.log("New progression data created:", newProgressionData);
            progressionData = newProgressionData;
          }
        } else {
          console.error('Error fetching progression data:', progressionError);
        }
      }

      const isPremium = subscriptionData?.subscription_type === 'premium' && 
                       subscriptionData?.status === 'active' &&
                       (subscriptionData?.end_date ? new Date(subscriptionData.end_date) > new Date() : true);

      if (profileData) {
        const userProfile: UserProfile = {
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
        };
        
        console.log("User profile constructed:", userProfile);
        setProfile(userProfile);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return { 
    profile, 
    loading, 
    error,
    refreshProfile: fetchProfile
  };
};
