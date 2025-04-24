
import { UserProfile } from "@/types/user";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface UserInfoProps {
  profile: UserProfile;
  onUpdate: () => void;
}

export const UserInfo = ({ profile, onUpdate }: UserInfoProps) => {
  const { t } = useLanguage();
  
  const renderInfoField = (label: string, value: string | number | null | undefined) => {
    if (!value) return null;
    
    return (
      <div>
        <label className="text-sm font-medium text-muted-foreground">{label}</label>
        <p className="mt-1">{value}</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {renderInfoField("Email", profile.email)}
        {renderInfoField(t("profile.birthDate"), profile.birthDate && new Date(profile.birthDate).toLocaleDateString())}
        {renderInfoField(t("profile.gender"), profile.gender && t(`profile.genders.${profile.gender}`))}
        {renderInfoField(t("profile.height"), profile.height ? `${profile.height} cm` : null)}
        {renderInfoField(t("profile.weight"), profile.weight ? `${profile.weight} kg` : null)}
        {renderInfoField(t("profile.mainObjective"), profile.mainObjective && t(`profile.objectives.${profile.mainObjective}`))}
      </div>
    </div>
  );
};
