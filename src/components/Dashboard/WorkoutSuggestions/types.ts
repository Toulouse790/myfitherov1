
export interface GenerateWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workoutType?: string;
  initialDuration?: number;
}
