
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppleIcon, FishIcon, WheatIcon } from "lucide-react";

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
    <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-between dark:text-white">
      <span className="text-lg sm:text-xl font-bold">Journal alimentaire</span>
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <Badge variant="outline" className="text-xs sm:text-sm font-normal bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
          {totals.calories} kcal
        </Badge>
        <Badge variant="outline" className="text-xs sm:text-sm font-normal bg-gray-50 flex items-center gap-1 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
          <FishIcon className="h-3 w-3 text-blue-500" />
          {totals.proteins}g
        </Badge>
        <Badge variant="outline" className="text-xs sm:text-sm font-normal bg-gray-50 flex items-center gap-1 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
          <WheatIcon className="h-3 w-3 text-amber-500" />
          {totals.carbs}g
        </Badge>
        <Badge variant="outline" className="text-xs sm:text-sm font-normal bg-gray-50 flex items-center gap-1 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
          <AppleIcon className="h-3 w-3 text-rose-500" />
          {totals.fats}g
        </Badge>
      </div>
    </CardTitle>
  );
};
