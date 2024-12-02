import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, SortAsc, SortDesc } from "lucide-react";
import { difficultyLevels } from "../workoutConstants";
import { useIsMobile } from "@/hooks/use-mobile";

interface FilterControlsProps {
  difficulty: string;
  location: string;
  sortOrder: "asc" | "desc";
  onDifficultyChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSortOrderChange: () => void;
  onReset: () => void;
}

export const FilterControls = ({
  difficulty,
  location,
  sortOrder,
  onDifficultyChange,
  onLocationChange,
  onSortOrderChange,
  onReset,
}: FilterControlsProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
      <Select value={difficulty} onValueChange={onDifficultyChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Difficulté" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes</SelectItem>
          {difficultyLevels.map((level) => (
            <SelectItem key={level.id} value={level.id}>
              {level.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={location} onValueChange={onLocationChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Lieu d'entraînement" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous</SelectItem>
          <SelectItem value="home">Maison</SelectItem>
          <SelectItem value="gym">Salle de sport</SelectItem>
          <SelectItem value="outdoor">Extérieur</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          size="icon"
          onClick={onSortOrderChange}
          className="h-10 w-10"
        >
          {sortOrder === "asc" ? (
            <SortAsc className="h-4 w-4" />
          ) : (
            <SortDesc className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={onReset}
        >
          <Filter className="h-4 w-4" />
          {!isMobile && "Réinitialiser"}
        </Button>
      </div>
    </div>
  );
};