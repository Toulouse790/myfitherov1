
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { muscleGroups } from "../Workouts/workoutConstants";
import { useExerciseTranslation } from "@/hooks/use-exercise-translation";
import { useLanguage } from "@/contexts/LanguageContext";

interface MuscleGroupListProps {
  selectedGroup: string;
  onGroupSelect: (group: string) => void;
}

export const MuscleGroupList = ({ selectedGroup, onGroupSelect }: MuscleGroupListProps) => {
  const { translateMuscleGroupWithContext } = useExerciseTranslation();
  const { t } = useLanguage();
  
  const handleGroupSelect = (groupId: string) => {
    console.log("Selecting muscle group:", groupId);
    onGroupSelect(groupId);
  };

  return (
    <TabsList className="flex flex-nowrap overflow-x-auto mb-6 p-1 space-x-2">
      <TabsTrigger
        value=""
        onClick={() => handleGroupSelect("")}
        className={`whitespace-nowrap ${selectedGroup === "" ? 'bg-primary text-primary-foreground' : ''}`}
      >
        {t("workouts.allMuscleGroups")}
      </TabsTrigger>
      {muscleGroups.map((group) => (
        <TabsTrigger
          key={group.id}
          value={group.id}
          onClick={() => handleGroupSelect(group.id)}
          className={`whitespace-nowrap ${selectedGroup === group.id ? 'bg-primary text-primary-foreground' : ''}`}
        >
          {translateMuscleGroupWithContext(group.id)}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
