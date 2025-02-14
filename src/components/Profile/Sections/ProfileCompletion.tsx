
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserProfile } from "@/types/user";

interface ProfileCompletionProps {
  profile: UserProfile;
}

export const ProfileCompletion = ({ profile }: ProfileCompletionProps) => {
  const totalFields = 6;
  let completedFields = 0;
  if (profile.username) completedFields++;
  if (profile.avatar) completedFields++;
  if (profile.birthDate) completedFields++;
  if (profile.gender) completedFields++;
  if (profile.height) completedFields++;
  if (profile.weight) completedFields++;
  
  const completionPercentage = (completedFields / totalFields) * 100;

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
        <Progress value={completionPercentage} className="h-2" />
      </div>
    </Card>
  );
};
