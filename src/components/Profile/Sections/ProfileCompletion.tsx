
import { UserProfile } from "@/types/user";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, User, Target, DumbbellIcon, Scale, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProfileCompletionProps {
  profile: UserProfile;
}

export const ProfileCompletion = ({ profile }: ProfileCompletionProps) => {
  const navigate = useNavigate();
  
  // Calculate profile completion percentage
  const calculateCompletion = () => {
    let completed = 0;
    let total = 6; // Total number of fields we're checking
    
    if (profile.username) completed++;
    if (profile.avatar) completed++;
    if (profile.gender) completed++;
    if (profile.weight) completed++;
    if (profile.height) completed++;
    if (profile.mainObjective) completed++;
    
    const percentage = Math.floor((completed / total) * 100);
    return {
      percentage,
      completed,
      total
    };
  };
  
  const completion = calculateCompletion();
  
  // Determine which fields are incomplete
  const incompleteFields = [
    { name: 'Nom d'utilisateur', value: profile.username, icon: <User className="h-4 w-4" /> },
    { name: 'Photo de profil', value: profile.avatar, icon: <User className="h-4 w-4" /> },
    { name: 'Genre', value: profile.gender, icon: <User className="h-4 w-4" /> },
    { name: 'Poids', value: profile.weight, icon: <Scale className="h-4 w-4" /> },
    { name: 'Taille', value: profile.height, icon: <Ruler className="h-4 w-4" /> },
    { name: 'Objectif principal', value: profile.mainObjective, icon: <Target className="h-4 w-4" /> }
  ].filter(field => !field.value);
  
  // Complete profile CTA
  const handleCompleteProfile = () => {
    navigate('/personal-info');
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {completion.percentage === 100 ? (
              <CheckCircle2 className="text-green-500 h-5 w-5" />
            ) : (
              <AlertCircle className="text-amber-500 h-5 w-5" />
            )}
            Profil complété à {completion.percentage}%
          </h3>
          <span className="text-sm text-muted-foreground">
            {completion.completed}/{completion.total}
          </span>
        </div>
        
        <Progress 
          value={completion.percentage} 
          className="h-2 mb-4" 
        />
        
        {incompleteFields.length > 0 && (
          <div className="mt-4">
            <div className="text-sm text-muted-foreground mb-2">
              Pour compléter votre profil, ajoutez les informations suivantes:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {incompleteFields.map((field, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-1.5 text-sm border rounded-md px-2 py-1"
                >
                  {field.icon}
                  {field.name}
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCompleteProfile}
              className="mt-2"
            >
              <DumbbellIcon className="mr-2 h-4 w-4" />
              Compléter mon profil
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
