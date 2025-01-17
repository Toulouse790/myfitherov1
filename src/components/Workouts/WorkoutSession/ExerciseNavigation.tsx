import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ExerciseNavigationProps {
  currentExerciseIndex: number;
  totalExercises: number;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export const ExerciseNavigation = ({
  currentExerciseIndex,
  totalExercises,
  onNavigate
}: ExerciseNavigationProps) => {
  return (
    <div className="fixed top-32 right-4 z-50 flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onNavigate('prev')}
        disabled={currentExerciseIndex === 0}
        className="bg-background"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onNavigate('next')}
        disabled={currentExerciseIndex === totalExercises - 1}
        className="bg-background"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};