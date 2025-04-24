
import { UserProfile } from "@/types/user";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface UserInfoProps {
  profile: UserProfile;
  onUpdate: () => void;
}

export const UserInfo = ({ profile, onUpdate }: UserInfoProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Email</label>
          <p className="mt-1">{profile.email}</p>
        </div>
        
        {profile.birthDate && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("profile.birthDate", { fallback: "Date de naissance" })}
            </label>
            <p className="mt-1">{new Date(profile.birthDate).toLocaleDateString()}</p>
          </div>
        )}
        
        {profile.gender && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("profile.gender", { fallback: "Genre" })}
            </label>
            <p className="mt-1">
              {t(`profile.genders.${profile.gender}`, {
                fallback: profile.gender === 'male' ? 'Homme' : 
                         profile.gender === 'female' ? 'Femme' : 'Autre'
              })}
            </p>
          </div>
        )}
        
        {profile.height && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("profile.height", { fallback: "Taille" })}
            </label>
            <p className="mt-1">{profile.height} cm</p>
          </div>
        )}
        
        {profile.weight && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("profile.weight", { fallback: "Poids" })}
            </label>
            <p className="mt-1">{profile.weight} kg</p>
          </div>
        )}
        
        {profile.mainObjective && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("profile.mainObjective", { fallback: "Objectif principal" })}
            </label>
            <p className="mt-1">
              {t(`profile.objectives.${profile.mainObjective}`, { 
                fallback: profile.mainObjective 
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
