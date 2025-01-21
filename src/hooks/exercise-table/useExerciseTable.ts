import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useExerciseFilters } from "./useExerciseFilters";
import { useExerciseSelection } from "./useExerciseSelection";
import { useExerciseData } from "./useExerciseData";
import { useExerciseActions } from "./useExerciseActions";

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