
import { muscleGroups } from "../workoutConstants";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useExerciseTranslation } from "@/hooks/use-exercise-translation";

interface MuscleGroupFilterProps {
  selectedGroup: string;
  onGroupSelect: (group: string) => void;
}

export const MuscleGroupFilter = ({
  selectedGroup,
  onGroupSelect,
}: MuscleGroupFilterProps) => {
  const { t } = useLanguage();
  const { translateMuscleGroupWithContext } = useExerciseTranslation();
  
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedGroup === "" ? "default" : "outline"}
        onClick={() => onGroupSelect("")}
        className="whitespace-nowrap"
      >
        {t("workouts.allMuscleGroups")}
      </Button>
      {muscleGroups.map((group) => (
        <Button
          key={group.id}
          variant={selectedGroup === group.id ? "default" : "outline"}
          onClick={() => onGroupSelect(group.id)}
          className="whitespace-nowrap"
        >
          {translateMuscleGroupWithContext(group.id)}
        </Button>
      ))}
    </div>
  );
};
