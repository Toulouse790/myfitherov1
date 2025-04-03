
import { useLanguage } from "@/contexts/LanguageContext";
import { muscleGroups } from "@/components/Workouts/workoutConstants";
import { Card } from "@/components/ui/card";
import { useExerciseTranslation } from "@/hooks/use-exercise-translation";

interface MuscleGroupGridProps {
  onSelect: (muscleGroup: string) => void;
  selectedGroup?: string | null;
}

export function MuscleGroupGrid({ onSelect, selectedGroup }: MuscleGroupGridProps) {
  const { t } = useLanguage();
  const { translateMuscleGroupWithContext } = useExerciseTranslation();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {muscleGroups.map((group) => (
        <Card 
          key={group.id}
          className={`p-3 cursor-pointer transition-all hover:bg-primary/10 ${
            selectedGroup === group.id ? 'ring-2 ring-primary bg-primary/10' : ''
          }`}
          onClick={() => onSelect(group.id)}
        >
          <div className="text-center space-y-1">
            <div className="flex justify-center">
              {group.icon && <group.icon className="h-6 w-6 text-primary" />}
            </div>
            <p className="text-sm font-medium">
              {translateMuscleGroupWithContext(group.id)}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
