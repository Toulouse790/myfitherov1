
import { WorkoutCard } from "./WorkoutCard";
import { WorkoutSuggestion } from "./types";

interface SuggestionsGridProps {
  suggestions: WorkoutSuggestion[];
  onSelectWorkout: (type: string) => void;
}

export const SuggestionsGrid = ({ 
  suggestions, 
  onSelectWorkout 
}: SuggestionsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {suggestions.map((suggestion: WorkoutSuggestion) => (
        <WorkoutCard
          key={suggestion.id}
          title={suggestion.title}
          description={suggestion.description}
          sessionId={String(suggestion.id)}
          duration={suggestion.duration}
          difficulty={suggestion.difficulty}
          muscleGroups={suggestion.muscleGroups}
          onSelect={() => onSelectWorkout(suggestion.type)}
        />
      ))}
    </div>
  );
};
