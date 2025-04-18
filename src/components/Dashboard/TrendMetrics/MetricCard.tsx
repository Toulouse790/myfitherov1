
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { MetricData } from "./types";

interface MetricCardProps {
  metric: MetricData;
  onClick: () => void;
}

export const MetricCard = ({
  metric,
  onClick
}: MetricCardProps) => {
  const { label, value, unit, color, icon, description, importance = "primary" } = metric;
  
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all border-l-4",
        "hover:shadow-md hover:scale-[1.02] hover:bg-accent/50",
        {
          "border-l-blue-500": color === "text-blue-500",
          "border-l-green-500": color === "text-green-500",
          "border-l-red-500": color === "text-red-500",
          "border-l-purple-500": color === "text-purple-500",
          "border-l-orange-500": color === "text-orange-500",
          "border-l-cyan-500": color === "text-cyan-500",
          "border-l-indigo-500": color === "text-indigo-500",
        },
        {
          "col-span-1": importance === "tertiary",
          "col-span-1 md:col-span-2": importance === "secondary",
          "col-span-2": importance === "primary",
        }
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
