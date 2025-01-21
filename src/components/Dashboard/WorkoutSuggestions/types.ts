export interface WorkoutSuggestion {
  id: string;
  title: string;
  description: string;
  type: string;
  duration?: number | null;
  difficulty?: string | null;
  lastUsed?: Date | null;
  refreshDaily?: boolean;
  equipment?: string;
  muscleGroups?: string[];
  programProgress?: number | null;
}

export interface WorkoutSuggestionsProps {
  showAllSuggestions?: boolean;
}