import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  target: string | number;
  icon: React.ReactNode;
  className?: string;
}

export const DashboardCard = ({ title, value, target, icon, className }: DashboardCardProps) => {
  const normalizedValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  const normalizedTarget = typeof target === 'string' ? parseFloat(target.replace(/,/g, '')) : target;
  const progress = (normalizedValue / normalizedTarget) * 100;
  const isAhead = normalizedValue > normalizedTarget;

  return (
    <Card className={cn("p-4 animate-fade-up", className)}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="text-primary">{icon}</div>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Objectif: {target}
              {isAhead ? (
                <ArrowUp className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDown className="w-4 h-4 text-orange-500" />
              )}
            </p>
          </div>
          <div className="text-sm font-medium">
            {progress.toFixed(0)}%
          </div>
        </div>

        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-500",
              isAhead ? "bg-green-500" : "bg-primary",
              progress > 100 && "bg-green-500"
            )}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </Card>
  );
};