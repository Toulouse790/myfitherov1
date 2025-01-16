import { Card } from "@/components/ui/card";
import { MealContent } from "./MealContent";
import { MealHeader } from "./MealHeader";
import { MealSectionProps } from "./types";

export const MealSection = ({
  type,
  label,
  mealEntries,
  generatedMeal,
  isExpanded,
  onToggle
}: MealSectionProps) => {
  const isSnack = type === 'morning_snack' || type === 'afternoon_snack';
  
  return (
    <Card className="overflow-hidden">
      <MealHeader
        label={label}
        mealStatus={mealEntries.length > 0 ? 'taken' : undefined}
        isExpanded={isExpanded}
        onToggle={onToggle}
      />
      {isExpanded && (
        <MealContent
          mealEntries={mealEntries}
          generatedMeal={generatedMeal}
          type={type}
        />
      )}
    </Card>
  );
};