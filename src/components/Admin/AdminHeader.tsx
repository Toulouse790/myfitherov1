import { useExerciseManagement } from "@/hooks/use-exercise-management";

interface AdminHeaderProps {
  selectedExercises: string[];
  onExercisesDeleted: () => void;
  onFilterClick: () => void;
  onFilterReset: () => void;
  hasActiveFilter: boolean;
  showPublishButton: boolean;
}

export const AdminHeader = ({ 
  onFilterClick,
  onFilterReset,
  hasActiveFilter,
}: AdminHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Gestion des exercices</h1>
        <p className="text-muted-foreground">Liste des exercices</p>
      </div>
    </div>
  );
};