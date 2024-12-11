import { Button } from "@/components/ui/button";
import { SearchBar } from "./SearchBar";

interface LibraryHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedExercisesCount: number;
  onStartWorkout: () => void;
}

export const LibraryHeader = ({
  searchQuery,
  setSearchQuery,
  selectedExercisesCount,
  onStartWorkout,
}: LibraryHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-end">
        {selectedExercisesCount > 0 && (
          <Button onClick={onStartWorkout}>
            Commencer la séance
          </Button>
        )}
      </div>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
    </div>
  );
};