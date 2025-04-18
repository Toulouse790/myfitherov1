
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

interface MetricHeaderProps {
  title: string;
  period: string;
  onPeriodChange: (days: number) => void;
}

export const MetricHeader = ({ title, period, onPeriodChange }: MetricHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs h-7 px-2">
            {period}
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onPeriodChange(7)}>
            {t("workouts.periodOptions.sevenDays", { fallback: "7 derniers jours" })}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPeriodChange(14)}>
            {t("workouts.periodOptions.fourteenDays", { fallback: "14 derniers jours" })}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPeriodChange(30)}>
            {t("workouts.periodOptions.thirtyDays", { fallback: "30 derniers jours" })}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
