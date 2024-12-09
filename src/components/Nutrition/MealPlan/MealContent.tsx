interface MealContentProps {
  meal: {
    name: string;
    calories: number;
    proteins: number;
    preparation?: string;
  };
}

export const MealContent = ({ meal }: MealContentProps) => {
  return (
    <div className="p-4 pt-0 space-y-4 text-sm">
      <div>
        <p className="font-medium">{meal.name}</p>
        <p className="text-muted-foreground">
          {meal.calories} kcal | {meal.proteins}g protéines
        </p>
        {meal.preparation && (
          <p className="mt-2 text-sm text-muted-foreground italic">
            💡 {meal.preparation}
          </p>
        )}
      </div>
    </div>
  );
};