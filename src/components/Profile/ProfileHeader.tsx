
import { UserProfile } from "@/types/user";
import { AvatarSection } from "./Sections/AvatarSection";
import { UsernameSection } from "./Sections/UsernameSection";
import { PreferencesSheet } from "./Sections/PreferencesSheet";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileHeaderProps {
  profile: UserProfile;
  onProfileUpdate: (updatedProfile: Partial<UserProfile>) => void;
}

export const ProfileHeader = ({ profile, onProfileUpdate }: ProfileHeaderProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar || "/placeholder.svg");
  const [username, setUsername] = useState(profile.username);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleProfileUpdate = async (updates: Partial<UserProfile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: updates.username,
          avatar_url: updates.avatar,
        })
        .eq('id', profile.id);

      if (error) {
        console.error("Profile update error:", error);
        toast({
          title: t("common.error"),
          description: t("profile.messages.updateError"),
          variant: "destructive",
        });
        return;
      }

      onProfileUpdate(updates);
      toast({
        title: t("common.success"),
        description: t("profile.messages.updateSuccess"),
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: t("common.error"),
        description: t("profile.messages.updateError"),
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AvatarSection
            username={username}
            selectedAvatar={selectedAvatar}
            onAvatarSelect={(avatar) => {
              setSelectedAvatar(avatar);
              handleProfileUpdate({ avatar });
            }}
          />
          <UsernameSection
            username={username}
            stats={profile.stats}
            isPremium={profile.isPremium}
            onUsernameChange={(newUsername) => {
              setUsername(newUsername);
              handleProfileUpdate({ username: newUsername });
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <PreferencesSheet />
        </div>
      </div>
    </Card>
  );
};
