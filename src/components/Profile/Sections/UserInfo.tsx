
import { UserProfile } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Users, Scale, Ruler, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/time";

interface UserInfoProps {
  profile: UserProfile;
  onUpdate: () => void;
}

export const UserInfo = ({ profile, onUpdate }: UserInfoProps) => {
  const navigate = useNavigate();
  
  const getObjectiveLabel = (objective: string | undefined) => {
    switch (objective) {
      case 'weight_loss':
        return 'Perte de poids';
      case 'muscle_gain':
        return 'Prise de muscle';
      case 'strength':
        return 'Force';
      case 'endurance':
        return 'Endurance';
      case 'maintenance':
        return 'Maintien';
      case 'general_health':
        return 'Santé générale';
      default:
        return 'Non défini';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Genre:</span>
            <span className="font-medium">
              {profile.gender === 'male' ? 'Homme' : 
               profile.gender === 'female' ? 'Femme' : 
               profile.gender === 'other' ? 'Autre' : 'Non défini'}
            </span>
          </div>
          
          {profile.birthDate && (
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Date de naissance:</span>
              <span className="font-medium">{formatDate(profile.birthDate)}</span>
            </div>
          )}
          
          {profile.weight && (
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Poids:</span>
              <span className="font-medium">{profile.weight} kg</span>
            </div>
          )}
          
          {profile.height && (
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Taille:</span>
              <span className="font-medium">{profile.height} cm</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Objectif principal:</span>
            <Badge variant="outline" className="font-medium">
              {getObjectiveLabel(profile.mainObjective)}
            </Badge>
          </div>
          
          {profile.preferences.equipment && profile.preferences.equipment.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Équipement disponible:</span>
              <div className="flex flex-wrap gap-2">
                {profile.preferences.equipment.map((item, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {item === 'home' ? 'Maison' : 
                     item === 'gym' ? 'Salle de sport' : 
                     item === 'minimal' ? 'Équipement minimal' : item}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {profile.goals.weeklyWorkouts && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Fréquence d'entraînement:</span>
              <span className="font-medium">{profile.goals.weeklyWorkouts} fois par semaine</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/personal-info')}
          className="mt-4"
        >
          Modifier mes informations
        </Button>
      </div>
    </div>
  );
};
