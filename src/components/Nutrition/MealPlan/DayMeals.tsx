import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MealContent } from "./MealContent";
import type { DayMealsProps } from "./types";

export const DayMeals = ({ 
  day,
  meals, 
  mealTitles,
  isFirst = false,
  isTrainingDay = false,
  workoutTime 
}: DayMealsProps) => {
  return (
    <Card className={isFirst ? "" : "mt-6"}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{day}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(meals).map(([mealType, mealData]) => {
          const mealTitle = mealTitles[mealType as keyof typeof mealTitles];
          if (!mealTitle) return null;

          return (
            <MealContent
              key={mealType}
              title={mealTitle.title}
              meal={mealData}
              defaultTime={mealTitle.defaultTime}
              isTrainingTime={isTrainingDay && (
                (workoutTime === 'morning' && mealType === 'breakfast') ||
                (workoutTime === 'evening' && mealType === 'dinner')
              )}
            />
          );
        })}
      </CardContent>
    </Card>
  );
};