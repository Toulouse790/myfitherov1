import { Button } from "@/components/ui/button";
import { Edit, Upload, Trash2, Filter, X } from "lucide-react";

interface AdminHeaderActionsProps {
  isEditing: boolean;
  onEditingChange: (editing: boolean) => void;
  onPublish: () => void;
  onDelete: () => void;
  onExport: () => void;
  selectedExercises: string[];
  onFilterClick?: () => void;
  onFilterReset?: () => void;
  hasActiveFilter?: boolean;
}

export const AdminHeaderActions = ({
  isEditing,
  onEditingChange,
  onPublish,
  onDelete,
  onExport,
  selectedExercises,
  onFilterClick,
  onFilterReset,
  hasActiveFilter,
}: AdminHeaderActionsProps) => {
  return (
    <div className="flex gap-2">
      {hasActiveFilter ? (
        <Button
          variant="outline"
          size="sm"
          onClick={onFilterReset}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Retirer le filtre
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={onFilterClick}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtrer
        </Button>
      )}
      <Button
        variant={isEditing ? "secondary" : "outline"}
        onClick={() => onEditingChange(!isEditing)}
        className="gap-2"
        size="sm"
      >
        <Edit className="w-4 h-4" />
        {isEditing ? "Terminer" : "Modifier"}
      </Button>
      <Button 
        variant="default"
        size="sm" 
        onClick={onPublish}
        className="gap-2 bg-green-600 hover:bg-green-700"
        disabled={selectedExercises.length === 0}
      >
        <Upload className="w-4 h-4" />
        Publier
      </Button>
      <Button 
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="gap-2"
        disabled={selectedExercises.length === 0}
      >
        <Trash2 className="w-4 h-4" />
        Supprimer
      </Button>
      <Button size="sm" onClick={onExport}>
        Exporter
      </Button>
    </div>
  );
};