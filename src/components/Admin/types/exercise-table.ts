export interface Location {
  id: string;
  name: string;
}

export interface Difficulty {
  id: string;
  name: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  location?: string[];
  difficulty?: string[];
}

export interface ExerciseTableContentProps {
  exercises: Exercise[];
  locations: Location[];
  difficulties: Difficulty[];
  onLocationChange: (exerciseId: string, location: string, checked: boolean) => void;
  onDifficultyChange: (exerciseId: string, difficulty: string, checked: boolean) => void;
}