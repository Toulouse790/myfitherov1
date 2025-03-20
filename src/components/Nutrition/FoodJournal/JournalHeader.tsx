
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NutrientTotals {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}

interface JournalHeaderProps {
  totals: NutrientTotals;
}

export const JournalHeader = ({ totals }: JournalHeaderProps) => {
  return (
    <CardTitle className="flex items-center justify-between dark:text-white">
      <span>Journal alimentaire</span>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-normal dark:text-gray-200 dark:border-gray-600">
          {totals.calories} kcal
        </Badge>
        <Badge variant="outline" className="font-normal dark:text-gray-200 dark:border-gray-600">
          {totals.proteins}g protéines
        </Badge>
      </div>
    </CardTitle>
  );
};
