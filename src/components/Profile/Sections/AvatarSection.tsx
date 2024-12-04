import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

interface AvatarSectionProps {
  username: string;
  selectedAvatar: string;
  onAvatarSelect: (avatar: string) => void;
}

const AVATAR_OPTIONS = [
  "/placeholder.svg",
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
  "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e",
];

export const AvatarSection = ({ username, selectedAvatar, onAvatarSelect }: AvatarSectionProps) => {
  const { toast } = useToast();

  const handleAvatarSelect = (avatarUrl: string) => {
    onAvatarSelect(avatarUrl);
    toast({
      title: "Avatar mis à jour",
      description: "Votre avatar a été modifié avec succès",
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative h-20 w-20 rounded-full">
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedAvatar} alt={username} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 rounded-full bg-primary p-1">
            <Camera className="h-4 w-4 text-primary-foreground" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Choisir un avatar</h4>
          <div className="grid grid-cols-4 gap-2">
            {AVATAR_OPTIONS.map((avatar) => (
              <Button
                key={avatar}
                variant="ghost"
                className="p-0"
                onClick={() => handleAvatarSelect(avatar)}
              >
                <Avatar>
                  <AvatarImage src={avatar} />
                  <AvatarFallback>Avatar</AvatarFallback>
                </Avatar>
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};