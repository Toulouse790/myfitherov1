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
  const handleFilterApply = (groupName: string) => {
    const englishGroup = reverseTranslateMuscleGroup(groupName);
    console.log('Applying filter with group:', groupName);
    console.log('Translated to English:', englishGroup);
    onFilterApply(englishGroup.toLowerCase());
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
              variant="outline"
              onClick={() => handleFilterApply(group.name)}
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