import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onAdd: () => void;
}

export const ActionButtons = ({ onAdd }: ActionButtonsProps) => {
  return (
    <div className="flex justify-end mt-4">
      <Button 
        onClick={onAdd} 
        className="h-[36px] px-4 gap-2"
      >
        <Plus className="w-4 h-4" /> Ajouter
      </Button>
    </div>
  );
};