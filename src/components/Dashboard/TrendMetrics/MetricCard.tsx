
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
  color: string;
  icon: React.ReactElement;
  description?: string;
  onClick?: () => void;
}

export const MetricCard = ({
  label,
  value,
  unit,
  color,
  icon,
  description,
  onClick
}: MetricCardProps) => {
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all hover:shadow-md",
        "hover:scale-[1.02] hover:bg-accent/50"
      )}
      onClick={onClick}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground">{label}</span>
            {description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className={color}>{icon}</div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
    </Card>
  );
};
