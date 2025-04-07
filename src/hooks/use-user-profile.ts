
import { useState, useEffect } from "react";
import { UserProfile } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/components/ui/use-toast";
import { debugLogger } from "@/utils/debug-logger";

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
      debugLogger.log("useUserProfileData", "Initialisation des données utilisateur pour ID:", user.id);
      
      // 1. Vérifier et créer le profil utilisateur si nécessaire
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.log("Profil non trouvé, création d'un nouveau profil");
        
        // Créer le profil s'il n'existe pas
        const { data: newProfileData, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: user.email?.split('@')[0] || user.id.slice(0, 8),
            email: user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            level: 1,
            points: 0,
            meal_notifications: true,
            reminder_time: 30
          })
          .select('*')
          .single();
          
        if (createError) {
          throw new Error(`Erreur lors de la création du profil: ${createError.message}`);
        }
        
        debugLogger.log("useUserProfileData", "Nouveau profil créé:", newProfileData);
        
        // Utiliser les nouvelles données du profil
        const userData = newProfileData;

        // 2. Initialiser la progression utilisateur
        await initializeProgression(user.id);
        
        // 3. Initialiser les préférences utilisateur
        await initializePreferences(user.id);
        
        // 4. Initialiser les streaks utilisateur
        await initializeStreaks(user.id);

        // Construire l'objet de profil utilisateur avec les données par défaut
        const userProfile: UserProfile = buildUserProfile(userData, null, null);
        setProfile(userProfile);
      } else {
        debugLogger.log("useUserProfileData", "Profil existant trouvé:", profileData);

        // Vérifier que toutes les tables associées existent
        const progressionData = await ensureProgressionExists(user.id);
        const preferencesData = await ensurePreferencesExists(user.id);
        await ensureStreaksExist(user.id);
        
        // Récupérer les dernières réponses du questionnaire
        const { data: questionnaireData } = await supabase
          .from('questionnaire_responses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Vérifier le statut d'abonnement premium
        const { data: subscriptionData } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        const isPremium = subscriptionData?.subscription_type === 'premium' && 
                          subscriptionData?.status === 'active' &&
                          (subscriptionData?.end_date ? new Date(subscriptionData.end_date) > new Date() : true);

        // Construire l'objet de profil utilisateur avec toutes les données
        const userProfile = buildUserProfile(profileData, questionnaireData, progressionData, isPremium);
        setProfile(userProfile);
      }

      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération du profil:', err);
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      toast({
        title: "Erreur de données",
        description: "Impossible de charger votre profil. Veuillez rafraîchir la page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonctions auxiliaires pour initialiser les données

  const initializeProgression = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_progression')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        const { error: insertError } = await supabase
          .from('user_progression')
          .insert([{
            user_id: userId,
            total_points: 10,
            current_level: 1,
            workout_points: 0,
            nutrition_points: 0,
            sleep_points: 0,
            next_level_threshold: 100,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (insertError) throw insertError;
        
        debugLogger.log("useUserProfileData", "Données de progression initialisées");
      }
      
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la progression:", error);
      throw error;
    }
  };

  const initializePreferences = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        const { error: insertError } = await supabase
          .from('user_preferences')
          .insert([{
            user_id: userId,
            notifications_enabled: true,
            measurement_unit: 'metric',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (insertError) throw insertError;
        
        debugLogger.log("useUserProfileData", "Préférences utilisateur initialisées");
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation des préférences:", error);
    }
  };

  const initializeStreaks = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .eq('streak_type', 'workout');

      if (error) throw error;
      
      if (!data || data.length === 0) {
        const { error: insertError } = await supabase
          .from('user_streaks')
          .insert([{
            user_id: userId,
            streak_type: 'workout',
            current_streak: 0,
            longest_streak: 0,
            created_at: new Date().toISOString()
          }]);

        if (insertError) throw insertError;
        
        debugLogger.log("useUserProfileData", "Streaks utilisateur initialisés");
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation des streaks:", error);
    }
  };

  // Fonctions pour vérifier et assurer l'existence des données

  const ensureProgressionExists = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_progression')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        return await initializeProgression(userId);
      }
      
      return data[0];
    } catch (error) {
      console.error("Erreur lors de la vérification de progression:", error);
      return null;
    }
  };

  const ensurePreferencesExists = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        await initializePreferences(userId);
      }
      
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Erreur lors de la vérification des préférences:", error);
      return null;
    }
  };

  const ensureStreaksExist = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        await initializeStreaks(userId);
      }
      
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Erreur lors de la vérification des streaks:", error);
      return null;
    }
  };

  // Fonction pour construire l'objet de profil utilisateur
  const buildUserProfile = (
    profileData: any,
    questionnaireData: any | null,
    progressionData: any | null,
    isPremium: boolean = false
  ): UserProfile => {
    return {
      id: profileData.id,
      username: profileData.username || '',
      email: profileData.email || user?.email || '',
      avatar: profileData.avatar_url,
      birthDate: profileData.birth_date,
      gender: profileData.gender || 'male',
      height: profileData.height_cm || (questionnaireData?.height ? Number(questionnaireData.height) : 170),
      weight: profileData.weight_kg || (questionnaireData?.weight ? Number(questionnaireData.weight) : 70),
      mainObjective: profileData.main_objective || questionnaireData?.objective || "maintenance",
      goals: {
        primary: profileData.main_objective || questionnaireData?.objective || "maintenance",
        weeklyWorkouts: questionnaireData?.training_frequency 
          ? parseInt(questionnaireData.training_frequency) 
          : 4,
        dailyCalories: 2500,
        sleepHours: 8
      },
      preferences: {
        theme: "system",
        language: "fr",
        notifications: true,
        useTutorial: true,
        equipment: questionnaireData?.available_equipment || profileData.available_equipment || []
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
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  return { 
    profile, 
    loading, 
    error,
    refreshProfile: fetchProfile
  };
};
