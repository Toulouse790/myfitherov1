import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { UserProfileType } from "@/types/user";

interface ProfileHeaderProps {
  profile: UserProfileType;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const { toast } = useToast();

  const handleAvatarUpload = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "Le changement d'avatar sera bientôt disponible",
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="relative h-20 w-20 rounded-full">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar} alt={profile.username} />
                <AvatarFallback>{profile.username[0]}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 rounded-full bg-primary p-1">
                <Camera className="h-4 w-4 text-primary-foreground" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60">
            <div className="space-y-2">
              <h4 className="font-medium">Photo de profil</h4>
              <Button onClick={handleAvatarUpload} className="w-full">
                Changer l'avatar
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <div>
          <h2 className="text-2xl font-bold">{profile.username}</h2>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">Niveau {profile.stats.level}</Badge>
            {profile.isPremium && <Badge variant="default">Premium</Badge>}
          </div>
        </div>
      </div>
    </div>
  );
};