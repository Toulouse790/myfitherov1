export interface WorkoutSuggestion {
  id: number;
  title: string;
  description: string;
  icon_name: string;
  type: string;
}

export interface WorkoutSuggestionsProps {
  onSelect: (type: string) => void;
}