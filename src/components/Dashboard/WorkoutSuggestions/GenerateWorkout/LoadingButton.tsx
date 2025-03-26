
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface LoadingButtonProps {
  isLoading: boolean;
  disabled: boolean;
  onClick: () => Promise<void>;
}

export const LoadingButton = ({ isLoading, disabled, onClick }: LoadingButtonProps) => {
  const { t } = useLanguage();
  
  return (
    <Button 
      onClick={onClick}
      className="w-full"
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t("workouts.generationLoading")}
        </>
      ) : (
        t("workouts.generateSession")
      )}
    </Button>
  );
};
