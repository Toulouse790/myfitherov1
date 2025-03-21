
import { UserProfile } from "@/types/user";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Crown, Edit2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UsernameSectionProps {
  username: string;
  stats: UserProfile['stats'];
  isPremium: boolean;
  onUsernameChange: (username: string) => void;
}

export const UsernameSection = ({ 
  username, 
  stats, 
  isPremium, 
  onUsernameChange 
}: UsernameSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(username);

  const handleSave = () => {
    if (editedUsername.trim()) {
      onUsernameChange(editedUsername);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedUsername(username);
    setIsEditing(false);
  };

  return (
    <div className="flex-1">
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            value={editedUsername}
            onChange={(e) => setEditedUsername(e.target.value)}
            className="h-9 max-w-[200px]"
            autoFocus
          />
          <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8">
            <Check className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleCancel} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold truncate">
            {username || 'Utilisateur'}
          </h2>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setIsEditing(true)}
            className="h-8 w-8"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          {isPremium && (
            <Badge variant="premium" className="ml-1">
              <Crown className="h-3 w-3 mr-1 text-yellow-500" />
              Premium
            </Badge>
          )}
        </div>
      )}
      <div className="text-sm text-muted-foreground">
        Niveau {stats.level} • {stats.points} points
      </div>
    </div>
  );
};
