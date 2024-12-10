import { AlertTriangle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isValueSuspicious } from "./constants";

interface NutritionalCellProps {
  value: number;
  type: "calories" | "proteins" | "carbs" | "fats";
  unit?: string;
}

const tooltipMessages = {
  calories: "Valeurs typiques: 0-500 kcal/100g",
  proteins: "Valeurs typiques: 0-50g/100g",
  carbs: "Valeurs typiques: 0-75g/100g",
  fats: "Valeurs typiques: 0-40g/100g",
};

export const NutritionalCell = ({ value, type, unit = "g" }: NutritionalCellProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="flex items-center gap-1">
          {value}{unit !== "g" ? "" : "g"}
          {isValueSuspicious(value, type) && (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipMessages[type]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};