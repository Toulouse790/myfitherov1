import { Button } from "@/components/ui/button";
import { SearchBar } from "./SearchBar";
import { AddExerciseButton } from "./AddExerciseButton";

interface LibraryHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedExercisesCount: number;
  onStartWorkout: () => void;
  onExerciseAdd: () => void;
}

export const LibraryHeader = ({
  searchQuery,
  setSearchQuery,
  selectedExercisesCount,
  onStartWorkout,
  onExerciseAdd,
}: LibraryHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
        <h1 className="text-xl sm:text-2xl font-bold">Bibliothèque d'exercices</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <AddExerciseButton onSuccess={onExerciseAdd} />
        </div>
      </div>
      {selectedExercisesCount > 0 && (
        <Button onClick={onStartWorkout} className="w-full sm:w-auto">
          C'est parti ! ({selectedExercisesCount})
        </Button>
      )}
    </div>
  );
};