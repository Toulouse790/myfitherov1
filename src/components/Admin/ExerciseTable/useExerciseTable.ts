import { useExerciseFilters } from "@/hooks/exercise-table/useExerciseFilters";
import { useExerciseSelection } from "@/hooks/exercise-table/useExerciseSelection";
import { useExerciseData } from "@/hooks/exercise-table/useExerciseData";
import { useExerciseActions } from "@/hooks/exercise-table/useExerciseActions";

export const useExerciseTable = () => {
  const { publishFilter, setPublishFilter } = useExerciseFilters();
  const { 
    selectedExercises,
    showImageUpload,
    showVideoUpload,
    setShowImageUpload,
    setShowVideoUpload,
    setSelectedExercises,
    handleSelectAll 
  } = useExerciseSelection();
  const { exercises, isLoading } = useExerciseData(publishFilter);
  const { handleDelete, handlePublish } = useExerciseActions();

  return {
    exercises,
    isLoading,
    selectedExercises,
    showImageUpload,
    showVideoUpload,
    publishFilter,
    setShowImageUpload,
    setShowVideoUpload,
    setSelectedExercises,
    handleSelectAll: (checked: boolean) => handleSelectAll(checked, exercises),
    handleDelete,
    handlePublish: (exerciseId: string, name: string) => 
      handlePublish(exerciseId, name, publishFilter),
    setPublishFilter,
  };
};