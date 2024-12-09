import { useExerciseManagement } from "@/hooks/use-exercise-management";
import { AdminHeaderActions } from "./AdminHeaderActions";

interface AdminHeaderProps {
  selectedExercises: string[];
  onExercisesDeleted: () => void;
}

export const AdminHeader = ({ 
  selectedExercises,
  onExercisesDeleted,
}: AdminHeaderProps) => {
  const { handlePublish } = useExerciseManagement(onExercisesDeleted);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Gestion des exercices</h1>
        <p className="text-muted-foreground">
          Publiez les exercices pour les rendre disponibles aux utilisateurs
        </p>
      </div>
      <AdminHeaderActions
        selectedExercises={selectedExercises}
        onPublish={() => handlePublish(selectedExercises)}
      />
    </div>
  );
};