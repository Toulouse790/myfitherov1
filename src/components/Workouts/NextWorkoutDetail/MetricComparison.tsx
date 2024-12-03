import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, LucideIcon } from "lucide-react";

interface MetricComparisonProps {
  planned: number;
  actual: number;
  unit: string;
  icon: LucideIcon;
  label?: string;
}

export const MetricComparison = ({ planned, actual, unit, icon: Icon, label }: MetricComparisonProps) => {
  const isExceeded = actual > planned;
  const difference = actual - planned;
  
  return (
    <Card className="p-4 flex items-center gap-2 bg-primary/5">
      <Icon className="h-5 w-5 text-primary" />
      <div className="flex items-center gap-2">
        <span>{label && `${label}: `}{actual} {unit}</span>
        {isExceeded ? (
          <div className="flex items-center text-green-500 text-sm">
            <ArrowUp className="h-3 w-3" />
            <span>+{difference}</span>
          </div>
        ) : difference < 0 ? (
          <div className="flex items-center text-orange-500 text-sm">
            <ArrowDown className="h-3 w-3" />
            <span>{difference}</span>
          </div>
        ) : null}
      </div>
    </Card>
  );
};