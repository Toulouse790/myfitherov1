import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps {
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
}

export const LoadingButton = ({ isLoading, disabled, onClick }: LoadingButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      className="w-full"
      disabled={disabled}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Génération en cours...
        </>
      ) : (
        "Générer un programme"
      )}
    </Button>
  );
};