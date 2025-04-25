
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface ActionButtonsProps {
  onAdd: () => void;
}

export const ActionButtons = ({ onAdd }: ActionButtonsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-end mt-4">
      <Button 
        onClick={onAdd} 
        className="h-[36px] px-4 gap-2"
      >
        <Plus className="w-4 h-4" /> {t("common.add", { fallback: "Ajouter" })}
      </Button>
    </div>
  );
};
