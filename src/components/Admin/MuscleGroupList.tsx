import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { muscleGroups } from "../Workouts/workoutConstants";

interface MuscleGroupListProps {
  selectedGroup: string;
  onGroupSelect: (group: string) => void;
}

export const MuscleGroupList = ({ selectedGroup, onGroupSelect }: MuscleGroupListProps) => {
  return (
    <TabsList className="flex flex-nowrap overflow-x-auto mb-6 p-1 space-x-2">
      {muscleGroups.map((group) => (
        <TabsTrigger
          key={group.id}
          value={group.name}
          onClick={() => onGroupSelect(group.name)}
          className={`whitespace-nowrap ${selectedGroup === group.name ? 'bg-primary text-primary-foreground' : ''}`}
        >
          {group.name}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};