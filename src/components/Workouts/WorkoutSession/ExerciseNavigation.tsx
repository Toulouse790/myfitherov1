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
  return null; // Ne rend plus rien
};