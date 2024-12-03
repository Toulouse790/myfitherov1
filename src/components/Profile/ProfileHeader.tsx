import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Edit2, Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/types/user";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const AVATAR_OPTIONS = [
  "/placeholder.svg",
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
  "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e",
];

interface ProfileHeaderProps {
  profile: UserProfile;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const { toast } = useToast();
  const [username, setUsername] = useState(profile.username);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar || "/placeholder.svg");
  const [notifications, setNotifications] = useState(true);
  const [reminderTime, setReminderTime] = useState("30");

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      toast({
        title: "Erreur",
        description: "Le pseudo doit contenir au moins 3 caractères",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Pseudo mis à jour",
      description: "Votre pseudo a été modifié avec succès",
    });
    setIsEditingUsername(false);
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    toast({
      title: "Avatar mis à jour",
      description: "Votre avatar a été modifié avec succès",
    });
  };

  const handleNotificationChange = async (checked: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ meal_notifications: checked })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences de notification",
        variant: "destructive",
      });
      return;
    }

    setNotifications(checked);
    toast({
      title: "Préférences mises à jour",
      description: checked 
        ? "Vous recevrez des notifications pour vos repas" 
        : "Les notifications de repas ont été désactivées",
    });
  };

  const handleReminderTimeChange = async (value: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ reminder_time: parseInt(value) })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le délai de rappel",
        variant: "destructive",
      });
      return;
    }

    setReminderTime(value);
    toast({
      title: "Délai mis à jour",
      description: `Vous serez notifié ${value} minutes avant vos repas`,
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
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
        <div>
          <div className="flex items-center gap-2">
            {isEditingUsername ? (
              <form onSubmit={handleUsernameSubmit} className="flex items-center gap-2">
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-8"
                  placeholder="Nouveau pseudo"
                />
                <Button type="submit" size="sm">Sauvegarder</Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setUsername(profile.username);
                    setIsEditingUsername(false);
                  }}
                >
                  Annuler
                </Button>
              </form>
            ) : (
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {username}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingUsername(true)}
                  className="h-6 w-6"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </h2>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">Niveau {profile.stats.level}</Badge>
            {profile.isPremium && <Badge variant="default">Premium</Badge>}
          </div>
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Préférences de notification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">Notifications de repas</h4>
                <p className="text-sm text-muted-foreground">
                  Recevez des rappels pour vos repas
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={handleNotificationChange}
              />
            </div>
            {notifications && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Délai de rappel
                </label>
                <Select value={reminderTime} onValueChange={handleReminderTimeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un délai" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes avant</SelectItem>
                    <SelectItem value="30">30 minutes avant</SelectItem>
                    <SelectItem value="60">1 heure avant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};