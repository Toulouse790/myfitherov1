import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface AdminHeaderActionsProps {
  selectedExercises: string[];
  onDelete: (exerciseIds: string[]) => void;
}

export const AdminHeaderActions = ({
  selectedExercises,
  onDelete,
}: AdminHeaderActionsProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (selectedExercises.length === 0) return;
    
    setIsDeleting(true);
    try {
      await onDelete(selectedExercises);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between w-full">
      <Button 
        variant="destructive"
        size="sm" 
        onClick={handleDelete}
        className="gap-2"
        disabled={selectedExercises.length === 0 || isDeleting}
      >
        <Trash2 className="w-4 h-4" />
        Supprimer les exercices sélectionnés
      </Button>
    </div>
  );
};