interface MealContentProps {
  meal: {
    name: string;
    calories: number;
    proteins: number;
    carbs?: number;
    fats?: number;
    quantities?: Array<{ item: string; amount: string; }>;
  };
}

export const MealContent = ({ meal }: MealContentProps) => {
  return (
    <div className="p-4 pt-0 space-y-4 text-sm">
      <div>
        <p className="font-medium">{meal.name}</p>
        <p className="text-muted-foreground">
          {meal.calories} kcal | {meal.proteins}g protéines
          {meal.carbs !== undefined && ` | ${meal.carbs}g glucides`}
          {meal.fats !== undefined && ` | ${meal.fats}g lipides`}
        </p>
        {meal.quantities && meal.quantities.length > 0 && (
          <div className="mt-2 space-y-1">
            <p className="text-sm font-medium text-gray-700">Ingrédients :</p>
            <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
              {meal.quantities.map((item, index) => (
                <li key={index}>
                  {item.item}: {item.amount}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};