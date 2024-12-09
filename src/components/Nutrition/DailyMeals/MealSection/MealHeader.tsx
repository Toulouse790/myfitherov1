import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MealHeaderProps {
  label: string;
  mealStatus: 'taken' | 'skipped' | null;
  isExpanded: boolean;
  onToggle: () => void;
}

export const MealHeader = ({ label, mealStatus, isExpanded, onToggle }: MealHeaderProps) => {
  return (
    <Button
      variant="ghost"
      className="w-full justify-between p-4 h-auto hover:bg-gray-100/50 transition-colors"
      onClick={onToggle}
    >
      <div className="text-left flex items-center gap-2">
        <div>
          <div className="font-medium text-gray-900">{label}</div>
          {mealStatus && (
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              {mealStatus === 'taken' ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <X className="h-3 w-3 text-red-500" />
              )}
              {mealStatus === 'taken' ? 'Pris' : 'Non pris'}
            </div>
          )}
        </div>
      </div>
      {isExpanded ? (
        <ChevronUp className="h-4 w-4 text-gray-500" />
      ) : (
        <ChevronDown className="h-4 w-4 text-gray-500" />
      )}
    </Button>
  );
};