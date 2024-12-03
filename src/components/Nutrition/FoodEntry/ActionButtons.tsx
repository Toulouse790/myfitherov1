import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onAdd: () => void;
}

export const ActionButtons = ({ onAdd }: ActionButtonsProps) => {
  return (
    <div className="flex justify-end">
      <Button 
        onClick={onAdd} 
        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Plus className="w-4 h-4" /> Ajouter
      </Button>
    </div>
  );
};