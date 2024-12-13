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

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 30;
const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

export const UsernameSection = ({ 
  username: initialUsername, 
  stats, 
  isPremium, 
  onUsernameChange 
}: UsernameSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(initialUsername);
  const { toast } = useToast();

  const validateUsername = (value: string) => {
    if (value.length < MIN_USERNAME_LENGTH) {
      return "Le nom d'utilisateur doit contenir au moins 3 caractères";
    }
    if (value.length > MAX_USERNAME_LENGTH) {
      return "Le nom d'utilisateur ne peut pas dépasser 30 caractères";
    }
    if (!USERNAME_REGEX.test(value)) {
      return "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores";
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateUsername(username);
    
    if (error) {
      toast({
        title: "Erreur de validation",
        description: error,
        variant: "destructive",
      });
      return;
    }
    
    onUsernameChange(username);
    toast({
      title: "Nom d'utilisateur mis à jour",
      description: "Votre nom d'utilisateur a été modifié avec succès",
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
              placeholder="Nouveau nom d'utilisateur"
              maxLength={MAX_USERNAME_LENGTH}
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