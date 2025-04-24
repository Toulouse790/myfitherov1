
import { useState } from "react";
import { UserProfile } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export const useProfileData = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleProfileUpdate = (updatedProfile: Partial<UserProfile>) => {
    setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
  };

  return {
    profile,
    loading,
    setLoading,
    setProfile,
    handleProfileUpdate
  };
};
