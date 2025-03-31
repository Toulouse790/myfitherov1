
export interface WorkoutSuggestion {
  id: number | string;
  title: string;
  description: string;
  icon_name?: string;
  type: string;
  duration?: number | null;
  difficulty?: string | null;
  lastUsed?: string | null;
  equipment?: string;
  muscleGroups?: string[];
  refreshDaily?: boolean;
  programProgress?: number | null;
}

export interface WorkoutSuggestionsProps {
  showAllSuggestions?: boolean;
}

export interface GenerateWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workoutType?: string;
}
