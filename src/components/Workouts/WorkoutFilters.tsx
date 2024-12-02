import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { muscleGroups, difficultyLevels } from "./workoutConstants";
import { Filter, SortAsc, SortDesc } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface WorkoutFiltersProps {
  muscleGroup: string;
  difficulty: string;
  location: string;
  sortOrder: "asc" | "desc";
  onMuscleGroupChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSortOrderChange: () => void;
  onReset: () => void;
}

export const WorkoutFilters = ({
  muscleGroup,
  difficulty,
  location,
  sortOrder,
  onMuscleGroupChange,
  onDifficultyChange,
  onLocationChange,
  onSortOrderChange,
  onReset,
}: WorkoutFiltersProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {muscleGroups.map((muscle) => (
          <Card 
            key={muscle.id} 
            className={`cursor-pointer transition-colors hover:bg-accent overflow-hidden ${
              muscleGroup === muscle.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onMuscleGroupChange(muscle.id === muscleGroup ? "all" : muscle.id)}
          >
            <CardContent className="p-0">
              <AspectRatio ratio={3/2}>
                <img 
                  src={muscle.image} 
                  alt={muscle.name}
                  className="object-cover w-full h-full brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xs sm:text-sm font-medium text-white drop-shadow-lg">
                    {muscle.name}
                  </p>
                </div>
              </AspectRatio>
            </CardContent>
          </Card>
        ))}
      </div>

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
      </div>

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