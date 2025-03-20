
import { ChevronDown } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface MetricHeaderProps {
  title: string;
  period: string;
  onPeriodChange?: (days: number) => void;
}

export const MetricHeader = ({ 
  title, 
  period, 
  onPeriodChange 
}: MetricHeaderProps) => {
  const periods = [
    { label: "7 derniers jours", value: 7 },
    { label: "14 derniers jours", value: 14 },
    { label: "30 derniers jours", value: 30 }
  ];

  const handlePeriodChange = (days: number) => {
    if (onPeriodChange) {
      onPeriodChange(days);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-gray-200 flex items-center gap-1 text-xs hover:text-white transition-colors">
            {period}
            <ChevronDown className="w-3 h-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dark:bg-gray-800">
          {periods.map((p) => (
            <DropdownMenuItem 
              key={p.value}
              onClick={() => handlePeriodChange(p.value)}
              className="dark:hover:bg-gray-700 dark:focus:bg-gray-700"
            >
              {p.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
