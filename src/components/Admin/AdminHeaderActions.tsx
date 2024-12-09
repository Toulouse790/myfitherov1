import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface AdminHeaderActionsProps {
  selectedExercises: string[];
  onPublish: () => void;
}

export const AdminHeaderActions = ({
  selectedExercises,
  onPublish,
}: AdminHeaderActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="default"
        size="sm" 
        onClick={onPublish}
        className="gap-2 bg-green-600 hover:bg-green-700"
        disabled={selectedExercises.length === 0}
      >
        <Upload className="w-4 h-4" />
        Publier les exercices sélectionnés
      </Button>
    </div>
  );
};