import { useState } from "react";

export const useExerciseSelection = () => {
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showImageUpload, setShowImageUpload] = useState<string | null>(null);
  const [showVideoUpload, setShowVideoUpload] = useState<string | null>(null);

  const handleSelectAll = (checked: boolean, exercises: any[]) => {
    setSelectedExercises(checked ? exercises.map(e => e.id) : []);
  };

  return {
    selectedExercises,
    showImageUpload,
    showVideoUpload,
    setShowImageUpload,
    setShowVideoUpload,
    setSelectedExercises,
    handleSelectAll,
  };
};