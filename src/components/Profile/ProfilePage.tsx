
import { useEffect, useState } from "react";
import { UserProfile as UserProfileType } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { User2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ProfileHeader } from "./Sections/ProfileHeader";
import { ProfileSections } from "./ProfileSections";
import { ProfileSkeleton } from "./Sections/ProfileSkeleton";
import { useUserProfileData } from "@/hooks/use-user-profile";

export const ProfilePage = () => {
  const { profile, loading, error, refreshProfile } = useUserProfileData();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <User2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Profil non disponible</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="space-y-6 pb-24"
    >
      <ProfileHeader 
        profile={profile} 
        onProfileUpdate={(updatedProfile) => {
          refreshProfile();
        }}
      />
      
      <ProfileSections profile={profile} refreshProfile={refreshProfile} />
    </motion.div>
  );
};
