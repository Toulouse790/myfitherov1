import { useExerciseManagement } from "@/hooks/use-exercise-management";
import { AdminHeaderActions } from "./AdminHeaderActions";

interface AdminHeaderProps {
  isEditing: boolean;
  onEditingChange: (editing: boolean) => void;
  selectedExercises: string[];
  onExercisesDeleted: () => void;
}

export const AdminHeader = ({ 
  isEditing, 
  onEditingChange,
  selectedExercises,
  onExercisesDeleted
}: AdminHeaderProps) => {
  const { handlePublish, handleDelete, handleExport } = useExerciseManagement(onExercisesDeleted);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
        <p className="text-muted-foreground">
          Gérez votre application et suivez vos statistiques
        </p>
      </div>
      <AdminHeaderActions
        isEditing={isEditing}
        onEditingChange={onEditingChange}
        onPublish={() => handlePublish(selectedExercises)}
        onDelete={() => handleDelete(selectedExercises)}
        onExport={handleExport}
        selectedExercises={selectedExercises}
      />
    </div>
  );
};