import { useState, useEffect } from "react";
import { UserProfile as UserProfileType } from "@/types/user";
import { ProfileHeader } from "./ProfileHeader";
import { AppSettings } from "./Sections/AppSettings";
import { AccountActions } from "./Sections/AccountActions";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Crown, Dumbbell, User2, Trophy, Target, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

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
            points: profileData.points || 0,
            level: profileData.level || 1
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
          }}
        />

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{profile.stats.level}</p>
            <p className="text-sm text-muted-foreground">Niveau</p>
          </Card>
          <Card className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{profile.stats.points}</p>
            <p className="text-sm text-muted-foreground">Points</p>
          </Card>
          <Card className="p-4 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{profile.stats.streakDays}</p>
            <p className="text-sm text-muted-foreground">Jours consécutifs</p>
          </Card>
        </div>

        {completionPercentage < 100 && (
          <Card className="p-6 border-2 border-primary/10 bg-primary/5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">Complétez votre profil</h3>
                  <p className="text-sm text-muted-foreground">
                    Un profil complet vous permet d'obtenir des recommandations personnalisées
                  </p>
                </div>
                <span className="text-xl font-bold text-primary">
                  {Math.round(completionPercentage)}%
                </span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </Card>
        )}

        <div className="space-y-4">
          <Card 
            className="p-6 hover:shadow-md transition-all cursor-pointer group"
            onClick={() => navigate('/personal-info')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <User2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Informations personnelles</h2>
                  <p className="text-sm text-muted-foreground">
                    Gérez vos informations de base
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

          <Card 
            className="p-6 hover:shadow-md transition-all cursor-pointer group"
            onClick={() => navigate('/training-preferences')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Dumbbell className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Préférences d'entraînement</h2>
                  <p className="text-sm text-muted-foreground">
                    Équipement, horaires et objectifs
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

          <Card 
            className="p-6 hover:shadow-md transition-all cursor-pointer group"
            onClick={() => navigate('/subscription')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Crown className={`w-6 h-6 ${profile.isPremium ? "text-yellow-500" : "text-primary"}`} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Abonnement</h2>
                  <p className="text-sm text-muted-foreground">
                    {profile.isPremium ? "Premium" : "Passez à la version Premium"}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

          <Card className="p-6">
            <AccountActions />
          </Card>
        </div>
      </motion.div>
    </div>
  );
};