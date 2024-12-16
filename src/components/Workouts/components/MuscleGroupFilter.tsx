import { muscleGroups } from "../workoutConstants";
import { Button } from "@/components/ui/button";

interface MuscleGroupFilterProps {
  selectedGroup: string;
  onGroupSelect: (group: string) => void;
}

export const MuscleGroupFilter = ({
  selectedGroup,
  onGroupSelect,
}: MuscleGroupFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedGroup === "" ? "default" : "outline"}
        onClick={() => onGroupSelect("")}
        className="whitespace-nowrap"
      >
        Tous les groupes
      </Button>
      {muscleGroups.map((group) => (
        <Button
          key={group.id}
          variant={selectedGroup === group.name ? "default" : "outline"}
          onClick={() => onGroupSelect(group.name)}
          className="whitespace-nowrap"
        >
          {group.name}
        </Button>
      ))}
    </div>
  );
};