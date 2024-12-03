import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  isCustomFood: boolean;
  onSuggest: () => void;
  onAdd: () => void;
}

export const ActionButtons = ({ isCustomFood, onSuggest, onAdd }: ActionButtonsProps) => {
  return (
    <div className="flex justify-end gap-2">
      {isCustomFood && (
        <Button 
          onClick={onSuggest}
          variant="outline"
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Suggérer
        </Button>
      )}
      <Button 
        onClick={onAdd} 
        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Plus className="w-4 h-4" /> Ajouter
      </Button>
    </div>
  );
};