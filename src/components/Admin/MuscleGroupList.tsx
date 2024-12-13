import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { muscleGroups } from "../Workouts/workoutConstants";

interface MuscleGroupListProps {
  selectedGroup: string;
  onGroupSelect: (group: string) => void;
}

export const MuscleGroupList = ({ selectedGroup, onGroupSelect }: MuscleGroupListProps) => {
  const handleGroupSelect = (groupId: string) => {
    console.log('=== MuscleGroupList Debug ===');
    console.log('Selecting muscle group:', groupId);
    console.log('Current selected group:', selectedGroup);
    onGroupSelect(groupId);
  };

  return (
    <TabsList className="flex flex-nowrap overflow-x-auto mb-6 p-1 space-x-2">
      {muscleGroups.map((group) => {
        console.log('Rendering muscle group:', { id: group.id, name: group.name });
        return (
          <TabsTrigger
            key={group.id}
            value={group.id}
            onClick={() => handleGroupSelect(group.id)}
            className={`whitespace-nowrap ${selectedGroup === group.id ? 'bg-primary text-primary-foreground' : ''}`}
          >
            {group.name}
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
};