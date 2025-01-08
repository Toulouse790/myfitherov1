export interface WorkoutSuggestion {
  id: number | string;
  title: string;
  description: string;
  icon_name: string;
  type: string;
}

export interface WorkoutSuggestionsProps {
  showAllSuggestions?: boolean;
}