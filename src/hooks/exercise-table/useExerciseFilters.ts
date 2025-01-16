import { useState } from "react";

export const useExerciseFilters = () => {
  const [publishFilter, setPublishFilter] = useState<boolean | null>(false);

  return {
    publishFilter,
    setPublishFilter,
  };
};