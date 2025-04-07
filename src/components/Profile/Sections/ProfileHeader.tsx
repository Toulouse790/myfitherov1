
import { UserProfile } from "@/types/user";
import { AvatarSection } from "./AvatarSection";
import { UsernameSection } from "./UsernameSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  profile: UserProfile;
  onProfileUpdate: (updatedProfile: Partial<UserProfile>) => void;
}

export const ProfileHeader = ({ profile, onProfileUpdate }: ProfileHeaderProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar || "/placeholder.svg");
  const [username, setUsername] = useState(profile.username);
  const [isEditMode, setIsEditMode] = useState(false);
  const { toast } = useToast();

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
          title: "Erreur",
          description: "Impossible de mettre à jour le profil. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      onProfileUpdate(updates);
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
      setIsEditMode(false);
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/5 shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <AvatarSection
              username={username}
              selectedAvatar={selectedAvatar}
              onAvatarSelect={(avatar) => {
                setSelectedAvatar(avatar);
                handleProfileUpdate({ avatar });
              }}
            />
            
            <div>
              <UsernameSection
                username={username}
                stats={profile.stats}
                isPremium={profile.isPremium}
                onUsernameChange={(newUsername) => {
                  setUsername(newUsername);
                  handleProfileUpdate({ username: newUsername });
                }}
              />
              
              {profile.email && (
                <div className="text-sm text-muted-foreground mt-1">
                  {profile.email}
                </div>
              )}
            </div>
          </div>
          
          <Button
            onClick={() => setIsEditMode(!isEditMode)} 
            variant="ghost" 
            size="sm"
            className="mt-4 sm:mt-0"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Modifier profil
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
