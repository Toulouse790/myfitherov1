
export interface GenerateWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workoutType?: string;
  initialDuration?: number;
}

export interface WorkoutSuggestion {
  id: number | string;
  title: string;
  description: string;
  type: string;
  duration?: number | null;
  difficulty?: string | null;
  muscleGroups?: string[];
  icon_name?: string;
  lastUsed?: string | null;
  refreshDaily?: boolean;
  equipment?: string;
  restTime?: string;
  programProgress?: string | number | null;
}

export interface WorkoutSuggestionsProps {
  showAllSuggestions?: boolean;
}
