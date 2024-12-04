import { UserProfile } from "@/types/user";
import { AvatarSection } from "./Sections/AvatarSection";
import { UsernameSection } from "./Sections/UsernameSection";
import { PreferencesSheet } from "./Sections/PreferencesSheet";
import { useState } from "react";

interface ProfileHeaderProps {
  profile: UserProfile;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar || "/placeholder.svg");
  const [username, setUsername] = useState(profile.username);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <AvatarSection
          username={username}
          selectedAvatar={selectedAvatar}
          onAvatarSelect={setSelectedAvatar}
        />
        <UsernameSection
          username={username}
          stats={profile.stats}
          isPremium={profile.isPremium}
          onUsernameChange={setUsername}
        />
      </div>

      <div className="flex items-center gap-2">
        <PreferencesSheet />
      </div>
    </div>
  );
};