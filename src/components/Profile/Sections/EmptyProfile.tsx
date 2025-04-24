
import { User2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const EmptyProfile = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <User2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">
          {t("profile.unavailable")}
        </p>
      </div>
    </div>
  );
};
