import { useExerciseManagement } from "@/hooks/use-exercise-management";
import { AdminHeaderActions } from "./AdminHeaderActions";

interface AdminHeaderProps {
  selectedExercises: string[];
  onExercisesDeleted: () => void;
  onFilterClick: () => void;
  onFilterReset: () => void;
  hasActiveFilter: boolean;
  showPublishButton: boolean;
}

export const AdminHeader = ({ 
  selectedExercises,
  onExercisesDeleted,
  onFilterClick,
  onFilterReset,
  hasActiveFilter,
  showPublishButton
}: AdminHeaderProps) => {
  const { handlePublish } = useExerciseManagement(onExercisesDeleted);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Gestion des exercices</h1>
        <p className="text-muted-foreground">
          {showPublishButton 
            ? "Sélectionnez les exercices à publier"
            : "Liste des exercices publiés"}
        </p>
      </div>
      {showPublishButton && (
        <AdminHeaderActions
          selectedExercises={selectedExercises}
          onPublish={() => handlePublish(selectedExercises)}
        />
      )}
    </div>
  );
};