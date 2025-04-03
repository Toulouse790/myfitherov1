
export interface GenerateWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workoutType?: string;
  initialDuration?: number;
}

export interface WorkoutSuggestion {
  id: number;
  title: string;
  description: string;
  type: string;
  duration: number;
  difficulty: string;
  muscleGroups: string[];
}

export interface WorkoutSuggestionsProps {
  showAllSuggestions?: boolean;
}
