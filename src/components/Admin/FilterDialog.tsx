
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { muscleGroups } from "../Workouts/workoutConstants";
import { reverseTranslateMuscleGroup } from "@/utils/muscleGroupTranslations";

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilterApply: (muscleGroup: string) => void;
}

export const FilterDialog = ({ open, onOpenChange, onFilterApply }: FilterDialogProps) => {
  const handleFilterApply = (groupId: string) => {
    console.log('Applying filter with group:', groupId);
    onFilterApply(groupId.toLowerCase());
    onOpenChange(false); // Ferme la boîte de dialogue après la sélection
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtrer par groupe musculaire</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {muscleGroups.map((group) => (
            <Button
              key={group.id}
              onClick={() => handleFilterApply(group.id)}
              className="w-full justify-start"
            >
              {group.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
