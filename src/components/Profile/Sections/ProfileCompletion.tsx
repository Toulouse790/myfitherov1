
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserProfile } from "@/types/user";
import { CheckCircle2, Circle } from "lucide-react";

interface ProfileCompletionProps {
  profile: UserProfile;
}

export const ProfileCompletion = ({ profile }: ProfileCompletionProps) => {
  const profileItems = [
    { name: "Nom d'utilisateur", completed: !!profile.username },
    { name: "Avatar", completed: !!profile.avatar },
    { name: "Date de naissance", completed: !!profile.birthDate },
    { name: "Genre", completed: !!profile.gender },
    { name: "Taille", completed: !!profile.height },
    { name: "Poids", completed: !!profile.weight }
  ];
  
  const completedItems = profileItems.filter(item => item.completed).length;
  const completionPercentage = (completedItems / profileItems.length) * 100;

  if (completionPercentage >= 100) return null;

  return (
    <Card className="p-6 border-2 border-primary/10 bg-primary/5">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">Complétez votre profil</h3>
            <p className="text-sm text-muted-foreground">
              Un profil complet vous permet d'obtenir des recommandations personnalisées
            </p>
          </div>
          <span className="text-xl font-bold text-primary">
            {Math.round(completionPercentage)}%
          </span>
        </div>
        
        <Progress value={completionPercentage} className="h-2 mb-4" />
        
        <div className="grid grid-cols-2 gap-3">
          {profileItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {item.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span className={item.completed ? "text-green-700 dark:text-green-300" : "text-muted-foreground"}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
