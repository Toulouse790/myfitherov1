import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UsernameSectionProps {
  username: string;
  stats: {
    level: number;
  };
  isPremium: boolean;
  onUsernameChange: (username: string) => void;
}

export const UsernameSection = ({ username: initialUsername, stats, isPremium, onUsernameChange }: UsernameSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(initialUsername);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      toast({
        title: "Erreur",
        description: "Le pseudo doit contenir au moins 3 caractères",
        variant: "destructive",
      });
      return;
    }
    
    onUsernameChange(username);
    toast({
      title: "Pseudo mis à jour",
      description: "Votre pseudo a été modifié avec succès",
    });
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
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
                setUsername(initialUsername);
                setIsEditing(false);
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
              onClick={() => setIsEditing(true)}
              className="h-6 w-6"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </h2>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <Badge variant="secondary">Niveau {stats.level}</Badge>
        {isPremium && <Badge variant="default">Premium</Badge>}
      </div>
    </div>
  );
};